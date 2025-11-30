import type { MedicalRecord } from "$lib/shared/entities/MedicalRecord";
import type { uuid } from "$lib/shared/types/type_def";

export abstract class MedicalRecordService {
    abstract getMedicalRecordOfAPatient(patientId: uuid): Promise<MedicalRecord | null>;
    abstract createMedicalRecordForAPatient(patientId: uuid, payload: MedicalRecord): Promise<void>;
    abstract updateMedicalRecordOfAPatient(patientId: uuid, payload: MedicalRecord): Promise<void>;
    abstract searchSpecificMedicalRecordOfAPatient(patientId: uuid, keyword: string): Promise<MedicalRecord[]>;
}