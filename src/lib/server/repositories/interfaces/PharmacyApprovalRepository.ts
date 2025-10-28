import type { PharmacyApproval } from "$lib/shared/entities/PharmacyApproval";

export abstract class PharmacyApprovalRepository {
    abstract createPharmacyApproval(pharmacyApproval: Partial<PharmacyApproval>): Promise<void>;
    abstract findAll(): Promise<any[]>;
    abstract findById(id: string): Promise<any>;
    abstract update(id: string, pharmacyApproval: Partial<PharmacyApproval>): Promise<void>;
    abstract delete(id: string): Promise<void>;
}
