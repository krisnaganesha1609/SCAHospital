import type { Medicine } from '$lib/shared/entities/Medicine';
import type { uuid } from '$lib/shared/types/type_def';
import { MedicineService } from './interfaces/MedicineService';
export class MedicineServiceImpl implements MedicineService {
    listMedicines(): Promise<string[]> {
        throw new Error('Method not implemented.');
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