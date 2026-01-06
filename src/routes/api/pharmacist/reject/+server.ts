import { AuditLogsServiceImpl } from '$lib/server/services/AuditLogsServiceImpl';
import { PrescriptionServiceImpl } from '$lib/server/services/PrescriptionServiceImpl';
import { AuditLogsRequest } from '$lib/shared/utils/AuditLogs_Request';
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

export const PATCH: RequestHandler = async ({ request, locals, getClientAddress }) => {
    const payload = await request.json();
    const prescription_id = payload.prescriptionId as string;
    const pharmacy_approval_id = payload.pharmacyApprovalId as string;
    const reason = payload.reason as string;


    await new PrescriptionServiceImpl(locals.supabase).rejectPrescription(prescription_id, pharmacy_approval_id, reason);
    const { data, error } = await locals.supabase.from('prescriptions').select('*, prescription_items(*, medicines(*))').eq('id', prescription_id).single();
    if (error) {
        console.error('Error fetching prescription items:', error);
        return json({ success: false, error: 'Failed to fetch prescription items' }, { status: 500 });
    }
    data.prescription_items.forEach(async (item: any) => {
        const medicine = item.medicines;
        const { error } = await locals.supabase.from('medicines').update({
            stock_qty: medicine.stock_qty + item.quantity
        }).eq('id', medicine.id);
        if (error) {
            console.error(`Failed to update stock for medicine ${medicine.name}:`, error);
        }
    });

    // const logs: AuditLogsRequest = new AuditLogsRequest(
    //     locals.user?.id || '',
    //     'rejecting',
    //     'prescriptions',
    //     prescription_id,
    //     getClientAddress()
    // );

    // const auditLogsService = new AuditLogsServiceImpl(locals.supabase);
    // await auditLogsService.recordAuditLog(logs);

    return json({ success: true });
};
