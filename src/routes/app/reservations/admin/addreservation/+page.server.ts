import type { PageServerLoad } from './$types';
import { UserServiceImpl } from '$lib/server/services/UserServiceImpl';
import { PatientServiceImpl } from '$lib/server/services/PatientServiceImpl';
import { toPOJO } from '$lib/shared/utils/Utils';

export const load: PageServerLoad = (async ({ locals }) => {
    try {
        const listUsers = await new UserServiceImpl(locals.supabase).listUsers();
        const doctors = listUsers.filter(user => user.getRole() === 'Doctor');
        const listPatients = await new PatientServiceImpl(locals.supabase).listPatients();
        console.log(listPatients);
        return { doctors: toPOJO(doctors), patients: toPOJO(listPatients) };
      } catch (err) {
        console.error("Failed to load reservations:", err);
        // Return an empty list so UI still renders gracefully
        return { doctors: toPOJO([]), patients: toPOJO([]) };
      }
}) satisfies PageServerLoad;