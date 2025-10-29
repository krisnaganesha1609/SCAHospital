import type { MedicalRecord } from "$lib/shared/entities/MedicalRecord";
import type { uuid } from "$lib/shared/types/type_def";

export abstract class MedicalRecordRepository {
    abstract createMedicalRecord(data: Partial<MedicalRecord>): Promise<void>;
    abstract getMedicalRecordById(id: uuid): Promise<any>;
    abstract updateMedicalRecord(id: uuid, data: Partial<MedicalRecord>): Promise<void>;
    abstract deleteMedicalRecord(id: uuid): Promise<void>;
    abstract listMedicalRecords(filter?: any): Promise<any[]>;
}