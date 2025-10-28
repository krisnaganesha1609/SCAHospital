import { Medicine } from '../../shared/entities/Medicine';
import type { MedicineRepository } from './interfaces/MedicineRepository';
export class MedicineRepositoryImpl extends Medicine implements MedicineRepository {
    createMedicine(data: Partial<Medicine>): Promise<any> {
        throw new Error('Method not implemented.');
    }
    getMedicineById(id: string): Promise<any> {
        throw new Error('Method not implemented.');
    }
    updateMedicine(id: string, data: Partial<Medicine>): Promise<any> {
        throw new Error('Method not implemented.');
    }
    deleteMedicine(id: string): Promise<void> {
        throw new Error('Method not implemented.');
    }
    listMedicines(filter?: any): Promise<any[]> {
        throw new Error('Method not implemented.');
    }
}