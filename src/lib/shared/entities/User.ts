import type { roles, uuid } from "../types/type_def";
import { Utils } from "../utils/Utils";

export class User extends Utils {
    constructor(
        id: uuid,
        private fullName: string,
        private username: string,
        private passwordHash: string,
        private role: roles,
        private phone: string,
        private email: string,
        private createdAt: Date
    ) {
        super(id);
    }

    public getUserId(): uuid {
        return this.id;
    }
    public getFullName(): string {
        return this.fullName;
    }
    public getUsername(): string {
        return this.username;
    }
    public getPasswordHash(): string {
        return this.passwordHash;
    }
    public getRole(): roles {
        return this.role;
    }
    public getPhone(): string {
        return this.phone;
    }
    public getEmail(): string {
        return this.email;
    }
    public getCreatedAt(): Date {
        return this.createdAt;
    }
    public toJson(): object {
        return {
            userId: this.id,
            fullName: this.fullName,
            username: this.username,
            passwordHash: this.passwordHash,
            role: this.role,
            phone: this.phone,
            email: this.email,
            createdAt: this.createdAt
        };
    }
    public static fromJson(json: any): User {
        return new User(
            json.id,
            json.fullName,
            json.username,
            json.passwordHash,
            json.role,
            json.phone,
            json.email,
            new Date(json.createdAt)
        );
    }
}