import type { uuid } from "../types/type_def";

export class Departments {
    constructor(
        public id: uuid,
        public name: string,
        public description: string,
    ) {}
}