export default class CurrencyModule {
    static descriptor = {
        name: "Currency",
        inputs: [
            { label: "Price", type: "number" },
            { label: "Standardcurrency", type: "select", options: ["SEK", "EURO", "DOLLAR"]},
            { label: "Targetcurrency", type: "select", options: ["SEK", "EURO", "DOLLAR"]}
        ],
        output: "table"
    };
}