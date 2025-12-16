import type { uuid } from "../types/type_def";

export class MedicineRequest {
    constructor(
        private code: string,
        private name: string,
        private form: string,
        private strength: string,
        private manufacturer: string,
        private stockQty: number,
        private unitPrice: number
    ) {}

    public getCode(): string {
        return this.code;
    }
    public getName(): string {
        return this.name;
    }
    public getForm(): uuid {
        return this.form;
    }
    public getStrength(): string {
        return this.strength;
    }
    public getManufacturer(): string {
        return this.manufacturer;
    }
    public getStockQty(): number {
        return this.stockQty;
    }
    public getUnitPrice(): number {
        return this.unitPrice;
    }
    public toJson(): any {
        return {
            code: this.code,
            name: this.name,
            form: this.form,
            strength: this.strength,
            manufacturer: this.manufacturer,
            stock_qty: this.stockQty,
            unit_price: this.unitPrice,
        };
    }

    public static fromJson(json: any): MedicineRequest {
        return new MedicineRequest(
            json.code,
            json.name,
            json.form,
            json.strength,
            json.manufacturer,
            json.stock_qty,
            json.unit_price,
        );
    }
    
    public static fromPOJO(obj: any): MedicineRequest {
        return new MedicineRequest(
            obj.code,
            obj.name,
            obj.form,
            obj.strength,
            obj.manufacturer,
            obj.stockQty,
            obj.unitPrice,
        );
    }
}