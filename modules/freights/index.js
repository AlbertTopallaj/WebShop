import {registerModule} from "../../scripts/ModuleRegistry.js";

export default class Freights {
    static descriptor = {
        name: "ShippingCalculator",
        methodsAndInputs: [
            {
                method: "run",
                inputs: [
                    {
                        name: "country",
                        label: "Land",
                        type: "select",
                        required: true,
                        options: [
                            "Sweden",
                            "Norway",
                            "Finland",
                            "Denmark",
                            "Germany",
                            "USA"
                        ]
                    },
                    {
                        name: "postal_code",
                        label: "Postnummer",
                        type: "text",
                        required: true,
                        pattern: "^[A-Za-z0-9\\s\\-]{3,10}$"
                    }
                ],
                output: "List"
            }
        ],
        ownedApiEndpoints: [
            "/api/carriers"
        ],
        readsFromApiEndpoints: [
            "/api/carriers"
        ]
    }

    run() {

    }
}

registerModule(Freights)