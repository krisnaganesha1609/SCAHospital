import { MedicalRecordServiceImpl } from '$lib/server/services/MedicalRecordServiceImpl';
import { AuditLogsRequest } from '$lib/shared/utils/AuditLogs_Request';
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, locals }) => {
  const payload = await request.json();

  const recordId = await new MedicalRecordServiceImpl(locals.supabase).createMedicalRecordForAPatient(payload);

  const logs: AuditLogsRequest = new AuditLogsRequest(
    locals.user?.id || '',
    'create',
    'medical_records',
    recordId,
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
    console.error('Failed to record audit log for creating medical record');
  }

  return json({ success: true, medicalRecordId: recordId });
};
