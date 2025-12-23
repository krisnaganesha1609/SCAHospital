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
    async findAll(): Promise<any[]> {
        const { data, error } = await this.supabase
            .from('pharmacy_approvals')
            .select('*, prescription:prescriptions(*, medical_record:medical_records(*, patient:patients(*)), doctor:users(*), prescription_items(*, medicines(*))), pharmacist:users(*)');
        if (error) {
            throw new Error(error.message);
        }
        console.dir(data);
        return Promise.resolve(data || []);
    }
    findById(id: string): Promise<any> {
        throw new Error('Method not implemented.');
    }
    async update(id: string, pharmacyApproval: any): Promise<void> {
        const { error } = await this.supabase
            .from('pharmacy_approvals')
            .update(pharmacyApproval)
            .eq('id', id);
        if (error) {
            throw new Error(error.message);
        }
        return Promise.resolve();
    }
    delete(id: string): Promise<void> {
        throw new Error('Method not implemented.');
    }
}