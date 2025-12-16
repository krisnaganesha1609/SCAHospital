import type { Medicine } from "$lib/shared/entities";
import type { uuid } from "$lib/shared/types/type_def";
import type { MedicineRequest } from "$lib/shared/utils/Medicine_Request";

export abstract class MedicineService {
    abstract listMedicines(): Promise<Medicine[]>;
    abstract registerMedicine(medicine: MedicineRequest): Promise<void>;
    abstract deleteMedicine(id: uuid): Promise<void>;
    abstract updateStock(id: uuid, qty: number): Promise<void>;
}