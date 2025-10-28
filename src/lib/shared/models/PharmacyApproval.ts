import type { uuid } from "../types/type_def";
import type { Prescription } from "./Prescription";
import type { User } from "./User";

export class PharmacyApproval {
    constructor(
        public id: uuid,
        public prescription: Prescription,
        public pharmacist: User,
        public dispensedAt: Date,
        public status: string,
        public totalPrice: number
    ) {}
}
