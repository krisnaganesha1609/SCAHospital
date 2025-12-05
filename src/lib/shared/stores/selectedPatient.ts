// src/lib/shared/stores/selectedPatient.ts
import { writable } from 'svelte/store';
import type { Patient } from '$lib/shared/entities';

// store holds either a Patient instance or null
export const selectedPatientStore = writable<Patient | null>(null);

// helper to persist into sessionStorage (POJO)
export function persistSelectedPatient(patient: Patient | null) {
	if (patient === null) {
		sessionStorage.removeItem('selectedPatient');
		selectedPatientStore.set(null);
		return;
	}
	// store serializable POJO (drop methods)
	try {
		const pojo = JSON.parse(JSON.stringify(patient));
		sessionStorage.setItem('selectedPatient', JSON.stringify(pojo));
		selectedPatientStore.set(patient);
	} catch (e) {
		console.error('failed to persist selected patient', e);
	}
}

// try hydration from sessionStorage on module load (client-only)
if (typeof window !== 'undefined') {
	const raw = sessionStorage.getItem('selectedPatient');
	if (raw) {
		try {
			const pojo = JSON.parse(raw);
			// lazy import Patient class to reconstruct (avoid SSR issues)
			import('$lib/shared/entities').then((mod) => {
				if (mod && typeof mod.Patient?.fromPOJO === 'function') {
					const patient = mod.Patient.fromPOJO(pojo);
					selectedPatientStore.set(patient);
				} else {
					// fallback: set plain object (type loosy)
					selectedPatientStore.set((pojo as unknown) as Patient);
				}
			});
		} catch (e) {
			console.error('failed to hydrate selected patient', e);
		}
	}
}
