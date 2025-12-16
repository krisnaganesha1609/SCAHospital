import type { reservationStatus, uuid } from "../types/type_def";

export class ReservationRequest {
    constructor(
        private patientId: uuid,
        private receptionistId: uuid,
        private doctorId: uuid,
        private reservationTime: Date,
        private status: reservationStatus | null,
        private source: string | null,
        private notes: string,
    ) {}
    public getPatientId(): uuid {
        return this.patientId;
    }
    public getReceptionistId(): uuid {
        return this.receptionistId;
    }
    public getDoctorId(): uuid {
        return this.doctorId;
    }
    public getReservationTime(): Date {
        return this.reservationTime;
    }
    public getStatus(): reservationStatus | null {
        return this.status;
    }
    public getSource(): string | null {
        return this.source;
    }
    public getNotes(): string {
        return this.notes;
    }
    public toJson(): object {
        return {
            patient_id: this.patientId,
            receptionist_id: this.receptionistId,
            doctor_id: this.doctorId,
            reservation_time: this.reservationTime,
            status: this.status,
            source: this.source,
            notes: this.notes,
        };
    }
    public static fromJson(json: any): ReservationRequest {
        return new ReservationRequest(
            json.patient_id,
            json.receptionist_id,
            json.doctor_id,
            json.reservation_time,
            json.status,
            json.source,
            json.notes,);
    }
    public static fromPOJO(obj: any): ReservationRequest {
        return new ReservationRequest(
            obj.patientId,
            obj.receptionistId,
            obj.doctorId,
            new Date(obj.reservationTime),
            obj.status,
            obj.source,
            obj.notes,
        );
    }
}