import type { JsonObject } from "../types/type_def";

export class PatientRequest{
    constructor(
        private medicalRecordNumber: string,
        private fullName: string,
        private dateOfBirth: Date,
        private gender: string,
        private address: string,
        private phone: string,
        private bloodType: string,
        private allergies: string,
        private emergencyContact: JsonObject,
        private updatedAt: Date,
    ) {}

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
    public getEmergencyContact(): JsonObject {
        return this.emergencyContact;
    }
    public getUpdatedAt(): Date {
        return this.updatedAt;
    }

    public toJson(): object {
        return {
            medical_record_number: this.medicalRecordNumber,
            full_name: this.fullName,
            date_of_birth: this.dateOfBirth,
            gender: this.gender,
            address: this.address,
            phone: this.phone,
            blood_type: this.bloodType,
            allergies: this.allergies,
            emergency_contact: this.emergencyContact,
            updated_at: this.updatedAt,
        };
    }

    public static fromJson(json: any): PatientRequest {
        return new PatientRequest(
            json.medical_record_number,
            json.full_name,
            json.date_of_birth,
            json.gender,
            json.address,
            json.phone,
            json.blood_type,
            json.allergies,
            json.emergency_contact,
            json.updated_at,
        );
    }

    public static fromPOJO(obj: any): PatientRequest {
        return new PatientRequest(
            obj.medicalRecordNumber,
            obj.fullName,
            obj.dateOfBirth,
            obj.gender,
            obj.address,
            obj.phone,
            obj.bloodType,
            obj.allergies,
            obj.emergencyContact,
            obj.updatedAt,
        );
    }
}