import type { Medicine } from "$lib/shared/entities/Medicine";
import type { uuid } from "$lib/shared/types/type_def";

export abstract class MedicineRepository {
    abstract createMedicine(data: Partial<Medicine>): Promise<any>;
    abstract getMedicineById(id: uuid): Promise<any>;
    abstract updateMedicine(id: uuid, data: Partial<Medicine>): Promise<any>;
    abstract deleteMedicine(id: uuid): Promise<void>;
    abstract listMedicines(filter?: any): Promise<any[]>;
}