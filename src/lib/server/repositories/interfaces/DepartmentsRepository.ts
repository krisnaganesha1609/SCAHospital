import type { uuid } from '$lib/shared/types/type_def';
import { Departments } from '../../../shared/entities/Departments';
export abstract class DepartmentsRepository {
    abstract createDepartments(departments: Departments): Promise<void>;
    abstract findAll(): Promise<any[]>;
    abstract findById(id: uuid): Promise<any>;
    abstract update(id: uuid, departments: Partial<Departments>): Promise<void>;
    abstract delete(id: uuid): Promise<void>;
}