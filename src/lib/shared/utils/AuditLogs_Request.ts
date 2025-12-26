import type { uuid } from "../types/type_def";

export class AuditLogsRequest {
    constructor(
        private userId: uuid,
        private action: string,
        private tableName: string,
        private recordId: uuid,
        private ipAddress: string,
    ) {}
    public getUserId(): uuid {
        return this.userId;
    }
    public getAction(): string {
        return this.action;
    }
    public getTableName(): string {
        return this.tableName;
    }
    public getRecordId(): uuid {
        return this.recordId;
    }
    public getIpAddress(): string {
        return this.ipAddress;
    }
    public toJson(): any {
        return {
            user_id: this.userId,
            action: this.action,
            table_name: this.tableName,
            record_id: this.recordId,
            ip_address: this.ipAddress,
        };
    }

    public static fromJson(json: any): AuditLogsRequest {
        return new AuditLogsRequest(
            json.user_id,
            json.action,
            json.table_name,
            json.record_id,
            json.ip_address,
        );
    }
    
    public static fromPOJO(obj: any): AuditLogsRequest {
        return new AuditLogsRequest(
            obj.userId,
            obj.action,
            obj.tableName,
            obj.recordId,
            obj.ipAddress,
        );
    }
}