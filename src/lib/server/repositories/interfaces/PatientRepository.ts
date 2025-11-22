import type { Patient } from "$lib/shared/entities/Patient";
import type { uuid } from "$lib/shared/types/type_def";

export abstract class PatientRepository {
    abstract createNewPatient(payload: Patient): Promise<void>;
    abstract updateExistingPatient(id: uuid, payload: Partial<Patient>): Promise<void>;
    abstract fetchPatients(pageNumber: number, itemsPerPage: number): Promise<Patient[] | null>;
    abstract fetchPatientById(id: string): Promise<Patient | null>;
}