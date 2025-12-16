import type { pharmacyApprovalStatus, uuid } from "../types/type_def";
import { Utils } from "../utils/Utils";
import { Prescription } from "./Prescription";
import { User } from "./User";

export class PharmacyApproval extends Utils {
    constructor(
        id: uuid,
        private prescription: Prescription,
        private pharmacist: User,
        private dispensedAt: Date,
        private status: pharmacyApprovalStatus,
        private notes: string,
        private paymentReceived: boolean
    ) { super(id); }
    public getId(): uuid {
        return this.id;
    }
    public getPrescription(): Prescription {
        return this.prescription;
    }
    public getPharmacist(): User {
        return this.pharmacist;
    }
    public getDispensedAt(): Date {
        return this.dispensedAt;
    }
    public getStatus(): string {
        return this.status;
    }
    public getNotes(): string {
        return this.notes;
    }
    public getPaymentReceived(): boolean {
        return this.paymentReceived;
    }
    public toJson(): any {
        return {
            id: this.id,
            prescription: this.prescription,
            pharmacist: this.pharmacist,
            dispensedAt: this.dispensedAt,
            status: this.status,
            notes: this.notes,
            paymentReceived: this.paymentReceived
        };
    }
    public static fromJson(json: any): PharmacyApproval {
        return new PharmacyApproval(
            json.id,
            Prescription.fromJson(json.prescription),
            User.fromJson(json.pharmacist),
            json.dispensed_at,
            json.status,
            json.notes,
            json.payment_received
        );
    }
    public static fromPOJO(obj: any): PharmacyApproval {
        return new PharmacyApproval(
            obj.id,
            Prescription.fromPOJO(obj.prescription),
            User.fromPOJO(obj.pharmacist),
            obj.dispensedAt,
            obj.status,
            obj.notes,
            obj.paymentReceived
        );
    }
}
