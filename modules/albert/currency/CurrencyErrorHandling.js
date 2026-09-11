export class CurrencyError extends Error {
    constructor(message) {
        super(message);
        this.name = "CurrencyError";
    }
}
    export class UnknownCurrencyError extends CurrencyError {
        constructor(currency) {
            super(`Okänd valuta "${currency}". Tillåtna valutor är USD, EUR och SEK`);
            this.name = "UnknownCurrencyError";
        }
    }
}