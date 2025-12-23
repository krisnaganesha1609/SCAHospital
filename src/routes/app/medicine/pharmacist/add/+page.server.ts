import { MedicineServiceImpl } from "$lib/server/services/MedicineServiceImpl";
import { MedicineRequest } from "$lib/shared/utils/Medicine_Request";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
    return {};
};

export const actions: Actions = {
    createMedicine: async ({ request, locals }) => {
        const formData = await request.formData();
        
        const medicineRequest: MedicineRequest = new MedicineRequest(
            formData.get('code') as string,
            formData.get('name') as string,
            formData.get('form') as string,
            formData.get('strength') as string,
            formData.get('manufacturer') as string,
            Number(formData.get('stockQty')),
            Number(formData.get('unitPrice')),
            formData.get('unitType') as string
        )

        const medicineService = new MedicineServiceImpl(locals.supabase);

        try {
            await medicineService.registerMedicine(medicineRequest);
            return { success: true };
        } catch (e) {
            return { success: false, message: 'Create medicine failed' };
        }
    }
};