import { Prescription } from "$lib/shared/entities/Prescription";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { PrescriptionRepository } from "./interfaces/PrescriptionRepository";
import type { uuid } from "$lib/shared/types/type_def";

export class PrescriptionRepositoryImpl implements PrescriptionRepository {
    private supabase: SupabaseClient;
    constructor(supabase: SupabaseClient) {
        this.supabase = supabase;
    }
    async createPrescription(payload: any): Promise<uuid> {
    const { data, error } = await this.supabase
            .from('prescriptions')
            .insert(payload).select();
        if (error) {
            throw new Error(error.message);
        }
        if (!data || data.length === 0) {
            throw new Error("Failed to create prescription");
        }
        return Promise.resolve(data[0].id);
    }
    async getPrescriptionsById(id: string): Promise<Prescription[] | null> {
        const { data } = await this.supabase
            .from('prescriptions')
            .select('*')
            .eq('id', id);
        if (data) {
            return Promise.resolve(data.map((record: any) => Prescription.fromJson(record)));
        } else {
            return Promise.resolve(null);
        }
    }
    async updatePrescription(id: string, data: any): Promise<void> {
        const { error } = await this.supabase
            .from('prescriptions')
            .update(data)
            .eq('id', id);
        if (error) {
            console.error('Error updating prescription:', error);
            throw error;
        }
        return Promise.resolve();
    }
    async deletePrescription(id: string): Promise<void> {
        const { error } = await this.supabase
            .from('prescriptions')
            .delete()
            .eq('id', id);
        if (error) {
            console.error('Error deleting prescription:', error);
            throw error;
        }
        return Promise.resolve();
    }
    listPrescriptions(filter?: any): Promise<any[]> {
        throw new Error("Method not implemented.");
    }
}