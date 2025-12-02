import { MedicalRecord, Prescription, PrescriptionItems } from '../entities';
import { Patient } from '../entities/Patient';
export class PatientDetails {
    constructor(
        private patient: Patient,
        private medicalRecords: MedicalRecord[],
        private prescriptions: Prescription[],
        private prescriptionItems: PrescriptionItems[]
    ) {}

    public getPatient(): Patient {
        return this.patient;
    }
    public getMedicalRecords(): MedicalRecord[] {
        return this.medicalRecords;
    }
    public getPrescriptions(): Prescription[] {
        return this.prescriptions;
    }
    public getPrescriptionItems(): PrescriptionItems[] {
        return this.prescriptionItems;
    }

    public static fromPOJO(pojo: any): PatientDetails {
        const patient = Patient.fromJson(pojo.patient);
        const medicalRecords = pojo.medicalRecords.map((record: any) => MedicalRecord.fromJson(record));
        const prescriptions = pojo.prescriptions.map((prescription: any) => Prescription.fromJson(prescription));
        const prescriptionItems = pojo.prescriptionItems.map((item: any) => PrescriptionItems.fromJson(item));
        return new PatientDetails(patient, medicalRecords, prescriptions, prescriptionItems);
    }
 }