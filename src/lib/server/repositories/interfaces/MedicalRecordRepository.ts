import type { MedicalRecord } from "$lib/shared/entities/MedicalRecord";

export abstract class MedicalRecordRepository {
    abstract createMedicalRecord(data: Partial<MedicalRecord>): Promise<void>;
    abstract getMedicalRecordById(id: string): Promise<any>;
    abstract updateMedicalRecord(id: string, data: Partial<MedicalRecord>): Promise<void>;
    abstract deleteMedicalRecord(id: string): Promise<void>;
    abstract listMedicalRecords(filter?: any): Promise<any[]>;
}