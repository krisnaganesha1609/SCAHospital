import type { AuditLogsRequest } from "$lib/shared/utils/AuditLogs_Request";

export abstract class AuditLogsService {
    abstract recordAuditLog(payload: AuditLogsRequest): Promise<void>;
}