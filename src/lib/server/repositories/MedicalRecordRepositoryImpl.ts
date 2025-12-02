import { MedicalRecord } from "$lib/shared/entities/MedicalRecord";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { MedicalRecordRepository } from "./interfaces/MedicalRecordRepository";
import { error } from '@sveltejs/kit';

export class MedicalRecordRepositoryImpl implements MedicalRecordRepository {
    private supabase: SupabaseClient;
    constructor(supabase: SupabaseClient) {
        this.supabase = supabase;
    }
    createMedicalRecord(data: Partial<MedicalRecord>): Promise<void> {
        throw new Error("Method not implemented.");
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
    updateMedicalRecord(id: string, data: Partial<MedicalRecord>): Promise<void> {
        throw new Error("Method not implemented.");
    }
    deleteMedicalRecord(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    listMedicalRecords(filter?: any): Promise<any[]> {
        throw new Error("Method not implemented.");
    }
}