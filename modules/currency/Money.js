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
        return this.#currency;
    }
    
    convert(targetCurrency, rate) {
        const newAmount = this.#amount * rate;
        return new Money(newAmount, targetCurrency);
    }

    toString() {
        return `${this.amount.toFixed(2)} ${this.currency}`;
    }

    addTax(rate) {
        return new Money(this.amount * (1 + rate ), this.currency);
    }
}