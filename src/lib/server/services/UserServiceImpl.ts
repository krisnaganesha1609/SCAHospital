import { User } from "$lib/shared/entities/User";
import type { roles, uuid } from "$lib/shared/types/type_def";
import type { SupabaseClient } from "@supabase/supabase-js";
import { UserRepositoryImpl } from "../repositories/UserRepositoryImpl";
import type { UserService } from "./interfaces/UserService";
import { includeIfNotEmpty } from "$lib/shared/utils/Utils";

export class UserServiceImpl implements UserService {
    private supabase: SupabaseClient;
    private userRepository: UserRepositoryImpl;
    constructor(supabase: SupabaseClient) {
        this.supabase = supabase;
        this.userRepository = new UserRepositoryImpl(supabase);
    }
    async createUser(fullName: string, password: string, role: roles, phone: string, email: string): Promise<uuid> {
        const userPayload = {
            full_name: fullName,
            password: password,
            role: role,
            phone: phone,
            email: email
        };
        const userId = await this.userRepository.createNewUser(userPayload);
        return Promise.resolve(userId);
    }
    async assignRoleToUser(userId: string, role: roles): Promise<void> {
        await this.userRepository.setRole(userId, role);
        return Promise.resolve();
    }
    async listUsers(): Promise<User[]> {
        const usersData = await this.userRepository.fetchUsers();
        return usersData;
    }
    async updateUser(id: string, userData: any): Promise<void> {
        const data = {
            ...includeIfNotEmpty('full_name', userData.full_name),
            ...includeIfNotEmpty('email', userData.email),
            ...includeIfNotEmpty('role', userData.role),
            ...includeIfNotEmpty('phone', userData.phone),
            ...includeIfNotEmpty('password', userData.password),
        };
        await this.userRepository.updateExistingUser(id, data);

    }
    async deleteUser(id: string): Promise<void> {
        await this.userRepository.deleteUser(id);
        return Promise.resolve();
    }
}