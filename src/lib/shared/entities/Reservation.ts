import type { reservationStatus, uuid } from "../types/type_def";
import { Utils } from "../utils/Utils";
import { Patient } from "./Patient";
import { User } from "./User";

export class Reservation extends Utils {
    constructor(
        id: uuid,
        private patientId: uuid,
        private patient: Patient,
        private receptionistId: uuid,
        private receptionist: User,
        private doctorId: uuid,
        private doctor: User,
        private reservationTime: Date,
        private status: reservationStatus,
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
            patient_id: this.patientId,
            receptionist_id: this.receptionistId,
            doctor_id: this.doctorId,
            reservation_time: this.reservationTime,
            status: this.status,
            source: this.source,
            notes: this.notes,
        };
    }
    public static fromJson(json: any): Reservation {
        return new Reservation(
            json.id,
            json.patient_id,
            Patient.fromJson(json.patient),
            json.receptionist_id,
            User.fromJson(json.receptionist),
            json.doctor_id,
            User.fromJson(json.doctor),
            json.reservation_time,
            json.status,
            json.source,
            json.notes,
            json.created_at
        );
    }
    public static fromPOJO(obj: any): Reservation {
        return new Reservation(
            obj.id,
            obj.patientId,
            Patient.fromPOJO(obj.patient),
            obj.receptionistId,
            User.fromPOJO(obj.receptionist),
            obj.doctorId,
            User.fromPOJO(obj.doctor),
            new Date(obj.reservationTime),
            obj.status,
            obj.source,
            obj.notes,
            new Date(obj.createdAt)
        );
    }
}