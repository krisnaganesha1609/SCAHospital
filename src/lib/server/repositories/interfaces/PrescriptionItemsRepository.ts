import type { PrescriptionItems } from "$lib/shared/entities/PrescriptionItems";

export abstract class PrescriptionItemsRepository {
    abstract createPrescriptionItem(data: Partial<PrescriptionItems>): Promise<void>;
    abstract getPrescriptionItemById(id: string): Promise<any>;
    abstract updatePrescriptionItem(id: string, data: Partial<PrescriptionItems>): Promise<void>;
    abstract deletePrescriptionItem(id: string): Promise<void>;
    abstract listPrescriptionItems(filter?: any): Promise<any[]>;
}