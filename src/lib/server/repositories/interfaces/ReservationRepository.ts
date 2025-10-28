import type { Reservation } from "$lib/shared/entities/Reservation";

export abstract class ReservationRepository {
    abstract createReservation(data: Partial<Reservation>): Promise<any>;
    abstract getReservationById(id: string): Promise<any>;
    abstract updateReservation(id: string, data: Partial<Reservation>): Promise<any>;
    abstract deleteReservation(id: string): Promise<void>;
    abstract listReservations(filter?: any): Promise<any[]>;
}