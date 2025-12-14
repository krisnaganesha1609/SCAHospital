import { PrescriptionItems } from "$lib/shared/entities/PrescriptionItems";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { PrescriptionItemsRepository } from "./interfaces/PrescriptionItemsRepository";
import type { uuid } from "$lib/shared/types/type_def";

export class PrescriptionItemsRepositoryImpl implements PrescriptionItemsRepository {
    private supabase: SupabaseClient;
    constructor(supabase: SupabaseClient) {
        this.supabase = supabase;
    }
    getPrescriptionItemById(id: uuid): Promise<any> {
        throw new Error("Method not implemented.");
    }
    createPrescriptionItem(data: Partial<PrescriptionItems>): Promise<void> {
        throw new Error("Method not implemented.");
    }
    updatePrescriptionItem(id: string, data: Partial<PrescriptionItems>): Promise<void> {
        throw new Error("Method not implemented.");
    }
    deletePrescriptionItem(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    listPrescriptionItems(filter?: any): Promise<any[]> {
        throw new Error("Method not implemented.");
    }
    async createPrescriptionItemsBulk(data: any[]): Promise<void> {
        const { error } = await this.supabase
            .from('prescription_items')
            .insert(data);
        if (error) {
            throw new Error(error.message);
        }
        return Promise.resolve();
    }
}