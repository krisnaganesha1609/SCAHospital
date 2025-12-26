import { PatientServiceImpl } from '$lib/server/services/PatientServiceImpl';
import { AuditLogsRequest } from '$lib/shared/utils/AuditLogs_Request';
export const POST = async ({ request, locals }) => {
    const payload = await request.json();
    const patientService = new PatientServiceImpl(locals.supabase);
    try {
        const id = await patientService.register(payload);
        const logs: AuditLogsRequest = new AuditLogsRequest(
            locals.user?.id || '',
            'create',
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
            console.error('Failed to record audit log for creating patient');
        }
        return new Response(JSON.stringify({ success: true }), { status: 201 });
    } catch (e) {
        console.error('Error adding patient:', e);
        return new Response(JSON.stringify({ success: false, message: 'Failed to add patient' }), { status: 500 });
    }
};

