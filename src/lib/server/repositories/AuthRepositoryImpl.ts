import type { AuthRepository } from "./interfaces/AuthRepository";
import { supabase } from "../../supabaseClient";
import { User } from "$lib/shared/entities";
import type { SupabaseClient } from "@supabase/supabase-js";

export class AuthRepositoryImpl implements AuthRepository {
    async getUserProfile(supabase: SupabaseClient, userId: string): Promise<User | null> {
    if (!userId) return null
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
    if (error || !data) {
        console.error('Error fetching user profile:', error);
        return null;
    }
    return User.fromJson(data);
    }

    async getUserRole(supabase: SupabaseClient, userId: string): Promise<string | null> {
        const profile = await this.getUserProfile(supabase, userId);
        return profile?.getRole() ?? null;
    }

}