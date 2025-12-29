import type { SupabaseClient } from "@supabase/supabase-js";
import type { AuditLogsRepository } from "./interfaces/AuditLogsRepository";
import type { AuditLogsRequest } from "$lib/shared/utils/AuditLogs_Request";

export class AuditLogsRepositoryImpl implements AuditLogsRepository {
    private supabase: SupabaseClient;
    constructor(supabase: SupabaseClient) {
        this.supabase = supabase;
    }
    async record(payload: AuditLogsRequest): Promise<void> {
        const { error } = await this.supabase
            .from('audit_logs')
            .insert(payload.toJson());
        if (error) {
            throw new Error(`Failed to record audit log: ${error.message}`);
        }
    }
}