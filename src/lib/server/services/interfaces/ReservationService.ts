import type { uuid } from '$lib/shared/types/type_def';
import { Reservation } from '../../../shared/entities/Reservation';
export abstract class ReservationService {
    abstract registerReservation(reservation: Reservation): Promise<void>;
    abstract checkIn(reservationId: uuid): Promise<void>;
    abstract cancel(reservationId: uuid): Promise<void>;
    abstract listReservations(): Promise<Reservation[]>;
    abstract search(query: string): Promise<Reservation[]>;
}