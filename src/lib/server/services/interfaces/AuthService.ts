import type { User } from "$lib/shared/entities/User";

export abstract class AuthService {
    abstract signIn(email: string, password: string): Promise<User>;
    abstract signOut(): Promise<void>;
    abstract me(): Promise<User>;
}