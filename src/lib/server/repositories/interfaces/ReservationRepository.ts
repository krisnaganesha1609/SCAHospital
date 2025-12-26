import type { Reservation } from "$lib/shared/entities/Reservation";
import type { uuid } from "$lib/shared/types/type_def";

export abstract class ReservationRepository {
    abstract createReservation(data: any): Promise<uuid>;
    abstract getReservationById(id: uuid): Promise<any>;
    abstract updateReservation(id: uuid, data: Partial<Reservation>): Promise<any>;
    abstract deleteReservation(id: uuid): Promise<void>;
    abstract listReservations(pageNumber: number, itemsPerPage: number): Promise<Reservation[] | null>;
}