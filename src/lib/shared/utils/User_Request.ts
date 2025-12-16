import type { roles, uuid } from "../types/type_def";
import { Utils } from "../utils/Utils";

export class User extends Utils {
    constructor(
        id: uuid,
        private fullName: string,
        private username: string,
        private role: roles,
        private phone: string,
        private email: string,
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
    public getRole(): roles {
        return this.role;
    }
    public getPhone(): string {
        return this.phone;
    }
    public getEmail(): string {
        return this.email;
    }
    public toJson(): object {
        return {
            userId: this.id,
            full_name: this.fullName,
            username: this.username,
            role: this.role,
            phone: this.phone,
            email: this.email,
        };
    }
    public static fromJson(json: any): User {
        return new User(
            json.id,
            json.full_name,
            json.username,
            json.role,
            json.phone,
            json.email,
        );
    }
    public static fromPOJO(pojo: any): User {
        return new User(
            pojo.id,
            pojo.fullName,
            pojo.username,
            pojo.role,
            pojo.phone,
            pojo.email,
        );
    }
}