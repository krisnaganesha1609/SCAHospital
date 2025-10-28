import type { uuid } from "../types/type_def";
import { Patient } from "./Patient";
import { User } from "./User";
import { Departments } from "./Departments";
import { Utils } from "../utils/Utils";

type JsonObject = Map<any, any>;

export class MedicalRecord extends Utils {
    constructor(
        private id: uuid,
        private patient: Patient,
        private doctor: User,
        private department: Departments,
        private visitDate: Date,
        private visitType: string,
        private complaints: string,
        private history: string,
        private physicalExam: string,
        private vital: JsonObject,
        private procedures: string,
        private attachments: JsonObject,
        private treatmentPlan: string,
        private followUpDate: Date,
        private diagnosis: string,
        private notes: String
    ) { super(id); }
    public getId(): uuid {
        return this.id;
    }
    public getPatient(): Patient {
        return this.patient;
    }
    public getDoctor(): User {
        return this.doctor;
    }
    public getDepartment(): Departments {
        return this.department;
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
        return this.vital;
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
    public toJson(): any {
        return {
            id: this.id,
            patient: this.patient,
            doctor: this.doctor,
            department: this.department,
            visitDate: this.visitDate,
            visitType: this.visitType,
            complaints: this.complaints,
            history: this.history,
            physicalExam: this.physicalExam,
            vital: this.vital,
            procedures: this.procedures,
            attachments: this.attachments,
            treatmentPlan: this.treatmentPlan,
            followUpDate: this.followUpDate,
            diagnosis: this.diagnosis,
            notes: this.notes
        };
    }

    public static fromJson(json: any): MedicalRecord {
        return new MedicalRecord(
            json.id,
            Patient.fromJson(json.patient),
            User.fromJson(json.doctor),
            Departments.fromJson(json.department),
            json.visitDate,
            json.visitType,
            json.complaints,
            json.history,
            json.physicalExam,
            json.vital,
            json.procedures,
            json.attachments,
            json.treatmentPlan,
            json.followUpDate,
            json.diagnosis,
            json.notes
        );
    }
}