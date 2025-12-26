import type { uuid } from '$lib/shared/types/type_def';
import type { ReservationRequest } from '$lib/shared/utils/Reservation_Request';
import { Reservation } from '../../../shared/entities/Reservation';
export abstract class ReservationService {
    abstract registerReservation(reservation: ReservationRequest): Promise<uuid>;
    abstract checkIn(reservationId: uuid): Promise<void>;
    abstract cancel(reservationId: uuid): Promise<void>;
    abstract done(reservationId: uuid): Promise<void>;
    abstract listReservations(): Promise<Reservation[]>;
    abstract search(query: string): Promise<Reservation[]>;
}