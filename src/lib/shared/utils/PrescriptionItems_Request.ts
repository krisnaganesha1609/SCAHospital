import type { uuid } from "../types/type_def";
import { Medicine } from "../entities/Medicine";

export class PrescriptionItemsRequest {
    
    constructor(
        private medicineId: uuid,
        private medicineName: string,
        private strength: string,
        private form: string,
        private dosage: string,
        private frequency: string,
        private duration: string,
        private quantity: number,
        private instructions: string,
        private subtotalPrice: number,
    ) {}

    public getMedicineId(): uuid {
        return this.medicineId;
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

    public toJson(): any { 
        return {
            medicine_id: this.medicineId,
            medicine_name: this.medicineName,
            strength: this.strength,
            form: this.form,
            dosage: this.dosage,
            frequency: this.frequency,
            duration: this.duration,
            quantity: this.quantity,
            instructions: this.instructions,
            subtotal_price: this.subtotalPrice,
        };
    }

    public static fromJson(json: any): PrescriptionItemsRequest {
        return new PrescriptionItemsRequest(
            json.medicine_id,
            json.medicine_name,
            json.strength,
            json.form,
            json.dosage,
            json.frequency,
            json.duration,
            json.quantity,
            json.instructions,
            json.subtotal_price,
        );
    }

    public static fromPOJO(obj: any): PrescriptionItemsRequest {
        return new PrescriptionItemsRequest(
            obj.medicineId,
            obj.medicineName,
            obj.strength,
            obj.form,
            obj.dosage,
            obj.frequency,
            obj.duration,
            obj.quantity,
            obj.instructions,
            obj.subtotalPrice,
        );
    }
}