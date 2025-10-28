import type { MedicalRecord } from "$lib/shared/entities/MedicalRecord";
import type { uuid } from "$lib/shared/types/type_def";
import type { MedicalRecordService } from "./interfaces/MedicalRecordService";

export class MedicalRecordServiceImpl implements MedicalRecordService {
    listMedicalRecordOfAPatient(patientId: uuid): Promise<MedicalRecord[]> {
        throw new Error("Method not implemented.");
    }
    createMedicalRecordForAPatient(patientId: uuid, payload: MedicalRecord): Promise<void> {
        throw new Error("Method not implemented.");
    }
    updateMedicalRecordOfAPatient(patientId: uuid, payload: MedicalRecord): Promise<void> {
        throw new Error("Method not implemented.");
    }
    searchSpecificMedicalRecordOfAPatient(patientId: uuid, keyword: string): Promise<MedicalRecord[]> {
        throw new Error("Method not implemented.");
    }
}