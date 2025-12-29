import { AuditLogsServiceImpl } from '$lib/server/services/AuditLogsServiceImpl';
import { PatientServiceImpl } from '$lib/server/services/PatientServiceImpl';
import { AuditLogsRequest } from '$lib/shared/utils/AuditLogs_Request';
export const POST = async ({ request, locals, getClientAddress }) => {
    const payload = await request.json();
    const patientService = new PatientServiceImpl(locals.supabase);
    try {
        const id = await patientService.register(payload);
        const logs: AuditLogsRequest = new AuditLogsRequest(
            locals.user?.id || '',
            'create',
            'patients',
            id,
            getClientAddress()
        );

        const auditLogsService = new AuditLogsServiceImpl(locals.supabase);
        await auditLogsService.recordAuditLog(logs);
        return new Response(JSON.stringify({ success: true }), { status: 201 });
    } catch (e) {
        console.error('Error adding patient:', e);
        return new Response(JSON.stringify({ success: false, message: 'Failed to add patient' }), { status: 500 });
    }
};

