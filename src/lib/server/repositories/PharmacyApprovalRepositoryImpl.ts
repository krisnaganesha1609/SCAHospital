import type { PharmacyApproval } from '$lib/shared/entities';
import { PharmacyApprovalRepository } from './interfaces/PharmacyApprovalRepository';
export class PharmacyApprovalRepositoryImpl extends PharmacyApprovalRepository {
    createPharmacyApproval(pharmacyApproval: Partial<PharmacyApproval>): Promise<void> {
        throw new Error('Method not implemented.');
    }
    findAll(): Promise<any[]> {
        throw new Error('Method not implemented.');
    }
    findById(id: string): Promise<any> {
        throw new Error('Method not implemented.');
    }
    update(id: string, pharmacyApproval: Partial<PharmacyApproval>): Promise<void> {
        throw new Error('Method not implemented.');
    }
    delete(id: string): Promise<void> {
        throw new Error('Method not implemented.');
    }
}