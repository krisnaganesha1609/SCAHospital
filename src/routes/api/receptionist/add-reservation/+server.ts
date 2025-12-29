import { AuditLogsServiceImpl } from '$lib/server/services/AuditLogsServiceImpl';
import { ReservationServiceImpl } from '$lib/server/services/ReservationServiceImpl';
import { AuditLogsRequest } from '$lib/shared/utils/AuditLogs_Request';
import { ReservationRequest } from '$lib/shared/utils/Reservation_Request';
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, locals, getClientAddress }) => {
    const payload = await request.json();

    const req = ReservationRequest.fromPOJO(payload);
    const id = await new ReservationServiceImpl(locals.supabase).registerReservation(req);

    const logs: AuditLogsRequest = new AuditLogsRequest(
        locals.user?.id || '',
        'create',
        'reservations',
        id,
        getClientAddress()
    );

    const auditLogsService = new AuditLogsServiceImpl(locals.supabase);
    await auditLogsService.recordAuditLog(logs);
    return json({ success: true });
};