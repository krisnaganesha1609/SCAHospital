import { Prescription } from "$lib/shared/entities/Prescription";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { PrescriptionRepository } from "./interfaces/PrescriptionRepository";

export class PrescriptionRepositoryImpl implements PrescriptionRepository {
    private supabase: SupabaseClient;
    constructor(supabase: SupabaseClient) {
        this.supabase = supabase;
    }
    createPrescription(data: Partial<Prescription>): Promise<void> {
        throw new Error("Method not implemented.");
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
    updatePrescription(id: string, data: Partial<Prescription>): Promise<void> {
        throw new Error("Method not implemented.");
    }
    deletePrescription(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    listPrescriptions(filter?: any): Promise<any[]> {
        throw new Error("Method not implemented.");
    }
}