import type { Reservation } from "$lib/shared/entities/Reservation";
import type { ReservationRepository } from "../repositories/interfaces/ReservationRepository";

export class ReservationRepositoryImpl implements ReservationRepository {
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