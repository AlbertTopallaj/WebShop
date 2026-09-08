import {registerInstance, registerModule} from "../../scripts/ModuleRegistry.js";

export default class Campaign {
    static descriptor = {
        name: "campaign",
        methodsAndInputs: [
            {
                method: 'run',
                inputs: [
                    {
                        name: "cartItems",
                        type: "reference",
                        label: "Array of items currently in the cart",
                        pattern: undefined,
                        required: false

                    },
                    {
                        name: "campaignCode",
                        type: "text",
                        label: "Discount Code",
                        pattern: undefined,
                        required: true

                    }
                ],
                output: 'a Discount object containing the discount and info'
            }
        ]
    }

    constructor() {

    }



    async run(values, context) {

    }
}

registerModule(Campaign)