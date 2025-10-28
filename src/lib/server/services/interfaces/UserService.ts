import type { User } from "$lib/shared/entities/User";
import type { roles } from "$lib/shared/types/type_def";

export abstract class UserService {
    abstract createUser(
        fullName: string,
        username: string,
        passwordHash: string,
        role: roles,
        phone: string,
        email: string
    ): Promise<void>;

    abstract assignRoleToUser(userId: string, role: roles): Promise<void>;

    abstract listUsers(): Promise<User[]>;
}