import type { User } from "$lib/shared/entities/User";
import type { AuthService } from "./interfaces/AuthService";

export class AuthServiceImpl implements AuthService {
    signIn(email: string, password: string): Promise<User> {
        throw new Error("Method not implemented.");
    }
    signOut(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    me(): Promise<User> {
        throw new Error("Method not implemented.");
    }
}