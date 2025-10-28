import type { Patient } from "$lib/shared/entities/Patient";

export abstract class PatientRepository {
    abstract createNewPatient(payload: Partial<Patient>): Promise<void>;
    abstract updateExistingPatient(payload: Partial<Patient>): Promise<void>;
    abstract fetchPatients(): Promise<any[]>;
    abstract fetchPatientById(id: string): Promise<any>;
}