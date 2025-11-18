import type { User } from "$lib/shared/entities";
import type { SupabaseClient } from "@supabase/supabase-js";

export abstract class AuthRepository {
    abstract getUserProfile(supabase: SupabaseClient, userId: string): Promise<User | null>;
    abstract getUserRole(supabase: SupabaseClient, userId: string): Promise<string | null>;
}