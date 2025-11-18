import type { User } from "$lib/shared/entities/User";
import type { SupabaseClient } from "@supabase/supabase-js";

export type EnrichedSession = {
  session: any | null;
  user: any | null;
  profile: any | null
  role: string | null;
};
export abstract class AuthService {
    abstract getEnrichedSessionFromClient(supabase: SupabaseClient): Promise<EnrichedSession>;
}