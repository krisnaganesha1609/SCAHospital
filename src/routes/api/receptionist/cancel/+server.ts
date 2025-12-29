import { AuditLogsServiceImpl } from '$lib/server/services/AuditLogsServiceImpl';
import { ReservationServiceImpl } from '$lib/server/services/ReservationServiceImpl';
import { AuditLogsRequest } from '$lib/shared/utils/AuditLogs_Request';
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

export const PATCH: RequestHandler = async ({ request, locals, getClientAddress }) => {
  const payload = await request.json();
  const req = payload.reservationId as string;

  await new ReservationServiceImpl(locals.supabase).cancel(req);
  const logs: AuditLogsRequest = new AuditLogsRequest(
    locals.user?.id || '',
    'canceling',
    'reservations',
    req,
    getClientAddress()
  );

  const auditLogsService = new AuditLogsServiceImpl(locals.supabase);
  await auditLogsService.recordAuditLog(logs);

  return json({ success: true });
};
