export default class CurrencyModule {
    static descriptor = {
        name: "Currency",
        methodsAndInputs: [
            {
                method: "run",
                input: [
                    "currency - what type of currency is it, can be USD, EUR and SEK"
                ],
                output: "formaterat pris baserat på ursprungsvalutan"
            }
        ]
    };
}