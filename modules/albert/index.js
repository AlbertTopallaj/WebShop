import { ExchangeRateClient } from "./currency/ExchangeRateClient";
import { TaxTable } from "./currency/TaxTable";

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
        
    }
}