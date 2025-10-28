import { Prescription } from "$lib/shared/entities/Prescription";
import type { PrescriptionRepository } from "./interfaces/PrescriptionRepository";

export class PrescriptionRepositoryImpl extends Prescription implements PrescriptionRepository {
    createPrescription(data: Partial<Prescription>): Promise<void> {
        throw new Error("Method not implemented.");
    }
    getPrescriptionById(id: string): Promise<any> {
        throw new Error("Method not implemented.");
    }
    updatePrescription(id: string, data: Partial<Prescription>): Promise<void> {
        throw new Error("Method not implemented.");
    }
    deletePrescription(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    listPrescriptions(filter?: any): Promise<any[]> {
        throw new Error("Method not implemented.");
    }
}