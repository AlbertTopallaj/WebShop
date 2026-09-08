import {EndpointNotReachable} from "./ErrorClasses.js";
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
        this.cachedCampaigns = []
        this.cacheTimestamp = null
        this.api = "http://localhost:5050/campaign"
        this.errorLog = []
        registerInstance(this)
    }

    #logAndThrow(e) {
        const error = e instanceof Error ? e : new Error(e.toString())
        const log = {
            time: Date.now(),
            error: error
        }
        this.errorLog.push(log)
        throw error
    }

    async #getActiveCampaigns() {
        try {
            const response = await fetch(this.api)
            if (!response.ok) new this.#logAndThrow(EndpointNotReachable(response.status))

            const data = await response.json()

            this.cachedCampaigns = Array.isArray(data) ? data : [data];
            this.cacheTimestamp = Date.now()
            return this.cachedCampaigns;

        } catch (e) {
            new this.#logAndThrow(EndpointNotReachable(e.message))
        }
    }

    #isExpired() {
        return (Date.now() - this.cacheTimestamp) > 30 * 60 * 1000
    }

    async run(values, context) {
        if (this.cachedCampaigns.length === 0 || this.#isExpired()) {
            await this.#getActiveCampaigns()
        }

    }
}

registerModule(Campaign)