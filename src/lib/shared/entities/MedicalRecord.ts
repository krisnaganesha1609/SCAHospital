import type { JsonObject, uuid } from "../types/type_def";
import { Utils } from "../utils/Utils";
import { Prescription } from "./Prescription";

export class MedicalRecord extends Utils {
    constructor(
        id: uuid,
        private patientId: uuid,
        private doctorId: uuid,
        private departmentId: uuid,
        private visitDate: Date,
        private visitType: string,
        private complaints: string,
        private history: string,
        private physicalExam: string,
        private vitals: JsonObject,
        private procedures: string,
        private attachments: JsonObject,
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
    public getDoctorId(): uuid {
        return this.doctorId;
    }
    public getDepartmentId(): uuid {
        return this.departmentId;
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
    public getAttachments(): JsonObject {
        return this.attachments;
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
            department_id: this.departmentId ?? '',
            visit_date: this.visitDate,
            visit_type: this.visitType ?? '',
            complaints: this.complaints,
            history: this.history,
            physical_exam: this.physicalExam,
            vitals: this.vitals,
            procedures: this.procedures ?? '',
            attachments: this.attachments ?? '',
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
            json.doctor_id,
            json.department_id,
            json.visit_date,
            json.visit_type,
            json.complaints,
            json.history,
            json.physical_exam,
            json.vitals,
            json.procedures,
            json.attachments,
            json.treatment_plan,
            json.follow_up_date,
            json.diagnosis,
            json.notes,
            json.prescriptions.map((prescription: any) => Prescription.fromJson(prescription))
        );
    }
    public static fromPOJO(obj: any): MedicalRecord {
        return new MedicalRecord(
            obj.id,
            obj.patientId,
            obj.doctorId,
            obj.departmentId,
            obj.visitDate,
            obj.visitType,
            obj.complaints,
            obj.history,
            obj.physicalExam,
            obj.vitals,
            obj.procedures,
            obj.attachments,
            obj.treatmentPlan,
            obj.followUpDate,
            obj.diagnosis,
            obj.notes,
            obj.prescriptions.map((prescription: any) => Prescription.fromPOJO(prescription))
        );
    }
}