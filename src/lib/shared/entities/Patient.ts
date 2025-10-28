import type { JsonObject, uuid } from "../types/type_def";
import { Utils } from "../utils/Utils";

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
        private emergencyContact: Map<any, any>,
        private createdAt: Date
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
    public getEmergencyContact(): JsonObject {
        return this.emergencyContact;
    }
    public getCreatedAt(): Date {
        return this.createdAt;
    }

    public toJson(): object {
        return {
            id: this.id,
            medicalRecordNumber: this.medicalRecordNumber,
            fullName: this.fullName,
            dateOfBirth: this.dateOfBirth,
            gender: this.gender,
            address: this.address,
            phone: this.phone,
            bloodType: this.bloodType,
            allergies: this.allergies,
            emergencyContact: this.emergencyContact,
            createdAt: this.createdAt
        };
    }

    public static fromJson(json: any): Patient {
        return new Patient(
            json.id,
            json.medicalRecordNumber,
            json.fullName,
            json.dateOfBirth,
            json.gender,
            json.address,
            json.phone,
            json.bloodType,
            json.allergies,
            json.emergencyContact,
            json.createdAt
        );
    }
}