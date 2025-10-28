export abstract class AuthRepository {
    abstract registerNewUser(email: string, password: string): Promise<void>;
    abstract loginUser(email: string, password: string): Promise<any>; // returns JWT token
    abstract logout(): Promise<void>;
}