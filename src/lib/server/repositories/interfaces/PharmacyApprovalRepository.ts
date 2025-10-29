import type { PharmacyApproval } from "$lib/shared/entities/PharmacyApproval";
import type { uuid } from "$lib/shared/types/type_def";

export abstract class PharmacyApprovalRepository {
    abstract createPharmacyApproval(pharmacyApproval: Partial<PharmacyApproval>): Promise<void>;
    abstract findAll(): Promise<any[]>;
    abstract findById(id: uuid): Promise<any>;
    abstract update(id: uuid, pharmacyApproval: Partial<PharmacyApproval>): Promise<void>;
    abstract delete(id: uuid): Promise<void>;
}
