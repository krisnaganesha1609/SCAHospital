import { Reservation } from "$lib/shared/entities/Reservation";
import type { ReservationRepository } from "./interfaces/ReservationRepository";

export class ReservationRepositoryImpl extends Reservation implements ReservationRepository {
    createReservation(data: Partial<Reservation>): Promise<any> {
        throw new Error("Method not implemented.");
    }
    getReservationById(id: string): Promise<any> {
        throw new Error("Method not implemented.");
    }
    updateReservation(id: string, data: Partial<Reservation>): Promise<any> {
        throw new Error("Method not implemented.");
    }
    deleteReservation(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    listReservations(filter?: any): Promise<any[]> {
        throw new Error("Method not implemented.");
    }
}