import { RateFetchError } from "./CurrencyErrorHandling";

export class ExchangeRateClient {
    constructor() {
        this.cache = null;
    }

    async getRates() {
        if(this.cache) return this.cache

        const res = await fetch("http://localhost:5050/rates");
        if(!res.ok) {
            throw new RateFetchError();
        }

        const data = await res.json();
        this.baseCurrency = data.base;
        this.cache = data.rates;
        return this.cache 
    }

    async convert(amount, toCurrency){
        const rates = await this.getRates();
        return amount * rates[toCurrency];
    }
}

