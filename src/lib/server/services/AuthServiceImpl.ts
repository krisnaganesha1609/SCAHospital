import type { SupabaseClient } from "@supabase/supabase-js";
import type { AuthService, EnrichedSession } from "./interfaces/AuthService";
import { AuthRepositoryImpl } from "../repositories/AuthRepositoryImpl";

export class AuthServiceImpl implements AuthService {

    private supabase: SupabaseClient;
    constructor(supabase: SupabaseClient) {
        this.supabase = supabase;
    }
    async enrichSession( session: any, user: any): Promise<EnrichedSession> {
        if (!session || !user) {
            return { session: null, user: null, profile: null, role: null };
        }

        const profile = await new AuthRepositoryImpl().getUserProfile(this.supabase, user.id);
        const role = profile?.getRole() ?? null;

        return { session, user, profile, role };
    }
    async getEnrichedSessionFromClient(): Promise<EnrichedSession> {
        const {data: { session }} = await this.supabase.auth.getSession();

        if (!session) return { session: null, user: null, profile: null, role: null };

        const {data: { user }, error} = await this.supabase.auth.getUser();

        if (error || !user) {
            return { session: null, user: null, profile: null, role: null };
        }

        return this.enrichSession(session, user);
    }

    async logout(): Promise<void> {
        await new AuthRepositoryImpl().logout(this.supabase);
    }
}