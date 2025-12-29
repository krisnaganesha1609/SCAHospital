import { AuditLogsServiceImpl } from '$lib/server/services/AuditLogsServiceImpl';
import { PrescriptionServiceImpl } from '$lib/server/services/PrescriptionServiceImpl';
import { AuditLogsRequest } from '$lib/shared/utils/AuditLogs_Request';
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

export const PATCH: RequestHandler = async ({ request, locals, getClientAddress }) => {
  const payload = await request.json();
  const prescription_id = payload.prescriptionId as string;
  const pharmacy_approval_id = payload.pharmacyApprovalId as string;
  const pharmacist_id = payload.pharmacistId as string;

  await new PrescriptionServiceImpl(locals.supabase).approvePrescription(prescription_id, pharmacy_approval_id, pharmacist_id);

  const logs: AuditLogsRequest = new AuditLogsRequest(
    locals.user?.id || '',
    'approving',
    'prescriptions',
    prescription_id,
    getClientAddress()
  );

  const auditLogsService = new AuditLogsServiceImpl(locals.supabase);
  await auditLogsService.recordAuditLog(logs);
  return json({ success: true });
};
