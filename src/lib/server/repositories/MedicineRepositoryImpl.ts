import type { SupabaseClient } from '@supabase/supabase-js';
import { Medicine } from '../../shared/entities/Medicine';
import type { MedicineRepository } from './interfaces/MedicineRepository';
export class MedicineRepositoryImpl implements MedicineRepository {
    private supabase: SupabaseClient;
    constructor(supabase: SupabaseClient) {
        this.supabase = supabase;
    }
    async createMedicine(data: any): Promise<void> {
        const { error } = await this.supabase
            .from('medicines')
            .insert(data);
        if (error) {
            console.error('Error creating medicine:', error);
            throw error;
        }
        return Promise.resolve();
    }
    getMedicineById(id: string): Promise<any> {
        throw new Error('Method not implemented.');
    }
    async updateMedicine(id: string, data: any): Promise<void> {
        const { error } = await this.supabase
            .from('medicines')
            .update(data)
            .eq('id', id);
        if (error) {
            console.error('Error updating medicine:', error);
            throw error;
        }
        return Promise.resolve();
    }
    async deleteMedicine(id: string): Promise<void> {
        const { error } = await this.supabase
            .from('medicines')
            .delete()
            .eq('id', id);
        if (error) {
            console.error('Error deleting medicine:', error);
            throw error;
        }
        return Promise.resolve();
    }
    async listMedicines(filter?: any): Promise<Medicine[]> {
        const { data, error } = await this.supabase
            .from('medicines')
            .select('*');
        if (error) {
            throw new Error(error.message);
        }
        if (!data) {
            return [];
        }
        return Promise.resolve(data.map((item) => Medicine.fromJson(item)));
    }
}