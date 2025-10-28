import { MedicalRecord } from "$lib/shared/entities/MedicalRecord";
import type { MedicalRecordRepository } from "./interfaces/MedicalRecordRepository";

export class MedicalRecordRepositoryImpl extends MedicalRecord implements MedicalRecordRepository {
    createMedicalRecord(data: Partial<MedicalRecord>): Promise<void> {
        throw new Error("Method not implemented.");
    }
    getMedicalRecordById(id: string): Promise<any> {
        throw new Error("Method not implemented.");
    }
    updateMedicalRecord(id: string, data: Partial<MedicalRecord>): Promise<void> {
        throw new Error("Method not implemented.");
    }
    deleteMedicalRecord(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    listMedicalRecords(filter?: any): Promise<any[]> {
        throw new Error("Method not implemented.");
    }
}