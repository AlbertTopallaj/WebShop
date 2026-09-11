import { ExchangeRateClient } from "./ExchangeRateClient";
import { TaxTable } from "./TaxTable";
import { Money } from "./Money"

export default class CurrencyModule {
    constructor(){
        this.rateClient = new ExchangeRateClient();
        this.taxTable = new TaxTable();
    }

    static descriptor = {
        name: "Currency",
        methodsAndInputs: [
            {
                method: "run",
                input: [
                    {
                        name: "cartItems",
                        type: "reference",
                        label: "Array of items in the cart",
                        required: true

                    },
                    {
                        name: "currency",
                        label: "Currency",
                        type: "select",
                        options: ["USD", "EUR", "SEK"],
                        required: true

                    }
                ],
                output: "Prices converted to the chosen currency"
            }
        
        ]
    };

    async run(cartItems, currency) {
        if(!cartItems | cartItems.length === 0) throw new Error("Kundvagnen är tom")
        const rates = await this.rateClient.getRates();

        return cartItems.map(item => {
            const rate = rates[currency];
            const money = new Money(item.price, "USD");
            const converted = money.convert(currency, rate);
            const taxRate = this.taxTable.getRate(item.category);
            const withTax = converted.addTax(taxRate - 1);

            return {
                name: item.title,
                price: withTax.toString()
            };
        });
        
    }
}