import type { uuid } from "../types/type_def";
import { Utils, type FromJson } from "../utils/Utils";
import { Patient } from "./Patient";
import { User } from "./User";

export class Reservation extends Utils {
    constructor(
        private id: uuid,
        private patient: Patient,
        private receptionist: User,
        private doctor: User,
        private reservationTime: Date,
        private status: string,
        private source: string,
        private notes: string,
        private createdAt: Date
    ) {super(id);}
    
    public getId(): uuid {
        return this.id;
    }
    public getPatient(): Patient {
        return this.patient;
    }
    public getReceptionist(): User {
        return this.receptionist;
    }
    public getDoctor(): User {
        return this.doctor;
    }
    public getReservationTime(): Date {
        return this.reservationTime;
    }
    public getStatus(): string {
        return this.status;
    }
    public getSource(): string {
        return this.source;
    }
    public getNotes(): string {
        return this.notes;
    }
    public getCreatedAt(): Date {
        return this.createdAt;
    }
    public toJson(): object {
        return {
            id: this.id,
            patient: this.patient,
            receptionist: this.receptionist,
            doctor: this.doctor,
            reservationTime: this.reservationTime,
            status: this.status,
            source: this.source,
            notes: this.notes,
            createdAt: this.createdAt
        };
    }
    public static fromJson(json: any): Reservation {
        return new Reservation(
            json.id,
            Patient.fromJson(json.patient),
            User.fromJson(json.receptionist),
            User.fromJson(json.doctor),
            json.reservationTime,
            json.status,
            json.source,
            json.notes,
            json.createdAt
        );
    }
}