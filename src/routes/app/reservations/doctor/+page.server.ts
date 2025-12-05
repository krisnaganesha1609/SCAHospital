import { ReservationServiceImpl } from "$lib/server/services/ReservationServiceImpl";
import type { PageServerLoad } from "./$types";
import { toPOJO } from "$lib/shared/utils/Utils";

export const load: PageServerLoad = async ({ locals }) => {
  try {
    const listReservations = await new ReservationServiceImpl(locals.supabase).listReservations();
    console.log("List Reservations:", listReservations);
    return { reservations: toPOJO(listReservations) };
  } catch (err) {
    console.error("Failed to load reservations:", err);
    // Return an empty list so UI still renders gracefully
    return { reservations: toPOJO([]) };
  }
};