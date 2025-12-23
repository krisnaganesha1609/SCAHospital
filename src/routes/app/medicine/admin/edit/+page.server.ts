import { MedicineServiceImpl } from "$lib/server/services/MedicineServiceImpl";
import { error } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";
import { toPOJO } from '$lib/shared/utils/Utils';

export const load: PageServerLoad = async ({ url, locals }) => {
    const id = url.searchParams.get('id');
    if (!id) throw error(400, "Medicine ID is required");

    const medicineService = new MedicineServiceImpl(locals.supabase);
    
    const allMedicines = await medicineService.listMedicines();
    const medicine = allMedicines.find(m => m.getId() === id);

    if (!medicine) throw error(404, "Medicine not found");

    return {
        medicine: toPOJO(medicine)
    };
};

export const actions: Actions = {
    updateMedicine: async ({ request, locals }) => {
        const formData = await request.formData();
        const id = formData.get('id') as string;
        
        const medicineData = {
            name: formData.get('name'),
            form: formData.get('form'),
            strength: formData.get('strength'),
            unit_price: Number(formData.get('unitPrice')),
            unit_type: formData.get('unitType'), // Packaging
            stock_qty: Number(formData.get('stockQty'))
        };

        const medicineService = new MedicineServiceImpl(locals.supabase);
        
        try {
            // Menggunakan update (sesuaikan dengan method di MedicineServiceImpl kamu)
            // Jika method update belum ada, pastikan Repository sudah mendukung updateMedicine
            await medicineService.updateStock(id, medicineData.stock_qty); 
            // Catatan: Anda mungkin perlu menambahkan method updateMedicine(id, data) 
            // di Service jika ingin mengubah field selain stock.
            return { success: true };
        } catch (e) {
            console.error(e);
            return { success: false, message: "Update failed" };
        }
    }
};