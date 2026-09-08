export default class ExchangeRateClient {
    constructor() {
        this.cache = null;
    }

    async getRates() {
        if(this.cache) return this.cache;
        this.cache = {
        USD: 1, // Base currency
        SEK: 0.92,
        EUR: 10.45
    };
    return this.cache 
 }
}

