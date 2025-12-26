import type { JsonObject, uuid } from "../types/type_def";
import { Utils } from "../utils/Utils";
import { MedicalRecord } from "./MedicalRecord";

export class Patient extends Utils{
    constructor(
        id: uuid,
        private medicalRecordNumber: string,
        private fullName: string,
        private dateOfBirth: Date,
        private gender: string,
        private address: string,
        private phone: string,
        private bloodType: string,
        private allergies: string,
        private createdAt: Date,
        private updatedAt: Date,
        private medicalRecord: MedicalRecord[]
    ) {super(id);}

    public getId(): uuid {
        return this.id;
    }
    public getMedicalRecordNumber(): string {
        return this.medicalRecordNumber;
    }
    public getFullName(): string {
        return this.fullName;
    }
    public getDateOfBirth(): Date {
        return this.dateOfBirth;
    }
    public getGender(): string {
        return this.gender;
    }
    public getAddress(): string {
        return this.address;
    }
    public getPhone(): string {
        return this.phone;
    }
    public getBloodType(): string {
        return this.bloodType;
    }
    public getAllergies(): string {
        return this.allergies;
    }
    public getCreatedAt(): Date {
        return this.createdAt;
    }
    public getUpdatedAt(): Date {
        return this.updatedAt;
    }
    public getMedicalRecord(): MedicalRecord[] {
        return this.medicalRecord;
    }

    public toJson(): object {
        return {
            id: this.id,
            medical_record_number: this.medicalRecordNumber,
            full_name: this.fullName,
            date_of_birth: this.dateOfBirth,
            gender: this.gender,
            address: this.address,
            phone: this.phone,
            blood_type: this.bloodType,
            allergies: this.allergies,
            created_at: this.createdAt
        };
    }

    public static fromJson(json: any): Patient {
        return new Patient(
            json.id,
            json.medical_record_number,
            json.full_name,
            json.date_of_birth,
            json.gender,
            json.address,
            json.phone,
            json.blood_type,
            json.allergies,
            json.created_at,
            json.updated_at,
            json.medical_records ? json.medical_records.map((record: any) => MedicalRecord.fromJson(record)) : []
        );
    }

    public static fromPOJO(obj: any): Patient {
        return new Patient(
            obj.id,
            obj.medicalRecordNumber,
            obj.fullName,
            obj.dateOfBirth,
            obj.gender,
            obj.address,
            obj.phone,
            obj.bloodType,
            obj.allergies,
            obj.createdAt,
            obj.updatedAt,
            obj.medicalRecord ? obj.medicalRecord.map((record: any) => MedicalRecord.fromPOJO(record)) : []
        );
    }
}