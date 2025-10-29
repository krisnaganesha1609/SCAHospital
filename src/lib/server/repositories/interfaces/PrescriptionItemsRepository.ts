import type { PrescriptionItems } from "$lib/shared/entities/PrescriptionItems";
import type { uuid } from "$lib/shared/types/type_def";

export abstract class PrescriptionItemsRepository {
    abstract createPrescriptionItem(data: Partial<PrescriptionItems>): Promise<void>;
    abstract getPrescriptionItemById(id: uuid): Promise<any>;
    abstract updatePrescriptionItem(id: uuid, data: Partial<PrescriptionItems>): Promise<void>;
    abstract deletePrescriptionItem(id: uuid): Promise<void>;
    abstract listPrescriptionItems(filter?: any): Promise<any[]>;
}