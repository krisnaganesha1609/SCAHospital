import type { User } from "$lib/shared/entities/User";
import type { roles, uuid } from "$lib/shared/types/type_def";

export abstract class UserService {
    abstract createUser(
        fullName: string,
        username: string,
        passwordHash: string,
        role: roles,
        phone: string,
        email: string
    ): Promise<uuid>;

    abstract assignRoleToUser(userId: string, role: roles): Promise<void>;

    abstract listUsers(): Promise<User[]>;
}