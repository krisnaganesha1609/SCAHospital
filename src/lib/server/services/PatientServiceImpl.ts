import type { Patient } from '$lib/shared/entities/Patient';
import type { uuid } from '$lib/shared/types/type_def';
import { PatientService } from './interfaces/PatientService';
export class PatientServiceImpl implements PatientService {
    register(data: Patient): Promise<void> {
        throw new Error('Method not implemented.');
    }
    update(patientId: uuid, p: Patient): Promise<void> {
        throw new Error('Method not implemented.');
    }
    listPatients(): Promise<Patient[]> {
        throw new Error('Method not implemented.');
    }
    search(query: string): Promise<Patient[]> {
        throw new Error('Method not implemented.');
    }
}