import type { uuid } from '$lib/shared/types/type_def';
import { Prescription } from '../../../shared/entities/Prescription';
export abstract class PrescriptionRepository {
    abstract createPrescription(payload: any): Promise<uuid>;
    abstract getPrescriptionsById(id: uuid): Promise<Prescription[] | null>;
    abstract updatePrescription(id: uuid, data: Partial<Prescription>): Promise<void>;
    abstract deletePrescription(id: uuid): Promise<void>;
    abstract listPrescriptions(filter?: any): Promise<any[]>;
}