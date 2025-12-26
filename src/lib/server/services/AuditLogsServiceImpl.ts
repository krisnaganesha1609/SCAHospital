import type { SupabaseClient } from "@supabase/supabase-js";
import type { AuditLogsRepository } from "../repositories/interfaces/AuditLogsRepository";
import type { AuditLogsService } from "./interfaces/AuditLogsService";
import type { AuditLogsRequest } from "$lib/shared/utils/AuditLogs_Request";
import { AuditLogsRepositoryImpl } from "../repositories/AuditLogsRepositoryImpl";

export class AuditLogsServiceImpl implements AuditLogsService {
    private auditLogsRepository: AuditLogsRepository;
    constructor(supabase: SupabaseClient) {
        this.auditLogsRepository = new AuditLogsRepositoryImpl(supabase);
    }
    async recordAuditLog(payload: AuditLogsRequest): Promise<void> {
        await this.auditLogsRepository.record(payload);
    } 
}