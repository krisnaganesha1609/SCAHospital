import type { Patient } from "$lib/shared/entities/Patient";
import type { uuid } from "$lib/shared/types/type_def";

export abstract class PatientService {
    abstract register(
        data: Patient
    ): Promise<uuid>;

    abstract update(
        patientId: uuid,
        p: Patient
    ): Promise<void>;

    abstract listPatients(): Promise<Patient[]>;

    abstract search(query: string): Promise<Patient[]>;
}