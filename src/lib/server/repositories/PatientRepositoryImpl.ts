import type { SupabaseClient } from '@supabase/supabase-js';
import { Patient } from '../../shared/entities/Patient';
import type { PatientRepository } from './interfaces/PatientRepository';
import type { uuid } from '$lib/shared/types/type_def';
export class PatientRepositoryImpl implements PatientRepository {
    private supabase: SupabaseClient;
    constructor(supabase: SupabaseClient) {
        this.supabase = supabase;
    }
    async updateExistingPatient(id: uuid, payload: Partial<Patient>): Promise<void> {
        const data = payload;
        const { error } = await this.supabase.from('patients').update(data).eq('id', id);
        if (error) {
            console.error('Error updating patient:', error);
            throw error;
        }
        return Promise.resolve();
    }
    async fetchPatients( pageNumber: number, itemsPerPage: number): Promise<Patient[] | null> {
        const startIndex = (pageNumber - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage - 1;
        const { data, error } = await this.supabase
            .from('patients')
            .select('*')
            .order('id', {ascending: true})
            .range(startIndex, endIndex);
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
    async createNewPatient( p: Patient): Promise<void> {
        const payload = {
            medicalRecordNumber: p.getMedicalRecordNumber() ?? '',
            fullName: p.getFullName() ?? '',
            dateOfBirth: p.getDateOfBirth() ?? null,
            gender: p.getGender() ?? '',
            address: p.getAddress() ?? '',
            phone: p.getPhone() ?? '',
            bloodType: p.getBloodType() ?? '',
            allergies: p.getAllergies() ?? '',
            emergencyContact: p.getEmergencyContact() ?? {},
        }
        const { error } = await this.supabase.from('patients').insert([payload]);
        if (error) {
            console.error('Error creating new patient:', error);
            throw error;
        }
        return Promise.resolve();
    }
}