import { MedicineServiceImpl } from "$lib/server/services/MedicineServiceImpl";
import { AuditLogsRequest } from "$lib/shared/utils/AuditLogs_Request";
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
            const id = await medicineService.registerMedicine(medicineRequest);
            const logs: AuditLogsRequest = new AuditLogsRequest(
                locals.user?.id || '',
                'create',
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
            return { success: false, message: 'Create medicine failed' };
        }
    }
};