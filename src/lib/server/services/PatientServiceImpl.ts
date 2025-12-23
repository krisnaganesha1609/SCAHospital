import { Patient } from '$lib/shared/entities/Patient';
import type { uuid } from '$lib/shared/types/type_def';
import type { SupabaseClient } from '@supabase/supabase-js';
import { PatientRepositoryImpl } from '../repositories/PatientRepositoryImpl';
import { PatientService } from './interfaces/PatientService';
import { includeIfNotEmpty } from '$lib/shared/utils/Utils';
export class PatientServiceImpl implements PatientService {
    private patientRepository: PatientRepositoryImpl;
    constructor(supabase: SupabaseClient) {
        this.patientRepository = new PatientRepositoryImpl(supabase);
    }
    register(data: any): Promise<void> {
        const patient: Patient = Patient.fromJson(data);
        return this.patientRepository.createNewPatient(patient);
    }
    update(patientId: uuid, p: any): Promise<void> {
        const data = {
            ...includeIfNotEmpty('medical_record_number', p.medicalRecordNumber),
            ...includeIfNotEmpty('full_name', p.fullName),
            ...includeIfNotEmpty('date_of_birth', p.dateOfBirth),
            ...includeIfNotEmpty('gender', p.gender),
            ...includeIfNotEmpty('address', p.address),
            ...includeIfNotEmpty('phone', p.phone),
        }
        return this.patientRepository.updateExistingPatient(patientId, data);
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