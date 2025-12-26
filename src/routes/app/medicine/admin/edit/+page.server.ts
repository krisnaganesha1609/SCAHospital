import { MedicineServiceImpl } from "$lib/server/services/MedicineServiceImpl";
import { error } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";
import { toPOJO } from '$lib/shared/utils/Utils';
import { AuditLogsRequest } from "$lib/shared/utils/AuditLogs_Request";

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
            unit_type: formData.get('unitType'),
            stock_qty: Number(formData.get('stockQty'))
        };

        const medicineService = new MedicineServiceImpl(locals.supabase);

        try {
            await medicineService.updateMedicine(id, medicineData);
            const logs: AuditLogsRequest = new AuditLogsRequest(
                locals.user?.id || '',
                'update',
                'medicine',
                id,
                ''
            );

            const auditResponse = await fetch('/api/log', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(logs)
            });

            if (!auditResponse.ok) {
                console.error('Failed to record audit log for creating medicine');
            }
            return { success: true };
        } catch (e) {
            console.error(e);
            return { success: false, message: "Update failed" };
        }
    }
};