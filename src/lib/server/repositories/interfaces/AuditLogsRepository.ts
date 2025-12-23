import type { AuditLogsRequest } from "$lib/shared/utils/AuditLogs_Request";

export abstract class AuditLogsRepository {
    abstract record(payload: AuditLogsRequest): Promise<void>;
}