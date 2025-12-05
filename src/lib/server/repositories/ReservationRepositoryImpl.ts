import { Reservation } from "$lib/shared/entities/Reservation";
import type { ReservationRepository } from "./interfaces/ReservationRepository";
import type { SupabaseClient } from '@supabase/supabase-js';

export class ReservationRepositoryImpl implements ReservationRepository {
    private supabase: SupabaseClient;
    constructor(supabase: SupabaseClient) {
        this.supabase = supabase;
    }
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
    async listReservations(pageNumber: number, itemsPerPage: number): Promise<Reservation[] | null> {
        const startIndex = (pageNumber - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage - 1;
        const {data, error} = await this.supabase
                .from('reservations')
                .select('*, patient:patients(*), receptionist:users!reservations_receptionist_id_fkey(*), doctor:users!reservations_doctor_id_fkey(*)')
                .order('created_at', { ascending: false })
                .range(startIndex, endIndex);
        if (error || !data) {
            console.error('Error fetching reservations:', error);
            throw error;
        }
        return Promise.resolve(data.map((item) => Reservation.fromJson(item)));
    }
}