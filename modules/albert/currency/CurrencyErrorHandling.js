export class CurrencyError extends Error {
    constructor(message) {
        super(message);
        this.name = "CurrencyError";
    }
}