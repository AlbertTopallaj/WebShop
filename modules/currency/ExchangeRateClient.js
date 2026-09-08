export default class ExchangeRateClient {
    constructor() {
        this.cache = null;
    }

    async getRates() {
        if(this.cache) return this.cache;
        this.cache = {
        USD: 1, // Base currency
        SEK: 10.45,
        EUR: 0.92
    };
    return this.cache 
    }

    async convert(amount, toCurrency){
        const rates = await this.getRates();
        return amount * rates[toCurrency];
    }
}

