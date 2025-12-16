import { MedicineServiceImpl } from "$lib/server/services/MedicineServiceImpl";
import { toPOJO } from "$lib/shared/utils/Utils";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
    const medicineService = new MedicineServiceImpl(locals.supabase);
    const medicines = await medicineService.listMedicines();
    console.log("Medicines:", medicines);
    return {
        medicines: toPOJO(medicines),
    };
}
