import type { Reservation } from "$lib/shared/entities/Reservation";
import type { uuid } from "$lib/shared/types/type_def";
import type { SupabaseClient } from "@supabase/supabase-js";
import { ReservationRepositoryImpl } from "../repositories/ReservationRepositoryImpl";
import type { ReservationService } from "./interfaces/ReservationService";
import { get } from "svelte/store";
import { reservationPaginationStore } from "$lib/shared/stores/pagination";
import type { ReservationRequest } from "$lib/shared/utils/Reservation_Request";

export class ReservationServiceImpl implements ReservationService {
    private reservationRepository: ReservationRepositoryImpl;
    constructor(supabase: SupabaseClient) {
        this.reservationRepository = new ReservationRepositoryImpl(supabase);
    }
    async listReservations(): Promise<Reservation[]> {
        const reservations = await this.reservationRepository.listReservations(get(reservationPaginationStore).currentPage, get(reservationPaginationStore).itemsPerPage);
        if (reservations === null) {
            throw new Error("Failed to fetch reservations. Please Contact Admin.");
        }
        if (!reservations || reservations.length === 0) {
            return [];
        }
        return reservations;
    }
    registerReservation(reservation: ReservationRequest): Promise<void> {
        const data = reservation.toJson();
        return this.reservationRepository.createReservation(data);
    }
    checkIn(reservationId: uuid): Promise<void> {
        return this.reservationRepository.updateReservation(reservationId, { status: 'Checked In' });
    }
    cancel(reservationId: uuid): Promise<void> {
        return this.reservationRepository.updateReservation(reservationId, { status: 'Cancelled' });
    }
    done(reservationId: uuid): Promise<void> {
        return this.reservationRepository.updateReservation(reservationId, { status: 'Done' });
    }
    search(query: string): Promise<Reservation[]> {
        throw new Error("Method not implemented.");
    }
}