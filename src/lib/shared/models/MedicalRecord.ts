import type { uuid } from "../types/type_def";
import type { Patient } from "./Patient";
import type { User } from "./User";
import type { Departments } from "./Departments";

// help apa ini
type JsonObject = Map<any, any>;

export class MedicalRecord {
    constructor(
        public id: uuid,
        public patient: Patient,
        public doctor: User,
        public department: Departments,
        public visitDate: Date,
        public visitType: string,
        public complaints: string,
        public history: string,
        public physicalExam: string,
        public vital: JsonObject,
        public procedures: string,
        public ttachments: JsonObject,
        public treatmentPlan: string,
        public followUpDate: Date,
        public diagnosis: string,
        public notes: String
    ) {}
}