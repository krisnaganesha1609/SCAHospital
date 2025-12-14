import type { MedicalRecord } from "$lib/shared/entities/MedicalRecord";
import type { uuid } from "$lib/shared/types/type_def";
import type { SupabaseClient } from "@supabase/supabase-js";
import { MedicalRecordRepositoryImpl } from '../repositories/MedicalRecordRepositoryImpl';
import type { MedicalRecordService } from "./interfaces/MedicalRecordService";

export class MedicalRecordServiceImpl implements MedicalRecordService {
    private medicalRecordRepository: MedicalRecordRepositoryImpl;
        constructor(supabase: SupabaseClient) {
            this.medicalRecordRepository = new MedicalRecordRepositoryImpl(supabase);
        }
    async getMedicalRecordOfAPatient(patientId: uuid): Promise<MedicalRecord[] | null> {
         const data = await this.medicalRecordRepository.getMedicalRecordsByPatientId(patientId);
         if (data) {
                return data;
         } else {
             return null;
         }
    }
    async createMedicalRecordForAPatient(payload: any): Promise<uuid> {
       return await this.medicalRecordRepository.createMedicalRecord(payload);
    }
    updateMedicalRecordOfAPatient(patientId: uuid, payload: MedicalRecord): Promise<void> {
        throw new Error("Method not implemented.");
    }
    searchSpecificMedicalRecordOfAPatient(patientId: uuid, keyword: string): Promise<MedicalRecord[]> {
        throw new Error("Method not implemented.");
    }
}