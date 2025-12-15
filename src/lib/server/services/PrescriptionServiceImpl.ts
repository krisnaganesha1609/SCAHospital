import type { PrescriptionItems } from "$lib/shared/entities/PrescriptionItems";
import type { uuid } from "$lib/shared/types/type_def";
import type { SupabaseClient } from "@supabase/supabase-js";
import { PrescriptionRepositoryImpl } from "../repositories/PrescriptionRepositoryImpl";
import type { PrescriptionService } from "./interfaces/PrescriptionService";
import { PrescriptionItemsRepositoryImpl } from "../repositories/PrescriptionItemsRepositoryImpl";
import { PharmacyApprovalRepositoryImpl } from "../repositories/PharmacyApprovalRepositoryImpl";
import type { PrescriptionItemsRequest } from "$lib/shared/utils/PrescriptionItems_Request";

export class PrescriptionServiceImpl implements PrescriptionService {
    private prescriptionRepository: PrescriptionRepositoryImpl;
    private prescriptionItemsRepository: PrescriptionItemsRepositoryImpl;
    private pharmacyApprovalRepository: PharmacyApprovalRepositoryImpl;
        constructor(supabase: SupabaseClient) {
            this.prescriptionRepository = new PrescriptionRepositoryImpl(supabase);
            this.prescriptionItemsRepository = new PrescriptionItemsRepositoryImpl(supabase);
            this.pharmacyApprovalRepository = new PharmacyApprovalRepositoryImpl(supabase);
        }
    async issuePrescription(medicalRecordId: uuid, doctorId: uuid, notes: string, medications: PrescriptionItemsRequest[]): Promise<void> {
        console.log("Issuing prescription with medications:", medications);
        let prescriptionPayload: any = {
            medical_record_id: medicalRecordId,
            doctor_id: doctorId,
            status: 'Pending',
            notes: notes,
            total_cost: medications.reduce((sum, item) => sum + item.getSubtotalPrice(), 0)
        }
        const response = await this.prescriptionRepository.createPrescription(prescriptionPayload);
        const prescriptionId = response;
        const itemsPayload = medications.map((item) => ({
            prescription_id: prescriptionId,
            medicine_id: item.getMedicineId(),
            quantity: item.getQuantity(),
            subtotal_price: item.getSubtotalPrice(),
            instructions: item.getInstructions(),
            medicine_name: item.getMedicineName(),
            form: item.getForm(),
            dosage: item.getDosage(),
            frequency: item.getFrequency(),
            duration: item.getDuration(),
            strength: item.getStrength()
        }));
        await this.prescriptionItemsRepository.createPrescriptionItemsBulk(itemsPayload);
        const approvalPayload = {
            prescription_id: prescriptionId,
            pharmacist_id: null,
            status: 'Pending',
            dispensed_at: null,
            notes:'',
        };
        await this.pharmacyApprovalRepository.createPharmacyApproval(approvalPayload);
        return Promise.resolve();
    }
    approvePrescription(id: uuid, pharmacistId: uuid): Promise<void> {
        throw new Error("Method not implemented.");
    }
    rejectPrescription(id: uuid, reason: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    markDispensed(id: uuid): Promise<void> {
        throw new Error("Method not implemented.");
    }
}