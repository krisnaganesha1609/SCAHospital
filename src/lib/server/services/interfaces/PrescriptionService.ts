import type { uuid } from "$lib/shared/types/type_def";
import type { PrescriptionItemsRequest } from "$lib/shared/utils/PrescriptionItems_Request";

export abstract class PrescriptionService {
    abstract issuePrescription(medicalRecordId: uuid, doctorId: uuid, notes:string,  medications: PrescriptionItemsRequest[]): Promise<void>;
    abstract approvePrescription(prescription_id: uuid, pharmacy_approval_id: uuid, pharmacistId: uuid): Promise<void>;
    abstract rejectPrescription(prescription_id: uuid, pharmacy_approval_id: uuid, reason: string): Promise<void>;
    abstract markDispensed(prescription_id: uuid, pharmacy_approval_id: uuid): Promise<void>;
}
