export default class CurrencyModule {
    static descriptor = {
        name: "Currency",
        methodsAndInputs: [
            {
                method: "run",
                input: [
                    "price - the price of the product, the base currency is USD",
                    "currency - what type of currency is it, can be USD, EUR and SEK",
                    "tax-category - what type of tax-category is the product in"
                ],
                output: "formatted price including tax in selected currency"
            }
        
        ]
    };
}