import { AuditLogsServiceImpl } from '$lib/server/services/AuditLogsServiceImpl';
import { PatientServiceImpl } from '$lib/server/services/PatientServiceImpl.js';
import { AuditLogsRequest } from '$lib/shared/utils/AuditLogs_Request';

export const PUT = async ({ request, locals, getClientAddress }) => {
    const data = await request.json();
    const id = data.id;
    const payload = data.payload;
    await new PatientServiceImpl(locals.supabase).update(id, payload);
    const logs: AuditLogsRequest = new AuditLogsRequest(
        locals.user?.id || '',
        'update',
        'patients',
        id,
        getClientAddress()
    );

    const auditLogsService = new AuditLogsServiceImpl(locals.supabase);
    await auditLogsService.recordAuditLog(logs);
    return new Response(JSON.stringify({ message: `Patient updated successfully`, payload }), { status: 200 });
}