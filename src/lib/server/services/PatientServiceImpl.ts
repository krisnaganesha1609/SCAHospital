import type { Patient } from '$lib/shared/entities/Patient';
import type { uuid } from '$lib/shared/types/type_def';
import type { SupabaseClient } from '@supabase/supabase-js';
import { PatientRepositoryImpl } from '../repositories/PatientRepositoryImpl';
import { PatientService } from './interfaces/PatientService';
import { patientPaginationStore } from '$lib/shared/stores/pagination';
import { get } from 'svelte/store';
export class PatientServiceImpl implements PatientService {
    private patientRepository: PatientRepositoryImpl;
    constructor(supabase: SupabaseClient) {
        this.patientRepository = new PatientRepositoryImpl(supabase);
    }
    register(data: Patient): Promise<void> {
        return this.patientRepository.createNewPatient(data);
    }
    update(patientId: uuid, p: Partial<Patient>): Promise<void> {
        return this.patientRepository.updateExistingPatient(patientId, p);
    }
    async listPatients(): Promise<Patient[]> {
        const patients = await this.patientRepository.fetchPatients(get(patientPaginationStore).pageNumber, get(patientPaginationStore).itemsPerPage);
        if (patients === null) {
            throw new Error('Failed to fetch patients. Please Contact Admin.');
        }
        if (!patients || patients.length === 0) {
            return [];
        }
        return patients;
    }
    search(query: string): Promise<Patient[]> {
        throw new Error('Method not implemented.');
    }
}