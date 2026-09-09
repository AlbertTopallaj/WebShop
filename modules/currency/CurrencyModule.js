export default class CurrencyModule {
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
}