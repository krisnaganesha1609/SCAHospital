import type { JsonObject, uuid } from "../types/type_def";
import { Utils } from "../utils/Utils";
import { Patient } from "./Patient";
import { Prescription } from "./Prescription";

export class MedicalRecord extends Utils {
    constructor(
        id: uuid,
        private patientId: uuid,
        private patient: Patient | null,
        private doctorId: uuid,
        private visitDate: Date,
        private visitType: string,
        private complaints: string,
        private history: string,
        private physicalExam: string,
        private vitals: JsonObject,
        private procedures: string,
        private treatmentPlan: string,
        private followUpDate: Date,
        private diagnosis: string,
        private notes: String,
        private prescriptions: Prescription[]
    ) { super(id); }
    public getId(): uuid {
        return this.id;
    }
    public getPatientId(): uuid {
        return this.patientId;
    }
    public getPatient(): Patient | null {
        return this.patient;
    }
    public getDoctorId(): uuid {
        return this.doctorId;
    }
    public getVisitDate(): Date {
        return this.visitDate;
    }
    public getVisitType(): string {
        return this.visitType;
    }
    public getComplaints(): string {
        return this.complaints;
    }
    public getHistory(): string {
        return this.history;
    }
    public getPhysicalExam(): string {
        return this.physicalExam;
    }
    public getVital(): JsonObject {
        return this.vitals;
    }
    public getProcedures(): string {
        return this.procedures;
    }
    public getTreatmentPlan(): string {
        return this.treatmentPlan;
    }
    public getFollowUpDate(): Date {
        return this.followUpDate;
    }
    public getDiagnosis(): string {
        return this.diagnosis;
    }
    public getNotes(): String {
        return this.notes;
    }
    public getPrescriptions(): Prescription[] {
        return this.prescriptions;
    }
    public toJson(): any {
        return {
            patient_id: this.patientId,
            doctor_id: this.doctorId,
            visit_date: this.visitDate,
            visit_type: this.visitType ?? '',
            complaints: this.complaints,
            history: this.history,
            physical_exam: this.physicalExam,
            vitals: this.vitals,
            procedures: this.procedures ?? '',
            treatment_plan: this.treatmentPlan,
            follow_up_date: this.followUpDate,
            diagnosis: this.diagnosis,
            notes: this.notes
        };
    }

    public static fromJson(json: any): MedicalRecord {
        return new MedicalRecord(
            json.id,
            json.patient_id,
            json.patient ? Patient.fromJson(json.patient) : null,
            json.doctor_id,
            json.visit_date,
            json.visit_type,
            json.complaints,
            json.history,
            json.physical_exam,
            json.vitals,
            json.procedures,
            json.treatment_plan,
            json.follow_up_date,
            json.diagnosis,
            json.notes,
            json.prescriptions ? json.prescriptions.map((prescription: any) => Prescription.fromJson(prescription)) : null
        );
    }
    public static fromPOJO(obj: any): MedicalRecord {
        return new MedicalRecord(
            obj.id,
            obj.patientId,
            obj.patient ? Patient.fromPOJO(obj.patient) : null,
            obj.doctorId,
            obj.visitDate,
            obj.visitType,
            obj.complaints,
            obj.history,
            obj.physicalExam,
            obj.vitals,
            obj.procedures,
            obj.treatmentPlan,
            obj.followUpDate,
            obj.diagnosis,
            obj.notes,
            obj.prescriptions ? obj.prescriptions.map((prescription: any) => Prescription.fromPOJO(prescription)) : null
        );
    }
}