import type { PrescriptionItems } from "$lib/shared/entities/PrescriptionItems";
import type { uuid } from "$lib/shared/types/type_def";
import type { PrescriptionItemsRequest } from "$lib/shared/utils/PrescriptionItems_Request";

export abstract class PrescriptionService {
    abstract issuePrescription(medicalRecordId: uuid, doctorId: uuid, notes:string,  medications: PrescriptionItemsRequest[]): Promise<void>;
    abstract approvePrescription(id: uuid, pharmacistId: uuid): Promise<void>;
    abstract rejectPrescription(id: uuid, reason: string): Promise<void>;
    abstract markDispensed(id: uuid): Promise<void>;
}
