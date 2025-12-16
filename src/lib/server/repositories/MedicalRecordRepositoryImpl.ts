import { MedicalRecord } from "$lib/shared/entities/MedicalRecord";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { MedicalRecordRepository } from "./interfaces/MedicalRecordRepository";
import { error } from '@sveltejs/kit';
import type { uuid } from "$lib/shared/types/type_def";

export class MedicalRecordRepositoryImpl implements MedicalRecordRepository {
    private supabase: SupabaseClient;
    constructor(supabase: SupabaseClient) {
        this.supabase = supabase;
    }
    async createMedicalRecord(payload: any): Promise<uuid> {
        const { data, error } = await this.supabase.from('medical_records').insert(payload).select();
        if (error) {
            throw error;
        }
        if (!data || data.length === 0) {
            throw new Error("Failed to create medical record");
        }
        return Promise.resolve(data[0].id);
    }
    async getMedicalRecordsByPatientId(id: string): Promise<MedicalRecord[] | null> {
        const { data, error } = await this.supabase
            .from('medical_records')
            .select('*, prescriptions(*, prescription_items(*))')
            .eq('patient_id', id);
        if (error) {
            throw error;
        }
        if (data) {
            return Promise.resolve(data.map((record: any) => MedicalRecord.fromJson(record)));
        } else {
            return Promise.resolve(null);
        }
    }
    async updateMedicalRecord(id: string, data:any): Promise<void> {
        const { error } = await this.supabase
            .from('medical_records')
            .update(data)
            .eq('id', id);
        if (error) {
            throw error;
        }
        return Promise.resolve();
    }
    deleteMedicalRecord(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    listMedicalRecords(filter?: any): Promise<any[]> {
        throw new Error("Method not implemented.");
    }
}