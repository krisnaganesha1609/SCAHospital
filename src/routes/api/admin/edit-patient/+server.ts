import { PatientServiceImpl } from '$lib/server/services/PatientServiceImpl.js';
import { AuditLogsRequest } from '$lib/shared/utils/AuditLogs_Request';

export const PUT = async ({ request, locals }) => {
    const data = await request.json();
    const id = data.id;
    const payload = data.payload;
    await new PatientServiceImpl(locals.supabase).update(id, payload);
    const logs: AuditLogsRequest = new AuditLogsRequest(
        locals.user?.id || '',
        'update',
        'patients',
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
        console.error('Failed to record audit log for updating patient');
    }
    return new Response(JSON.stringify({ message: `Patient updated successfully`, payload }), { status: 200 });
}