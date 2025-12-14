import type { SupabaseClient } from '@supabase/supabase-js';
import { Medicine } from '../../shared/entities/Medicine';
import type { MedicineRepository } from './interfaces/MedicineRepository';
export class MedicineRepositoryImpl implements MedicineRepository {
    private supabase: SupabaseClient;
        constructor(supabase: SupabaseClient) {
            this.supabase = supabase;
        }
    createMedicine(data: Partial<Medicine>): Promise<any> {
        throw new Error('Method not implemented.');
    }
    getMedicineById(id: string): Promise<any> {
        throw new Error('Method not implemented.');
    }
    updateMedicine(id: string, data: Partial<Medicine>): Promise<any> {
        throw new Error('Method not implemented.');
    }
    deleteMedicine(id: string): Promise<void> {
        throw new Error('Method not implemented.');
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