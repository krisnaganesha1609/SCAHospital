import type { Medicine } from "$lib/shared/entities/Medicine";

export abstract class MedicineRepository {
    abstract createMedicine(data: Partial<Medicine>): Promise<any>;
    abstract getMedicineById(id: string): Promise<any>;
    abstract updateMedicine(id: string, data: Partial<Medicine>): Promise<any>;
    abstract deleteMedicine(id: string): Promise<void>;
    abstract listMedicines(filter?: any): Promise<any[]>;
}