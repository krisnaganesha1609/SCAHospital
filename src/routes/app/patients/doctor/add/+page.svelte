<script lang="ts">
	import { onMount } from 'svelte';
	import { onDestroy } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { selectedPatientStore } from '$lib/shared/stores/selectedPatient';
	import type { Patient } from '$lib/shared/entities';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Calendar as UiCalendar } from '$lib/components/ui/calendar/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import { type DateValue, DateFormatter, getLocalTimeZone } from '@internationalized/date';
	import { cn } from '$lib/utils.js';

	const df = new DateFormatter('en-US', { dateStyle: 'long' });

	// selected patient
	let patient: Patient | null = null;
	const unsubscribe = selectedPatientStore.subscribe((p) => (patient = p));

	// record form fields (no bind:value — we update with on:input)
	let visitType = '';
	let complaints = '';
	let history = '';
	let physicalExam = '';
	let treatmentPlan = '';
	let diagnosis = '';
	let notes = '';
	let followUpDate: DateValue | null = null;

	let bpSystolic = '';
	let bpDiastolic = '';
	let o2 = '';
	let hr = '';
	let tempC = '';

	// prescriptions (dynamic) — initially hidden until record saved
	type RxForm = {
		medName: string;
		strength: string;
		form: string;
		dose: string;
		frequency: string;
		duration: string;
		quantity: string;
		instruction: string;
		price: string;
	};
	let prescriptions: RxForm[] = [];

	// UI state
	let showPrescriptionSection = false;
	let recordSaved = false;

	// helpers to update inputs (no bind:value)
	function setInputValue(setter: (v: string) => void, e: Event) {
		const v = (e.target as HTMLInputElement | HTMLTextAreaElement).value;
		setter(v);
	}

	function updatePrescriptionField(index: number, field: keyof RxForm, e: Event) {
		const val = (e.target as HTMLInputElement).value;
		// reassign to trigger reactivity
		prescriptions = prescriptions.map((p, i) => (i === index ? { ...p, [field]: val } : p));
	}

	function addPrescription() {
		prescriptions = [
			...prescriptions,
			{
				medName: '',
				strength: '',
				form: '',
				dose: '',
				frequency: '',
				duration: '',
				quantity: '',
				instruction: '',
				price: ''
			}
		];
	}

	function removePrescription(idx: number) {
		prescriptions = prescriptions.filter((_, i) => i !== idx);
	}

	// Attempt to accept calendar change events in multiple shapes:
	function calendarChangeHandler(e: CustomEvent) {
		// many UI calendar components emit detail or detail.value
		const d = (e?.detail as any) ?? null;
		if (!d) {
			followUpDate = null;
			return;
		}
		// if calendar returns DateValue directly
		if (typeof (d as DateValue)?.toDate === 'function') {
			followUpDate = d as DateValue;
			return;
		}
		// if detail.value exists
		if ((d as any).value) {
			followUpDate = (d as any).value as DateValue;
			return;
		}
		// fallback: set to detail
		followUpDate = d as DateValue;
	}

	function isRecordComplete(): { ok: boolean; missing: string[] } {
		const missing: string[] = [];

		if (!visitType.trim()) missing.push('Visit Type');
		if (!complaints.trim()) missing.push('Primary Complaint');
		if (!history.trim()) missing.push('History');
		if (!physicalExam.trim()) missing.push('Physical Examination');
		if (!treatmentPlan.trim()) missing.push('Treatment Plan');
		if (!diagnosis.trim()) missing.push('Diagnosis');
		if (!notes.trim()) missing.push('Notes');
		if (!followUpDate) missing.push('Follow Up Date');

		// vitals
		if (!bpSystolic.trim()) missing.push('BP (systolic)');
		if (!bpDiastolic.trim()) missing.push('BP (diastolic)');
		if (!o2.trim()) missing.push('O₂');
		if (!hr.trim()) missing.push('HR');
		if (!tempC.trim()) missing.push('Temp');

		return { ok: missing.length === 0, missing };
	}

	// Save record — validate all fields, then reveal prescription section
	async function saveRecord() {
		if (!patient) {
			alert('No patient selected');
			return;
		}

		const { ok, missing } = isRecordComplete();
		if (!ok) {
			alert('Please fill the following fields before saving:\n- ' + missing.join('\n- '));
			return;
		}

		// Build vitals object
		const vitals = {
			bpSystolic,
			bpDiastolic,
			o2,
			hr,
			tempC
		};

		// Build payload (use patient.getId() — per your instruction)
		const payload = {
			patient_id: patient.getId(),
			doctor_id: patient.getId(), // replace with actual doctor id if available
			department_id: patient.getId(), // replace with real department id if needed
			visit_date: new Date().toISOString(),
			visit_type: visitType,
			complaints,
			history,
			physical_exam: physicalExam,
			vitals,
			procedures: '',
			attachments: {},
			treatment_plan: treatmentPlan,
			follow_up_date: followUpDate ? followUpDate.toDate(getLocalTimeZone()).toISOString() : null,
			diagnosis,
			notes,
			prescriptions: [] // will be appended when saving prescriptions
		};

		// TODO: POST payload to backend; here we just simulate success
		console.log('Record payload (to be sent):', payload);

		// mark as saved and reveal prescriptions section
		recordSaved = true;
		showPrescriptionSection = true;

		// notify user
		alert('Record saved (placeholder). You can now add prescriptions.');
	}

	// fixup for let:props
	type TriggerProps = HTMLButtonAttributes;

	// Save prescriptions — same class/size/color as Save Record
	async function savePrescriptions() {
		if (!patient) {
			alert('No patient selected');
			return;
		}

		if (prescriptions.length === 0) {
			alert('No prescriptions to save.');
			return;
		}

		// Validate each prescription row has all fields filled
		const incompleteRows: number[] = [];
		prescriptions.forEach((p, idx) => {
			const required = [
				p.medName,
				p.strength,
				p.form,
				p.dose,
				p.frequency,
				p.duration,
				p.quantity,
				p.instruction,
				p.price
			];
			if (required.some((r) => !r || !String(r).trim())) incompleteRows.push(idx + 1);
		});

		if (incompleteRows.length) {
			alert(
				`Please complete all fields for the following prescription rows before saving: ${incompleteRows.join(
					', '
				)}`
			);
			return;
		}

		// Build prescriptions payload
		const rxList = prescriptions.map((r) => ({
			medication_name: r.medName,
			strength: r.strength,
			form: r.form,
			dose: r.dose,
			frequency: r.frequency,
			duration: r.duration,
			quantity: r.quantity,
			instruction: r.instruction,
			price: r.price
		}));

		// TODO: send rxList along with patient id to backend
		console.log('Saving prescriptions for patient', patient.getId(), rxList);
		alert('Prescriptions saved (placeholder).');
	}

	onMount(() => {
		// optional: initialize or focus
	});

	// cleanup
	onDestroy(() => unsubscribe());
</script>

<svelte:head>
	<title>Add Record — {patient?.getFullName ? patient.getFullName() : 'Patient'}</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 p-6">
	{#if patient}
		<div class="mx-auto max-w-4xl space-y-4">
			<!-- top bar: back + title -->
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-3">
					<a
						href="/app/patients/doctor"
						class="inline-block rounded-full border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100"
						>← Back</a
					>
					<h1 class="text-xl font-semibold">Add Record — {patient.getFullName()}</h1>
				</div>
			</div>

			<!-- TOP: patient summary (non-clickable) -->
			<div class="rounded-xl bg-white p-6 shadow-md">
				<div class="flex items-start justify-between">
					<div>
						<h2 class="text-lg font-semibold">{patient.getFullName()}</h2>
						<div class="mt-2 space-y-1 text-sm text-gray-600">
							<div><strong>MR No:</strong> {patient.getMedicalRecordNumber()}</div>
							<div><strong>Phone:</strong> {patient.getPhone()}</div>
							<div>
								<strong>First Registered:</strong>
								{new Date(patient.getCreatedAt()).toLocaleDateString()}
							</div>
						</div>
					</div>
					<div class="text-sm text-gray-700">
						<div><strong>Blood Type:</strong> {patient.getBloodType()}</div>
						<div class="mt-2"><strong>Allergies:</strong> {patient.getAllergies() || '-'}</div>
					</div>
				</div>
			</div>

			<!-- RECORD FORM -->
			<div class="rounded-xl bg-white p-6 shadow-md">
				<div class="grid grid-cols-12 gap-6">
					<!-- Left -->
					<div class="col-span-4 space-y-4">
						<label for="visitType" class="block text-xs text-slate-500">Visit Type</label>
						<input
							class="w-full rounded-md border px-3 py-2"
							value={visitType}
							on:input={(e) => (visitType = (e.target as HTMLInputElement).value)}
							placeholder="New / Follow-up"
						/>

						<label for="complaints" class="block text-xs text-slate-500">Primary Complaint</label>
						<textarea
							class="w-full rounded-md border px-3 py-2"
							rows="3"
							value={complaints}
							on:input={(e) => (complaints = (e.target as HTMLTextAreaElement).value)}
							placeholder="Complaint"
						></textarea>

						<label for="followUpDate" class="block text-xs text-slate-500">Follow Up Date</label>
						<Popover.Root>
							<Popover.Trigger>
								<Button
									class={cn(
										'w-full justify-start text-start font-normal',
										!followUpDate && 'text-muted-foreground'
									)}
								>
									<CalendarIcon class="mr-2 size-4" />
									{followUpDate
										? df.format(followUpDate.toDate(getLocalTimeZone()))
										: 'Select a date'}
								</Button>
							</Popover.Trigger>

							<Popover.Content class="w-auto p-0">
								<UiCalendar
									type="single"
									initialFocus
									captionLayout="dropdown"
								/>
							</Popover.Content>
						</Popover.Root>
					</div>

					<!-- Middle -->
					<div class="col-span-4 space-y-4">
						<label for="history" class="block text-xs text-slate-500">History</label>
						<textarea
							class="w-full rounded-md border px-3 py-2"
							rows="3"
							value={history}
							on:input={(e) => (history = (e.target as HTMLTextAreaElement).value)}
						></textarea>

						<label for="daignosis" class="block text-xs text-slate-500">Diagnosis</label>
						<textarea
							class="w-full rounded-md border px-3 py-2"
							rows="3"
							value={diagnosis}
							on:input={(e) => (diagnosis = (e.target as HTMLTextAreaElement).value)}
						></textarea>

						<label for="physicalExam" class="block text-xs text-slate-500">Physical Examination</label>
						<textarea
							class="w-full rounded-md border px-3 py-2"
							rows="3"
							value={physicalExam}
							on:input={(e) => (physicalExam = (e.target as HTMLTextAreaElement).value)}
						></textarea>

						<label for="treatmentPlan" class="block text-xs text-slate-500">Treatment Plan</label>
						<textarea
							class="w-full rounded-md border px-3 py-2"
							rows="3"
							value={treatmentPlan}
							on:input={(e) => (treatmentPlan = (e.target as HTMLTextAreaElement).value)}
						></textarea>
					</div>

					<!-- Right -->
					<div class="col-span-4 space-y-4">
						<label for="notes" class="block text-xs text-slate-500">Notes</label>
						<textarea
							class="h-40 w-full rounded-md border px-3 py-2"
							value={notes}
							on:input={(e) => (notes = (e.target as HTMLTextAreaElement).value)}
						></textarea>

						<div class="rounded-md border p-3">
							<div class="mb-2 text-sm font-semibold text-slate-600">Vitals</div>
							<div class="grid grid-cols-2 gap-2 text-sm">
								<div>
									<label for="bpSystolic" class="text-xs text-slate-400">BP</label>
									<div class="flex items-center gap-2">
										<input
											class="w-16 rounded-md border px-2 py-1"
											value={bpSystolic}
											on:input={(e) => (bpSystolic = (e.target as HTMLInputElement).value)}
											placeholder="120"
										/>
										<span>/</span>
										<input
											class="w-16 rounded-md border px-2 py-1"
											value={bpDiastolic}
											on:input={(e) => (bpDiastolic = (e.target as HTMLInputElement).value)}
											placeholder="80"
										/>
										<span>mmHg</span>
									</div>
								</div>

								<div>
									<label for="o2" class="text-xs text-slate-400">O₂</label>
									<div class="flex items-center gap-2">
										<input
											class="w-20 rounded-md border px-2 py-1"
											value={o2}
											on:input={(e) => (o2 = (e.target as HTMLInputElement).value)}
											placeholder="98"
										/>
										<span>%</span>
									</div>
								</div>

								<div>
									<label for="hr" class="text-xs text-slate-400">HR</label>
									<div class="flex items-center gap-2">
										<input
											class="w-20 rounded-md border px-2 py-1"
											value={hr}
											on:input={(e) => (hr = (e.target as HTMLInputElement).value)}
											placeholder="72"
										/>
										<span>bpm</span>
									</div>
								</div>

								<div>
									<label for="tempC" class="text-xs text-slate-400">Temp</label>
									<div class="flex items-center gap-2">
										<input
											class="w-20 rounded-md border px-2 py-1"
											value={tempC}
											on:input={(e) => (tempC = (e.target as HTMLInputElement).value)}
											placeholder="36.6"
										/>
										<span>°C</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Save Record button (right) -->
				<div class="mt-6 flex items-center justify-between">
					<div></div>
					<div>
						<Button
							class="rounded-full bg-[#1D69D1] px-6 py-3 text-sm text-white"
							onclick={saveRecord}
						>
							Save Record
						</Button>
					</div>
				</div>
			</div>

			<!-- PRESCRIPTIONS: hidden until record saved -->
			{#if showPrescriptionSection}
				<div class="rounded-xl bg-white p-6 shadow-md">
					<div class="mb-4 flex items-center justify-between">
						<h3 class="text-lg font-semibold">Prescriptions</h3>
						<div class="flex gap-2">
							<button
								class="rounded border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50"
								on:click={addPrescription}
							>
								+ Add Medication
							</button>
						</div>
					</div>

					{#if prescriptions.length === 0}
						<div class="p-6 text-sm text-slate-500">
							No medications added yet. Click “+ Add Medication”.
						</div>
					{/if}

					{#each prescriptions as rx, idx (idx)}
						<div class="mb-4 space-y-2 rounded-lg bg-white p-4 shadow-md">
							<div class="grid grid-cols-3 gap-4">
								<div>
									<label for="rx.medName" class="text-xs text-slate-400">Medication Name</label>
									<input
										class="w-full rounded-md border px-3 py-2"
										value={rx.medName}
										on:input={(e) => updatePrescriptionField(idx, 'medName', e)}
									/>
								</div>

								<div>
									<label for="rx.strength" class="text-xs text-slate-400">Strength</label>
									<input
										class="w-full rounded-md border px-3 py-2"
										value={rx.strength}
										on:input={(e) => updatePrescriptionField(idx, 'strength', e)}
									/>
								</div>

								<div>
									<label for="rx.form" class="text-xs text-slate-400">Form</label>
									<input
										class="w-full rounded-md border px-3 py-2"
										value={rx.form}
										on:input={(e) => updatePrescriptionField(idx, 'form', e)}
									/>
								</div>

								<div>
									<label for="rx.dose" class="text-xs text-slate-400">Dose</label>
									<input
										class="w-full rounded-md border px-3 py-2"
										value={rx.dose}
										on:input={(e) => updatePrescriptionField(idx, 'dose', e)}
									/>
								</div>

								<div>
									<label for="rx.frequency" class="text-xs text-slate-400">Frequency</label>
									<input
										class="w-full rounded-md border px-3 py-2"
										value={rx.frequency}
										on:input={(e) => updatePrescriptionField(idx, 'frequency', e)}
									/>
								</div>

								<div>
									<label for="rx.duration" class="text-xs text-slate-400">Duration</label>
									<input
										class="w-full rounded-md border px-3 py-2"
										value={rx.duration}
										on:input={(e) => updatePrescriptionField(idx, 'duration', e)}
									/>
								</div>

								<div>
									<label for="rx.quantity" class="text-xs text-slate-400">Quantity</label>
									<input
										class="w-full rounded-md border px-3 py-2"
										value={rx.quantity}
										on:input={(e) => updatePrescriptionField(idx, 'quantity', e)}
									/>
								</div>

								<div>
									<label for="rx.instruction" class="text-xs text-slate-400">Instruction</label>
									<input
										class="w-full rounded-md border px-3 py-2"
										value={rx.instruction}
										on:input={(e) => updatePrescriptionField(idx, 'instruction', e)}
									/>
								</div>

								<div>
									<label for="rx.price" class="text-xs text-slate-400">Price</label>
									<input
										class="w-full rounded-md border px-3 py-2"
										value={rx.price}
										on:input={(e) => updatePrescriptionField(idx, 'price', e)}
									/>
								</div>
							</div>

							<div class="flex justify-end">
								<button
									class="rounded bg-red-500 px-3 py-1 text-sm text-white"
									on:click={() => removePrescription(idx)}
								>
									Remove
								</button>
							</div>
						</div>
					{/each}

					<!-- Save Prescriptions button (same size/style as Save Record) -->
					<div class="mt-4 flex justify-end">
						<Button
							class="rounded-full bg-[#1D69D1] px-6 py-3 text-sm text-white"
							onclick={savePrescriptions}
						>
							Save Prescription
						</Button>
					</div>
				</div>
			{/if}
		</div>
	{:else}
		<div class="mx-auto max-w-4xl p-6 text-center text-gray-600">
			No patient selected — please go back and select a patient first.
		</div>
	{/if}
</div>

<style>
	:global(.bg-\#1D69D1) {
		background-color: #1d69d1 !important;
	}
</style>
