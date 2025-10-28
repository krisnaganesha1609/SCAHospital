import type { uuid } from "../types/type_def";

export class User {
    constructor(
        public userId: uuid,
        public fullName: string,
        public username: string,
        public passwordHash: string,
        public role: string,
        public phone: string,
        public email: string,
        public createdAt: Date
    ) {}
}