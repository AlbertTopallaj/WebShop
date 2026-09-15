const TAX_RATES = {
    groceries: 1.12,
}

export class TaxTable {
    getRate(category) {
        return TAX_RATES[category] ?? 1.25;
    }
}




