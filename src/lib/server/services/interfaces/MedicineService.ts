import type { Medicine } from "$lib/shared/entities/Medicine";
import type { uuid } from "$lib/shared/types/type_def";

export abstract class MedicineService {
    abstract listMedicines(): Promise<string[]>;
    abstract registerMedicine(medicine: Medicine): Promise<void>;
    abstract deleteMedicine(id: uuid): Promise<void>;
    abstract dispense(id: uuid, qty: number): Promise<void>;
    abstract restock(id: uuid, qty: number): Promise<void>;
}