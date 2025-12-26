import type { Medicine } from '$lib/shared/entities';
import type { uuid } from '$lib/shared/types/type_def';
import type { SupabaseClient } from '@supabase/supabase-js';
import { MedicineRepositoryImpl } from '../repositories/MedicineRepositoryImpl';
import { MedicineService } from './interfaces/MedicineService';
import { MedicineRequest } from '$lib/shared/utils/Medicine_Request';
import { generateMedicineCode, includeIfNotEmpty } from '$lib/shared/utils/Utils';
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
        const payload: MedicineRequest = new MedicineRequest(
            generateMedicineCode(),
            medicine.getName(),
            medicine.getForm(),
            medicine.getStrength(),
            medicine.getManufacturer(),
            medicine.getStockQty(),
            medicine.getUnitPrice(),
            medicine.getUnitType()
        );
        await this.medicineRepository.createMedicine(payload.toJson());
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
    async updateMedicine(id: uuid, data: any): Promise<void> {
        const payload = {
            ...includeIfNotEmpty('name', data.name),
            ...includeIfNotEmpty('form', data.form),
            ...includeIfNotEmpty('strength', data.strength),
            ...includeIfNotEmpty('unit_price', data.unit_price),
            ...includeIfNotEmpty('unit_type', data.unit_type),
            ...includeIfNotEmpty('stock_qty', data.stock_qty),
        }
        await this.medicineRepository.updateMedicine(id, payload);
        return Promise.resolve();
    }
}