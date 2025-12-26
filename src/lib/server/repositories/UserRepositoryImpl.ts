import { User } from '$lib/shared/entities/User';
import type { uuid, roles } from '$lib/shared/types/type_def';
import type { SupabaseClient } from '@supabase/supabase-js';
import { UserRepository } from './interfaces/UserRepository';
export class UserRepositoryImpl implements UserRepository {
    private supabase: SupabaseClient;
    constructor(supabase: SupabaseClient) {
        this.supabase = supabase;
    }
    async createNewUser(u: any): Promise<uuid> {
        const { data, error } = await this.supabase.auth.signUp({
            email: u.email,
            password: u.password,
        });
        if (error) {
            console.error('Error creating user:', error);
            throw error;
        }
        const userData = {
            id: data?.user?.id,
            email: data?.user?.email,
            phone: u.phone,
            full_name: u.full_name,
        }
        const { error: insertError } = await this.supabase.from('users').insert(userData);
        if (insertError) {
            console.error('Error inserting user into database:', insertError);
            throw insertError;
        }
        this.setRole(data.user?.id as uuid, u.role);
        return data.user?.id as uuid;
    }
    async updateExistingUser(id: uuid, u: any): Promise<void> {
        const { error } = await this.supabase.from('users').update(u).eq('id', id);
        if (error) {
            console.error('Error updating user:', error);
            throw error;
        }

        if (u.password) {
            const { error: authError } = await this.supabase.auth.admin.updateUserById(id, {
                password: u.password,
            });
            if (authError) {
                console.error('Error updating user password:', authError);
                throw authError;
            }
        }
        return Promise.resolve();
    }
    async fetchUsers(): Promise<User[]> {
        const { data, error } = await this.supabase
            .from('users')
            .select('*');
        if (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
        return Promise.resolve(data.map((item) => User.fromJson(item)));
    }
    async setRole(userId: uuid, role: roles): Promise<void> {
        const { error } = await this.supabase
            .from('users')
            .update({ role: role })
            .eq('id', userId);
        if (error) {
            console.error('Error setting user role:', error);
            throw error;
        }
        return Promise.resolve();
    }
    searchUsers(query: string): Promise<any[]> {
        throw new Error('Method not implemented.');
    }
    async deleteUser(userId: uuid): Promise<void> {
        const { error} = await this.supabase
            .from('users')
            .delete()
            .eq('id', userId);
        if (error) {
            console.error('Error deleting user:', error);
            throw error;
        }
        const { error: authError } = await this.supabase.auth.admin.deleteUser(userId);
        if (authError) {
            console.error('Error deleting user from auth:', authError);
            throw authError;
        }
        return Promise.resolve();
    }
}