import type { PharmacyApproval } from '$lib/shared/entities';
import type { SupabaseClient } from '@supabase/supabase-js';
import { PharmacyApprovalRepository } from './interfaces/PharmacyApprovalRepository';
export class PharmacyApprovalRepositoryImpl implements PharmacyApprovalRepository {
    private supabase: SupabaseClient;
        constructor(supabase: SupabaseClient) {
            this.supabase = supabase;
        }
    async createPharmacyApproval(payload: any): Promise<void> {
        const { error } = await this.supabase
            .from('pharmacy_approvals')
            .insert(payload);
        if (error) {
            throw new Error(error.message);
        }
        return Promise.resolve();
    }
    findAll(): Promise<any[]> {
        throw new Error('Method not implemented.');
    }
    findById(id: string): Promise<any> {
        throw new Error('Method not implemented.');
    }
    update(id: string, pharmacyApproval: Partial<PharmacyApproval>): Promise<void> {
        throw new Error('Method not implemented.');
    }
    delete(id: string): Promise<void> {
        throw new Error('Method not implemented.');
    }
}