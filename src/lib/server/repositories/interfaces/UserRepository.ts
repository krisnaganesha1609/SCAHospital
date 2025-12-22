import type { User } from "$lib/shared/entities/User";
import type { roles, uuid } from "$lib/shared/types/type_def";

export abstract class UserRepository {
    abstract createNewUser(u: Partial<User>): Promise<void>;
    abstract updateExistingUser(id: uuid, u: any): Promise<void>;
    abstract fetchUsers(): Promise<any[]>;
    abstract setRole(userId: uuid, role: roles): Promise<void>;
    abstract searchUsers(query: string): Promise<any[]>;
    abstract deleteUser(userId: uuid): Promise<void>;
}