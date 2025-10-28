import type { uuid } from "../types/type_def";

export class Medicine {
    constructor(
        public id: uuid,
        public code: string,
        public name: string,
        public form: String,
        public strength: string,
        public manufacturer: string,
        public stockQty: number,
        public unitPrice: number,
        public createdAt: Date
    ) {}
}