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
    approve: async ({ request, locals }) => {
        const formData = await request.formData();
        const prescriptionId = formData.get('prescriptionId') as string; 
        const pharmacyApprovalId = formData.get('pharmacyApprovalId') as string;
        const pharmacistId = formData.get('pharmacistId') as string;
        const service = new PrescriptionServiceImpl(locals.supabase);
        await service.approvePrescription(prescriptionId, pharmacyApprovalId, pharmacistId);
    },
    dispense: async ({ request, locals }) => {
        const formData = await request.formData();
        const prescriptionId = formData.get('prescriptionId') as string; 
        const pharmacyApprovalId = formData.get('pharmacyApprovalId') as string;
        const service = new PrescriptionServiceImpl(locals.supabase);
        await service.markDispensed(prescriptionId, pharmacyApprovalId);
    },
    cancel: async ({ request, locals }) => {
        const formData = await request.formData();
        const prescriptionId = formData.get('prescriptionId') as string;
        const pharmacyApprovalId = formData.get('pharmacyApprovalId') as string;
        const cancelReason = formData.get('cancelReason') as string || 'No reason provided';
        const service = new PrescriptionServiceImpl(locals.supabase);
        await service.rejectPrescription(prescriptionId, pharmacyApprovalId, cancelReason);
    }
};
