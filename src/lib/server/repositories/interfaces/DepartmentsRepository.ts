import { Departments } from '../../../shared/entities/Departments';
export abstract class DepartmentsRepository {
    abstract createDepartments(departments: Departments): Promise<void>;
    abstract findAll(): Promise<any[]>;
    abstract findById(id: string): Promise<any>;
    abstract update(id: string, departments: Partial<Departments>): Promise<void>;
    abstract delete(id: string): Promise<void>;
}