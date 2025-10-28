import type { PrescriptionItems } from "$lib/shared/entities/PrescriptionItems";
import type { uuid } from "$lib/shared/types/type_def";
import type { PrescriptionService } from "./interfaces/PrescriptionService";

export class PrescriptionServiceImpl implements PrescriptionService {
    issuePrescription(patientId: uuid, doctorId: uuid, medications: PrescriptionItems[]): Promise<void> {
        throw new Error("Method not implemented.");
    }
    approvePrescription(id: uuid): Promise<void> {
        throw new Error("Method not implemented.");
    }
    rejectPrescription(id: uuid, reason: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    markDispensed(id: uuid): Promise<void> {
        throw new Error("Method not implemented.");
    }
}