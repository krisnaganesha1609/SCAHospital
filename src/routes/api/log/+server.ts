import { AuditLogsServiceImpl } from "$lib/server/services/AuditLogsServiceImpl"
import { AuditLogsRequest } from "$lib/shared/utils/AuditLogs_Request";
import type { RequestHandler } from "./$types";
export const POST: RequestHandler = async ({ request, locals, getClientAddress }) => {
    const body = await request.json();
    const auditLogsRequest = AuditLogsRequest.fromJson(body);
    const payload = new AuditLogsRequest(
        auditLogsRequest.getUserId(),
        auditLogsRequest.getAction(),
        auditLogsRequest.getTableName(),
        auditLogsRequest.getRecordId(),
        auditLogsRequest.getIpAddress() === '' || auditLogsRequest.getIpAddress() === null || auditLogsRequest.getIpAddress() === undefined ? getClientAddress() : auditLogsRequest.getIpAddress()
    );
    const auditLogsService = new AuditLogsServiceImpl(locals.supabase);
    await auditLogsService.recordAuditLog(payload);

    return new Response(JSON.stringify({ success: true }), { status: 200 });
}