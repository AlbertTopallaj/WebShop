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

export class EmptyCartError extends CurrencyError {
    constructor() {
        super("Kundvagnen är tom - inga priser att konvertera");
        this.name = "EmptyCartError";
    }
}

export class RateFetchError extends CurrencyError {
    constructor() {
        super("Kunde inte hämta valutakurser från API:t");
        this.name = "RateFetchError";
    }
}
