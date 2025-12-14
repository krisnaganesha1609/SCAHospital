import type { uuid } from "../types/type_def";
import { Medicine } from "./Medicine";
import { Utils } from "../utils/Utils";

export class PrescriptionItems extends Utils {
    
    constructor(
        id: uuid,
        private prescriptionId: uuid,
        private medicineId: uuid,
        private medicine: Medicine,
        private medicineName: string,
        private strength: string,
        private form: string,
        private dosage: string,
        private frequency: string,
        private duration: string,
        private quantity: number,
        private instructions: string,
        private subtotalPrice: number,
        private createdAt: Date
    ) {super(id);}

    public getId(): uuid {
        return this.id;
    }
    public getPrescriptionId(): uuid {
        return this.prescriptionId;
    }
    public getMedicineId(): uuid {
        return this.medicineId;
    }
    public getMedicine(): Medicine {
        return this.medicine;
    }
    public getMedicineName(): string {
        return this.medicineName;
    }
    public getStrength(): string {
        return this.strength;
    }
    public getForm(): string {
        return this.form;
    }
    public getDosage(): string {
        return this.dosage;
    }
    public getFrequency(): string {
        return this.frequency;
    }
    public getDuration(): string {
        return this.duration;
    }
    public getQuantity(): number {
        return this.quantity;
    }
    public getInstructions(): string {
        return this.instructions;
    }
    public getSubtotalPrice(): number {
        return this.subtotalPrice;
    }
    public getCreatedAt(): Date {
        return this.createdAt;
    }

    public toJson(): any { 
        return {
            id: this.id,
            prescription_id: this.prescriptionId,
            medicine_id: this.medicineId,
            medicine: this.medicine,
            medicine_name: this.medicineName,
            strength: this.strength,
            form: this.form,
            dosage: this.dosage,
            frequency: this.frequency,
            duration: this.duration,
            quantity: this.quantity,
            instructions: this.instructions,
            subtotal_price: this.subtotalPrice,
            created_at: this.createdAt
        };
    }

    public static fromJson(json: any): PrescriptionItems {
        return new PrescriptionItems(
            json.id,
            json.prescription_id,
            json.medicine_id,
            Medicine.fromJson(json.medicine),
            json.medicine_name,
            json.strength,
            json.form,
            json.dosage,
            json.frequency,
            json.duration,
            json.quantity,
            json.instructions,
            json.subtotal_price,
            json.created_at
        );
    }

    public static fromPOJO(obj: any): PrescriptionItems {
        return new PrescriptionItems(
            obj.id,
            obj.prescriptionId,
            obj.medicineId,
            Medicine.fromPOJO(obj.medicine),
            obj.medicineName,
            obj.strength,
            obj.form,
            obj.dosage,
            obj.frequency,
            obj.duration,
            obj.quantity,
            obj.instructions,
            obj.subtotalPrice,
            obj.createdAt
        );
    }
}