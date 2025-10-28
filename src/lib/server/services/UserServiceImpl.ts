import type { User } from "$lib/shared/entities/User";
import type { roles } from "$lib/shared/types/type_def";
import type { UserService } from "./interfaces/UserService";

export class UserServiceImpl implements UserService {
    createUser(fullName: string, username: string, passwordHash: string, role: roles, phone: string, email: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    assignRoleToUser(userId: string, role: roles): Promise<void> {
        throw new Error("Method not implemented.");
    }
    listUsers(): Promise<User[]> {
        throw new Error("Method not implemented.");
    }
}