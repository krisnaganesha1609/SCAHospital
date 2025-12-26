import type { SupabaseClient } from '@supabase/supabase-js';
import { Patient } from '../../shared/entities/Patient';
import type { PatientRepository } from './interfaces/PatientRepository';
import type { uuid } from '$lib/shared/types/type_def';
import { generateSCAMedRec } from '$lib/shared/utils/Utils';
export class PatientRepositoryImpl implements PatientRepository {
    private supabase: SupabaseClient;
    constructor(supabase: SupabaseClient) {
        this.supabase = supabase;
    }
    async updateExistingPatient(id: uuid, payload: any): Promise<void> {
        const data = payload;
        const { error } = await this.supabase.from('patients').update(data).eq('id', id);
        if (error) {
            console.error('Error updating patient:', error);
            throw error;
        }
        return Promise.resolve();
    }
    async fetchPatients(): Promise<Patient[] | null> {
        const { data, error } = await this.supabase
            .from('patients')
            .select('*, medical_records(*, prescriptions(*, doctor:users(*), prescription_items(*, medicines(*))) )')
            .order('medical_record_number', {ascending: true})
        if (error || !data) {       
            console.error('Error fetching patients:', error);
            throw error;
        }
        return Promise.resolve(data.map((item) => Patient.fromJson(item)));
    }
    async fetchPatientById(id: string): Promise<Patient | null> {
        const { data, error } = await this.supabase
            .from('patients')
            .select('*')
            .eq('id', id)
            .single();
        if (error || !data) {
            console.error('Error fetching patient by ID:', error);
            throw error;
        }
        return Promise.resolve(Patient.fromJson(data));
    }
    async createNewPatient(p: Patient): Promise<uuid> {
        const payload = {
            medical_record_number: generateSCAMedRec(),
            full_name: p.getFullName() ?? '',
            date_of_birth: p.getDateOfBirth() ?? null,
            gender: p.getGender() ?? '',
            address: p.getAddress() ?? '',
            phone: p.getPhone() ?? '',
            blood_type: p.getBloodType() ?? '',
            allergies: p.getAllergies() ?? '',
        }
        const { data, error } = await this.supabase.from('patients').insert(payload).select();
        if (error) {
            console.error('Error creating new patient:', error);
            throw error;
        }
        return Promise.resolve(data[0].id);
    }
}