const TAX_RATES = {
    groceries: 1.12,
    shipping: 1.00,
    campaign: 1.00,
    undefined: 1.00
}

export class TaxTable {
    getRate(category) {
        return TAX_RATES[category] ?? 1.25;
    }
}




