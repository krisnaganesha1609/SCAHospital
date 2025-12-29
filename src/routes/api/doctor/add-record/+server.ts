import { AuditLogsServiceImpl } from '$lib/server/services/AuditLogsServiceImpl';
import { MedicalRecordServiceImpl } from '$lib/server/services/MedicalRecordServiceImpl';
import { AuditLogsRequest } from '$lib/shared/utils/AuditLogs_Request';
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, locals, getClientAddress }) => {
  const payload = await request.json();

  const recordId = await new MedicalRecordServiceImpl(locals.supabase).createMedicalRecordForAPatient(payload);

  const logs: AuditLogsRequest = new AuditLogsRequest(
    locals.user?.id || '',
    'create',
    'medical_records',
    recordId,
    getClientAddress()
  );

  const auditLogsService = new AuditLogsServiceImpl(locals.supabase);
  await auditLogsService.recordAuditLog(logs);

  return json({ success: true, medicalRecordId: recordId });
};
