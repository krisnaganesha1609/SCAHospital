import { PatientServiceImpl } from "$lib/server/services/PatientServiceImpl";
import type { PageServerLoad } from "./$types";
import { toPOJO } from '$lib/shared/utils/Utils';


export const load: PageServerLoad = async ({ locals }) => {
    const listPatients = await new PatientServiceImpl(locals.supabase).listPatients();
    console.log(listPatients);
    return { patients: toPOJO(listPatients) };
}