import { ReservationServiceImpl } from "$lib/server/services/ReservationServiceImpl";
import { PatientServiceImpl } from "$lib/server/services/PatientServiceImpl";
import type { PageServerLoad } from "./$types";
import { toPOJO } from "$lib/shared/utils/Utils";

export const load: PageServerLoad = async ({ locals }) => {
  try {
    const listReservations = await new ReservationServiceImpl(locals.supabase).listReservations();
    console.log("List Reservations:", listReservations);
    const listPatients = await new PatientServiceImpl(locals.supabase).listPatients();
    console.log(listPatients);
    return { reservations: toPOJO(listReservations), patients: toPOJO(listPatients) };
  } catch (err) {
    console.error("Failed to load reservations:", err);
    // Return an empty list so UI still renders gracefully
    return { reservations: toPOJO([]), patients: toPOJO([]) };
  }
};