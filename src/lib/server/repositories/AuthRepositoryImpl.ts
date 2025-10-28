import type { AuthRepository } from "./interfaces/AuthRepository";

export class AuthRepositoryImpl implements AuthRepository {
    registerNewUser(email: string, password: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    loginUser(email: string, password: string): Promise<any> {
        throw new Error("Method not implemented.");
    }
    logout(): Promise<void> {
        throw new Error("Method not implemented.");
    }
}