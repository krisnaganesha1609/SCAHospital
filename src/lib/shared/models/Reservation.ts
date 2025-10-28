import type { uuid } from "../types/type_def";
import type { Patient } from "./Patient";
import type { User } from "./User";

export class Reservation {
    constructor(
        public id: uuid,
        public patient: Patient,
        public receptionist: User,
        public doctor: User,
        public reservationTime: Date,
        public status: string,
        public source: string,
        public notes: string,
        public createdAt: Date
    ) {}
}