import { PrescriptionItems } from "$lib/shared/entities/PrescriptionItems";
import type { PrescriptionItemsRepository } from "./interfaces/PrescriptionItemsRepository";

export class PrescriptionItemsRepositoryImpl extends PrescriptionItems implements PrescriptionItemsRepository {
    createPrescriptionItem(data: Partial<PrescriptionItems>): Promise<void> {
        throw new Error("Method not implemented.");
    }
    getPrescriptionItemById(id: string): Promise<any> {
        throw new Error("Method not implemented.");
    }
    updatePrescriptionItem(id: string, data: Partial<PrescriptionItems>): Promise<void> {
        throw new Error("Method not implemented.");
    }
    deletePrescriptionItem(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    listPrescriptionItems(filter?: any): Promise<any[]> {
        throw new Error("Method not implemented.");
    }
}