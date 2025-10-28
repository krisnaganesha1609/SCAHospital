import { Prescription } from '../../../shared/entities/Prescription';
export abstract class PrescriptionRepository {
    abstract createPrescription(data: Partial<Prescription>): Promise<void>;
    abstract getPrescriptionById(id: string): Promise<any>;
    abstract updatePrescription(id: string, data: Partial<Prescription>): Promise<void>;
    abstract deletePrescription(id: string): Promise<void>;
    abstract listPrescriptions(filter?: any): Promise<any[]>;
}