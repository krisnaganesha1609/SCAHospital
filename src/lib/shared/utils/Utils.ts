import type { uuid } from '../types/type_def';
export interface FromJson<T> {
    fromJson(json: object): T;
}
export abstract class Utils {
    constructor(public id: uuid) {}
    public validate(): boolean {
        if (!this.id) {
            console.error("Validation failed: ID is missing.");
            return false;
        }
        return true;
    }
}

export function toPOJO<T>(value: T): T {
  return JSON.parse(JSON.stringify(value))
}