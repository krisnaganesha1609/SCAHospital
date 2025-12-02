import { PatientServiceImpl } from "$lib/server/services/PatientServiceImpl";
import type { PageServerLoad } from "./$types";
import { toPOJO } from '$lib/shared/utils/Utils';
import { MedicalRecordServiceImpl } from "$lib/server/services/MedicalRecordServiceImpl";


export const load: PageServerLoad = async ({ locals }) => {
    const listPatients = await new PatientServiceImpl(locals.supabase).listPatients();
    // console.log("List Patients:", listPatients);
    return { patients: toPOJO(listPatients) };
}