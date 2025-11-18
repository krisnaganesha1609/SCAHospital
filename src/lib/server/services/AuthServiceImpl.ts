import type { User } from "$lib/shared/entities/User";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { AuthService, EnrichedSession } from "./interfaces/AuthService";
import { AuthRepositoryImpl } from "../repositories/AuthRepositoryImpl";

export class AuthServiceImpl implements AuthService {
    async enrichSession(supabase: SupabaseClient, session: any, user: any): Promise<EnrichedSession> {
        if (!session || !user) {
            return { session: null, user: null, profile: null, role: null };
        }

        const profile = await new AuthRepositoryImpl().getUserProfile(supabase, user.id);
        const role = profile?.getRole() ?? null;

        return { session, user, profile, role };
    }
    async getEnrichedSessionFromClient(supabase: SupabaseClient): Promise<EnrichedSession> {
        const {data: { session }} = await supabase.auth.getSession();

        if (!session) return { session: null, user: null, profile: null, role: null };

        const {data: { user }, error} = await supabase.auth.getUser();

        if (error || !user) {
            return { session: null, user: null, profile: null, role: null };
        }

        return this.enrichSession(supabase, session, user);
    }
}