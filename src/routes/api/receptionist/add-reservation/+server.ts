import { ReservationServiceImpl } from '$lib/server/services/ReservationServiceImpl';
import { AuditLogsRequest } from '$lib/shared/utils/AuditLogs_Request';
import { ReservationRequest } from '$lib/shared/utils/Reservation_Request';
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, locals }) => {
    const payload = await request.json();

    const req = ReservationRequest.fromPOJO(payload);
    const id = await new ReservationServiceImpl(locals.supabase).registerReservation(req);

    const logs: AuditLogsRequest = new AuditLogsRequest(
        locals.user?.id || '',
        'create',
        'reservations',
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
        console.error('Failed to record audit log for creating reservation');
    }
    return json({ success: true });
};