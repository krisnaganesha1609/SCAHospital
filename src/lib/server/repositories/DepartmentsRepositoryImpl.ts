import type { Departments } from "$lib/shared/entities";
import { DepartmentsRepository } from "./interfaces/DepartmentsRepository";

export class DepartmentsRepositoryImpl extends DepartmentsRepository {
    createDepartments(departments: Departments): Promise<void> {
        throw new Error("Method not implemented.");
    }
    findAll(): Promise<any[]> {
        throw new Error("Method not implemented.");
    }
    findById(id: string): Promise<any> {
        throw new Error("Method not implemented.");
    }
    update(id: string, departments: Partial<Departments>): Promise<void> {
        throw new Error("Method not implemented.");
    }
    delete(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
}