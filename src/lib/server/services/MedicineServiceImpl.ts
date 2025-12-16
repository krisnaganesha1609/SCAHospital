import type { Medicine } from '$lib/shared/entities';
import type { uuid } from '$lib/shared/types/type_def';
import type { SupabaseClient } from '@supabase/supabase-js';
import { MedicineRepositoryImpl } from '../repositories/MedicineRepositoryImpl';
import { MedicineService } from './interfaces/MedicineService';
import type { MedicineRequest } from '$lib/shared/utils/Medicine_Request';
export class MedicineServiceImpl implements MedicineService {
    private medicineRepository: MedicineRepositoryImpl;
    constructor(supabase: SupabaseClient) {
        this.medicineRepository = new MedicineRepositoryImpl(supabase);
    }
    async listMedicines(): Promise<Medicine[]> {
        const data = await this.medicineRepository.listMedicines();
        return data;
    }
    async registerMedicine(medicine: MedicineRequest): Promise<void> {
        await this.medicineRepository.createMedicine(medicine.toJson());
        return Promise.resolve();
    }
    async deleteMedicine(id: uuid): Promise<void> {
        await this.medicineRepository.deleteMedicine(id);
        return Promise.resolve();
    }
    async updateStock(id: uuid, qty: number): Promise<void> {
        await this.medicineRepository.updateMedicine(id, {
            stock_qty: qty,
        });
        return Promise.resolve();
    }
}