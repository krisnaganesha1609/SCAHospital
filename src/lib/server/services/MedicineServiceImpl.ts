import type { Medicine } from '$lib/shared/entities';
import type { uuid } from '$lib/shared/types/type_def';
import type { SupabaseClient } from '@supabase/supabase-js';
import { MedicineRepositoryImpl } from '../repositories/MedicineRepositoryImpl';
import { MedicineService } from './interfaces/MedicineService';
export class MedicineServiceImpl implements MedicineService {
    private medicineRepository: MedicineRepositoryImpl;
    constructor(supabase: SupabaseClient) {
        this.medicineRepository = new MedicineRepositoryImpl(supabase);
    }
    async listMedicines(): Promise<Medicine[]> {
        const data = await this.medicineRepository.listMedicines();
        return data;
    }
    registerMedicine(medicine: Medicine): Promise<void> {
        throw new Error('Method not implemented.');
    }
    deleteMedicine(id: uuid): Promise<void> {
        throw new Error('Method not implemented.');
    }
    dispense(id: uuid, qty: number): Promise<void> {
        throw new Error('Method not implemented.');
    }
    restock(id: uuid, qty: number): Promise<void> {
        throw new Error('Method not implemented.');
    }
}