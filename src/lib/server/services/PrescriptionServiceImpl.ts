import type { uuid } from "$lib/shared/types/type_def";
import type { SupabaseClient } from "@supabase/supabase-js";
import { PrescriptionRepositoryImpl } from "../repositories/PrescriptionRepositoryImpl";
import type { PrescriptionService } from "./interfaces/PrescriptionService";
import { PrescriptionItemsRepositoryImpl } from "../repositories/PrescriptionItemsRepositoryImpl";
import { PharmacyApprovalRepositoryImpl } from "../repositories/PharmacyApprovalRepositoryImpl";
import type { PrescriptionItemsRequest } from "$lib/shared/utils/PrescriptionItems_Request";
import { PharmacyApproval } from "$lib/shared/entities";

export class PrescriptionServiceImpl implements PrescriptionService {
    private prescriptionRepository: PrescriptionRepositoryImpl;
    private prescriptionItemsRepository: PrescriptionItemsRepositoryImpl;
    private pharmacyApprovalRepository: PharmacyApprovalRepositoryImpl;
    constructor(supabase: SupabaseClient) {
        this.prescriptionRepository = new PrescriptionRepositoryImpl(supabase);
        this.prescriptionItemsRepository = new PrescriptionItemsRepositoryImpl(supabase);
        this.pharmacyApprovalRepository = new PharmacyApprovalRepositoryImpl(supabase);
    }

    async getPharmacyApprovalsList(): Promise<PharmacyApproval[]> {
        const data = await this.pharmacyApprovalRepository.findAll();
        return data.map((item) => PharmacyApproval.fromJson(item));
    }
    async issuePrescription(medicalRecordId: uuid, doctorId: uuid, notes: string, medications: PrescriptionItemsRequest[]): Promise<uuid> {
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
            notes: '',
        };
        await this.pharmacyApprovalRepository.createPharmacyApproval(approvalPayload);
        return Promise.resolve(prescriptionId);
    }
    async approvePrescription(prescription_id: uuid, pharmacy_approval_id: uuid, pharmacist_id: uuid): Promise<void> {
        await this.pharmacyApprovalRepository.update(pharmacy_approval_id, {
            status: 'Partial',
            pharmacist_id: pharmacist_id,
        });
        await this.prescriptionRepository.updatePrescription(prescription_id, {
            status: 'Approved',
            approved_at: new Date(),
        });
        return Promise.resolve();
    }
    async rejectPrescription(prescription_id: uuid, pharmacy_approval_id: uuid, reason: string): Promise<void> {
        await this.pharmacyApprovalRepository.update(pharmacy_approval_id, {
            status: 'Cancelled',
            notes: reason,
        });
        await this.prescriptionRepository.updatePrescription(prescription_id, {
            status: 'Cancelled',
        });
        return Promise.resolve();
    }
    async markDispensed(prescription_id: uuid, pharmacy_approval_id: uuid): Promise<void> {
        await this.pharmacyApprovalRepository.update(pharmacy_approval_id, {
            status: 'Dispensed',
            dispensed_at: new Date(),
            payment_received: true,
        });
        await this.prescriptionRepository.updatePrescription(prescription_id, {
            status: 'Dispensed',
        });
        return Promise.resolve();
    }
}