export default class Money {
    #amount
    #currency

    constructor(amount, currency){
        this.#amount = amount;
        this.#currency = currency;
    }

    get amount() {
        return this.#amount;
    }

    get currency() {
        return this.currency;
    }
    
    convert(targetCurrency, rate) {
        const newAmount = this.#amount * rate;
        return new Money(newAmount, targetCurrency);
    }
}