import type { uuid } from '../types/type_def';
export interface FromJson<T> {
    fromJson(json: object): T;
}
export abstract class Utils {
    constructor(public modelId: uuid) {}
    public validate(): boolean {
        if (!this.modelId) {
            console.error("Validation failed: Model ID is missing.");
            return false;
        }
        return true;
    }
}