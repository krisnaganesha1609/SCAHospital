import { ReservationServiceImpl } from '$lib/server/services/ReservationServiceImpl';
import { AuditLogsRequest } from '$lib/shared/utils/AuditLogs_Request';
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

export const PATCH: RequestHandler = async ({ request, locals }) => {
  const payload = await request.json();
  const req = payload.reservationId as string;

  await new ReservationServiceImpl(locals.supabase).checkIn(req);

  const logs: AuditLogsRequest = new AuditLogsRequest(
    locals.user?.id || '',
    'check-in',
    'reservations',
    req,
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
    console.error('Failed to record audit log for checking in reservation');
  }

  return json({ success: true });
};
