import { Reservation } from "$lib/shared/entities/Reservation";
import type { ReservationRepository } from "./interfaces/ReservationRepository";
import type { SupabaseClient } from '@supabase/supabase-js';

export class ReservationRepositoryImpl implements ReservationRepository {
    private supabase: SupabaseClient;
    constructor(supabase: SupabaseClient) {
        this.supabase = supabase;
    }
    async createReservation(data: any): Promise<void> {
        const { error } = await this.supabase
            .from('reservations')
            .insert(data);
        if (error) {
            console.error('Error creating reservation:', error);
            throw error;
        }
        return Promise.resolve();
    }
    getReservationById(id: string): Promise<any> {
        throw new Error("Method not implemented.");
    }
    async updateReservation(id: string, data: any): Promise<void> {
        const { error } = await this.supabase
            .from('reservations')
            .update(data)
            .eq('id', id);
        if (error) {
            console.error('Error updating reservation:', error);
            throw error;
        }
        return Promise.resolve();
    }
    deleteReservation(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async listReservations(): Promise<Reservation[] | null> {
        const { data, error } = await this.supabase
            .from('reservations')
            .select('*, patient:patients(*, medical_records(*, prescriptions(*, doctor:users(*), prescription_items(*, medicines(*))) )), receptionist:users!reservations_receptionist_id_fkey(*), doctor:users!reservations_doctor_id_fkey(*)')
            .order('created_at', { ascending: false })
        if (error || !data) {
            console.error('Error fetching reservations:', error);
            throw error;
        }
        return Promise.resolve(data.map((item) => Reservation.fromJson(item)));
    }
}