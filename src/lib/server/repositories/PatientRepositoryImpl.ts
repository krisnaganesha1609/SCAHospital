import { Patient } from '../../shared/entities/Patient';
import type { PatientRepository } from './interfaces/PatientRepository';
export class PatientRepositoryImpl extends Patient implements PatientRepository {
    updateExistingPatient(payload: Partial<Patient>): Promise<void> {
        throw new Error('Method not implemented.');
    }
    fetchPatients(): Promise<any[]> {
        throw new Error('Method not implemented.');
    }
    fetchPatientById(id: string): Promise<any> {
        throw new Error('Method not implemented.');
    }
    createNewPatient(p: Partial<Patient>): Promise<void> {
        throw new Error('Method not implemented.');
    }
}