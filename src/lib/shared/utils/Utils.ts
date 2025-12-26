import type { uuid } from '../types/type_def';
export interface FromJson<T> {
    fromJson(json: object): T;
}
export abstract class Utils {
    constructor(public id: uuid) { }
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

export const includeIfNotEmpty = <T>(key: string, value?: T) =>
    value !== undefined && value !== '' ? { [key]: value } : {};

export function generateSCAMedRec(): string {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const digits = '0123456789';

    let result = 'SCA-';

    for (let i = 0; i < 10; i++) {
        result += digits[Math.floor(Math.random() * digits.length)];

        if ((i + 1) % 2 === 0 && i !== 9) {
            result += letters[Math.floor(Math.random() * letters.length)];
        }
    }

    return result;
}

export function generateMedicineCode(): string {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const digits = '0123456789';
    let result = 'MED-';

    for (let i = 0; i < 7; i++) {
        result += digits[Math.floor(Math.random() * digits.length)];
        
        if (i === 2 || i === 4) {
            result += letters[Math.floor(Math.random() * letters.length)];
        }
    }

    return result;
}