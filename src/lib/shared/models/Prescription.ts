import type { uuid } from "../types/type_def";
import type { User } from "./User";
import type { MedicalRecord } from "./MedicalRecord";

export class Prescription {
    constructor(
        public id: uuid,
        public medicalRecord: MedicalRecord,
        public doctor: User,
        public prescribedAt: Date,
        public status: string,
        public totalCost: number,
        public notes: string,
        public createdAt: Date
    ) {}
}
