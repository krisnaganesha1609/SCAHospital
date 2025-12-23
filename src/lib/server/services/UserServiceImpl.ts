import { User } from "$lib/shared/entities/User";
import type { roles } from "$lib/shared/types/type_def";
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
    async createUser(fullName: string, password: string, role: roles, phone: string, email: string): Promise<void> {
        const userPayload = {
            full_name: fullName,
            password: password, // Pastikan Repository menghandle auth.signup jika ini password
            role: role,
            phone: phone,
            email: email
        };

        // Pastikan tidak ada pemanggilan .single() yang dipaksakan jika data belum tentu ada
        await this.userRepository.createNewUser(userPayload);
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

        // Logic Metadata (Pastikan KEY sesuai dengan kolom di DB)
        const data = {
            full_name: userData.full_name,
            email: userData.email,
            role: userData.role,
            phone: userData.phone,
        };

        // Bersihkan data yang undefined/empty agar tidak menimpa data lama dengan NULL
        const cleanData = Object.fromEntries(
            Object.entries(data).filter(([_, v]) => v !== undefined && v !== '')
        );

        if (Object.keys(cleanData).length > 0) {
            await this.userRepository.updateExistingUser(id, cleanData);
        }
    }
    async deleteUser(id: string): Promise<void> {
        await this.userRepository.deleteUser(id);
        return Promise.resolve();
    }
}