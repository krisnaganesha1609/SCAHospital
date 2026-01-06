import { PrescriptionServiceImpl } from "$lib/server/services/PrescriptionServiceImpl";
import type { PageServerLoad, Actions } from "./$types";
import { toPOJO } from '$lib/shared/utils/Utils';

export const load: PageServerLoad = async ({ locals }) => {
    const service = new PrescriptionServiceImpl(locals.supabase);
    const listPrescriptions = await service.getPharmacyApprovalsList();

    return {
        prescriptions: toPOJO(listPrescriptions)
    };
};

export const actions: Actions = {
    approve: async ({ request, url }) => {
        const formData = await request.formData();
        const prescriptionId = formData.get('prescriptionId') as string;
        const pharmacyApprovalId = formData.get('pharmacyApprovalId') as string;
        const pharmacistId = formData.get('pharmacistId') as string;

        const response = await fetch(`${url.origin}/api/pharmacist/approve`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prescriptionId,
                pharmacyApprovalId,
                pharmacistId
            })
        });
        if (!response.ok) {
            throw new Error('Failed to approve prescription');
        }
    },
    dispense: async ({ request, url }) => {
        const formData = await request.formData();
        const prescriptionId = formData.get('prescriptionId') as string;
        const pharmacyApprovalId = formData.get('pharmacyApprovalId') as string;

        const response = await fetch(`${url.origin}/api/pharmacist/dispense`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prescriptionId,
                pharmacyApprovalId
            })
        });
        if (!response.ok) {
            throw new Error('Failed to dispense prescription');
        }
    },
    cancel: async ({ request, url }) => {
        const formData = await request.formData();
        const prescriptionId = formData.get('prescriptionId') as string;
        const pharmacyApprovalId = formData.get('pharmacyApprovalId') as string;
        const cancelReason = formData.get('cancelReason') as string || 'No reason provided';
        const response = await fetch(`${url.origin}/api/pharmacist/reject`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prescriptionId,
                pharmacyApprovalId,
                cancelReason
            })
        });
        if (!response.ok) {
            throw new Error('Failed to cancel prescription');
        }
    }
};
