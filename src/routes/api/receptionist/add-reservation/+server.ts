import { ReservationServiceImpl } from '$lib/server/services/ReservationServiceImpl';
import { ReservationRequest } from '$lib/shared/utils/Reservation_Request';
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, locals }) => {
    const payload = await request.json();

    const req = ReservationRequest.fromPOJO(payload);
    await new ReservationServiceImpl(locals.supabase).registerReservation(req);

    return json({ success: true });
};