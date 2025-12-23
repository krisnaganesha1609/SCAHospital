import { MedicineServiceImpl } from "$lib/server/services/MedicineServiceImpl";
import { MedicineRequest } from "$lib/shared/utils/Medicine_Request";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
    return {};
};

export const actions: Actions = {
    createMedicine: async ({ request, locals }) => {
        const formData = await request.formData();
        
        // Bungkus semua variabel menjadi satu objek (MedicineRequest)
        const medicineRequest:MedicineRequest = new MedicineRequest(
            name: (formData.get('name') || '').toString().trim(),
            form: (formData.get('form') || '').toString().trim(),
            strength: (formData.get('strength') || '').toString().trim(),
            unitPrice: Number(formData.get('unitPrice')),
            unitType: (formData.get('unitType') || '').toString().trim(),
            stockQty: Number(formData.get('stockQty'))
        );

        // Server-side validation dasar
        if (!medicineRequest.name || !medicineRequest.form || isNaN(medicineRequest.unitPrice) || isNaN(medicineRequest.stockQty)) {
            return { success: false, message: 'Missing required fields' };
        }

        const medicineService = new MedicineServiceImpl(locals.supabase);

        try {
            // Panggil method dengan mengirim satu objek sesuai permintaan backend
            await medicineService.registerMedicine(medicineRequest);
            return { success: true };
        } catch (e) {
            console.error('createMedicine failed', e);
            return { success: false, message: 'Create medicine failed' };
        }
    }
};