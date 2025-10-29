import type { uuid } from '$lib/shared/types/type_def';
import { Prescription } from '../../../shared/entities/Prescription';
export abstract class PrescriptionRepository {
    abstract createPrescription(data: Partial<Prescription>): Promise<void>;
    abstract getPrescriptionById(id: uuid): Promise<any>;
    abstract updatePrescription(id: uuid, data: Partial<Prescription>): Promise<void>;
    abstract deletePrescription(id: uuid): Promise<void>;
    abstract listPrescriptions(filter?: any): Promise<any[]>;
}