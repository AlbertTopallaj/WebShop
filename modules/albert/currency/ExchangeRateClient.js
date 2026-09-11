export class ExchangeRateClient {
    constructor() {
        this.cache = null;
    }

    async getRates() {
        if(this.cache) return this.cache

        const res = await fetch("/api/rates");
        const data = await res.json();

    this.cache = data.rates;
     return this.cache 
    }

    async convert(amount, toCurrency){
        const rates = await this.getRates();
        return amount * rates[toCurrency];
    }
}

