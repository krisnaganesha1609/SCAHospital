import type { uuid } from "../types/type_def";

export class Patient {
    constructor(
        public id: uuid,
        public medicalRecordNumber: string,
        public fullName: string,
        public dateOfBirth: Date,
        public gender: string,
        public address: string,
        public phone: string,
        public bloodType: string,
        public allergies: string,
        public emergencyContact: Map<any, any>,
        public createdAt: Date
    ) {}
}