import type { uuid } from "../types/type_def";
import { Utils } from "../utils/Utils";

export class Medicine extends Utils {
    constructor(
        id: uuid,
        private code: string,
        private name: string,
        private form: string,
        private strength: string,
        private manufacturer: string,
        private stockQty: number,
        private unitPrice: number,
        private createdAt: Date
    ) {super(id);}

    public getId(): uuid {
        return this.id;
    }
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
    public getCreatedAt(): Date {
        return this.createdAt;
    }
    public toJson(): any {
        return {
            id: this.id,
            code: this.code,
            name: this.name,
            form: this.form,
            strength: this.strength,
            manufacturer: this.manufacturer,
            stock_qty: this.stockQty,
            unit_price: this.unitPrice,
        };
    }

    public static fromJson(json: any): Medicine {
        return new Medicine(
            json.id,
            json.code,
            json.name,
            json.form,
            json.strength,
            json.manufacturer,
            json.stock_qty,
            json.unit_price,
            json.created_at
        );
    }
    
    public static fromPOJO(obj: any): Medicine {
        return new Medicine(
            obj.id,
            obj.code,
            obj.name,
            obj.form,
            obj.strength,
            obj.manufacturer,
            obj.stockQty,
            obj.unitPrice,
            obj.createdAt
        );
    }
}