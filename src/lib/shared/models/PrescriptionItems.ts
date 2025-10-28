import type { uuid } from "../types/type_def";
import type { Prescription } from "./Prescription";
import type { Medicine } from "./Medicine";

export class PrescriptionItems {
    constructor(
        public id: uuid,
        public prescription: Prescription,
        public medicine: Medicine,
        public medicineName: string,
        public strength: string,
        public form: string,
        public dosage: string,
        public frequency: string,
        public duration: string,
        public quantity: number,
        public instructions: string,
        public unitPrice: number,
        publiccreatedAt: Date
    ) {}
}