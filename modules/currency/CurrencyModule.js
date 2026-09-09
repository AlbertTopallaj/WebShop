export default class CurrencyModule {
    static descriptor = {
        name: "Currency",
        methodsAndInputs: [
            {
                method: "run",
                input: [
                    {
                        name: "currency",
                        label: "Currency",
                        type: "select",
                        options: ["USD", "EUR", "SEK"], 

                    }
                ],
                output: "Prices converted to the chosen currency"
            }
        
        ]
    };
}