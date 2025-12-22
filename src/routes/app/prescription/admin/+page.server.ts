import { PrescriptionServiceImpl } from "$lib/server/services/PrescriptionServiceImpl";
import type { PageServerLoad, Actions } from "./$types";
import { toPOJO } from '$lib/shared/utils/Utils';

export const load: PageServerLoad = async ({ locals }) => {
    const service = new PrescriptionServiceImpl(locals.supabase);
    const listPrescriptions = await service; 
    
    return { 
        prescriptions: toPOJO(listPrescriptions) 
    };
};
