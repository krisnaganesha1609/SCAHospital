import type { Patient } from '$lib/shared/entities/Patient';
import type { uuid } from '$lib/shared/types/type_def';
import type { SupabaseClient } from '@supabase/supabase-js';
import { PatientRepositoryImpl } from '../repositories/PatientRepositoryImpl';
import { PatientService } from './interfaces/PatientService';
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
        const patients = await this.patientRepository.fetchPatients();
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