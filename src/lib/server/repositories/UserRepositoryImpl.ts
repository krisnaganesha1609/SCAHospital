import { User } from '$lib/shared/entities/User';
import type { uuid, roles } from '$lib/shared/types/type_def';
import { UserRepository } from './interfaces/UserRepository';
export class UserRepositoryImpl extends User implements UserRepository {
    createNewUser(u: Partial<User>): Promise<void> {
        throw new Error('Method not implemented.');
    }
    updateExistingUser(u: Partial<User>): Promise<void> {
        throw new Error('Method not implemented.');
    }
    fetchUsers(): Promise<any[]> {
        throw new Error('Method not implemented.');
    }
    setRole(userId: uuid, role: roles): Promise<void> {
        throw new Error('Method not implemented.');
    }
    searchUsers(query: string): Promise<any[]> {
        throw new Error('Method not implemented.');
    }
    deleteUser(userId: uuid): Promise<void> {
        throw new Error('Method not implemented.');
    }
}