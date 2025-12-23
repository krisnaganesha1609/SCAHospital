import { MedicineServiceImpl } from "$lib/server/services/MedicineServiceImpl";
import type { PageServerLoad } from "./$types";
import { toPOJO } from '$lib/shared/utils/Utils';

export const load: PageServerLoad = async ({ locals }) => {
    // Menggunakan MedicineServiceImpl untuk mengambil data
    const listMedicines = await new MedicineServiceImpl(locals.supabase).listMedicines();
    
    // Mengembalikan data dalam format POJO agar bisa diserialisasi oleh SvelteKit
    return { medicines: toPOJO(listMedicines) };
}