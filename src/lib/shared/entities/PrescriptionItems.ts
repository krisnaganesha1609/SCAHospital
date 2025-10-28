import type { uuid } from "../types/type_def";
import { Prescription } from "./Prescription";
import { Medicine } from "./Medicine";
import { Utils } from "../utils/Utils";

export class PrescriptionItems extends Utils {
    
    constructor(
        id: uuid,
        private prescription: Prescription,
        private medicine: Medicine,
        private medicineName: string,
        private strength: string,
        private form: string,
        private dosage: string,
        private frequency: string,
        private duration: string,
        private quantity: number,
        private instructions: string,
        private unitPrice: number,
        private createdAt: Date
    ) {super(id);}

    public getId(): uuid {
        return this.id;
    }
    public getPrescription(): Prescription {
        return this.prescription;
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
    public getUnitPrice(): number {
        return this.unitPrice;
    }
    public getCreatedAt(): Date {
        return this.createdAt;
    }

    public toJson(): any { 
        return {
            id: this.id,
            prescription: this.prescription,
            medicine: this.medicine,
            medicineName: this.medicineName,
            strength: this.strength,
            form: this.form,
            dosage: this.dosage,
            frequency: this.frequency,
            duration: this.duration,
            quantity: this.quantity,
            instructions: this.instructions,
            unitPrice: this.unitPrice,
            createdAt: this.createdAt
        };
    }

    public static fromJson(json: any): PrescriptionItems {
        return new PrescriptionItems(
            json.id,
            Prescription.fromJson(json.prescription),
            Medicine.fromJson(json.medicine),
            json.medicineName,
            json.strength,
            json.form,
            json.dosage,
            json.frequency,
            json.duration,
            json.quantity,
            json.instructions,
            json.unitPrice,
            json.createdAt
        );
    }
}