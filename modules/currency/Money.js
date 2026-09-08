export default class Money {
    constructor(amount, currency) {
        this.amount = amount
        this.currency = currency
    }

    toString() {
        return `${this.amount.toFixed(2)} ${this.currency}`;
    }

    addTax(rate) {
        return new Money(this.amount * (1 + rate ), this.currency);
    }
}