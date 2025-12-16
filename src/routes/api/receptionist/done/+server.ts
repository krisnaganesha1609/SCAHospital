import { ReservationServiceImpl } from '$lib/server/services/ReservationServiceImpl';
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

export const PATCH: RequestHandler = async ({ request, locals }) => {
  const payload = await request.json();
  const req = payload.reservationId as string;

  await new ReservationServiceImpl(locals.supabase).done(req);

  return json({ success: true });
};
