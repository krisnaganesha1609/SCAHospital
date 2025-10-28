import type { MedicalRecord } from "$lib/shared/entities/MedicalRecord";
import type { uuid } from "$lib/shared/types/type_def";

export abstract class MedicalRecordService {
    abstract listMedicalRecordOfAPatient(patientId: uuid): Promise<MedicalRecord[]>;
    abstract createMedicalRecordForAPatient(patientId: uuid, payload: MedicalRecord): Promise<void>;
    abstract updateMedicalRecordOfAPatient(patientId: uuid, payload: MedicalRecord): Promise<void>;
    abstract searchSpecificMedicalRecordOfAPatient(patientId: uuid, keyword: string): Promise<MedicalRecord[]>;
}