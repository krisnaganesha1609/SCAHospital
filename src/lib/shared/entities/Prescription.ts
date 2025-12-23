import type { prescriptionStatus, uuid } from "../types/type_def";
import { User } from "./User";
import { MedicalRecord } from "./MedicalRecord";
import { Utils } from "../utils/Utils";
import { PrescriptionItems } from "./PrescriptionItems";

export class Prescription extends Utils {
    constructor(
        id: uuid,
        private medicalRecord: MedicalRecord | null,
        private doctor: User,
        private prescribedAt: Date,
        private status: prescriptionStatus,
        private totalCost: number,
        private notes: string,
        private createdAt: Date,
        private prescriptionItems: PrescriptionItems[]
    ) { super(id); }

    public getId(): uuid {
        return this.id;
    }
    public getMedicalRecord(): MedicalRecord | null {
        return this.medicalRecord;
    }
    public getDoctor(): User {
        return this.doctor;
    }
    public getPrescribedAt(): Date {
        return this.prescribedAt;
    }
    public getStatus(): string {
        return this.status;
    }
    public getTotalCost(): number {
        return this.totalCost;
    }
    public getNotes(): string {
        return this.notes;
    }
    public getCreatedAt(): Date {
        return this.createdAt;
    }
    public getPrescriptionItems(): PrescriptionItems[] {
        return this.prescriptionItems;
    }

    public toJson(): object {
        return {
            id: this.id,
            medicalRecord: this.medicalRecord,
            doctor: this.doctor,
            prescribedAt: this.prescribedAt,
            status: this.status,
            totalCost: this.totalCost,
            notes: this.notes,
            createdAt: this.createdAt,
        };
    }

    public static fromJson(json: any): Prescription {
        return new Prescription(
            json.id,
            json.medical_record ? MedicalRecord.fromJson(json.medical_record) : null,
            User.fromJson(json.doctor),
            json.prescribed_at,
            json.status,
            json.total_cost,
            json.notes,
            json.created_at,
            json.prescription_items.map((item: any) => PrescriptionItems.fromJson(item))
        );
    }

    public static fromPOJO(obj: any): Prescription {
        return new Prescription(
            obj.id,
            obj.medicalRecord ? MedicalRecord.fromPOJO(obj.medicalRecord) : null,
            User.fromPOJO(obj.doctor),
            obj.prescribedAt,
            obj.status,
            obj.totalCost,
            obj.notes,
            obj.createdAt,
            obj.prescriptionItems.map((item: any) => PrescriptionItems.fromPOJO(item))
        );
    }
}
