import type { uuid } from "../types/type_def";
import { Utils } from "../utils/Utils";

export class Departments extends Utils {
    constructor(
        private id: uuid,
        private name: string,
        private description: string,
    ) { super(id); }
    public getId(): uuid {
        return this.id;
    }
    public getName(): string {
        return this.name;
    }
    public getDescription(): string {
        return this.description;
    }

    public toJson(): any {
        return {
            id: this.id,
            name: this.name,
            description: this.description
        };
    }
    public static fromJson(json: any): Departments {
        return new Departments(
            json.id,
            json.name,
            json.description
        );
    }
}