import {CampaignErrors, CampaignMessage, EndpointNotReachable} from "./ErrorClasses.js";
import {registerInstance, registerModule} from "../../scripts/ModuleRegistry.js";
import DiscountCodeLogic from "./DiscountCodeLogic.js";
import CampaignLogic from "./CampaignLogic.js";

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
                        label: "Array of items",
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
                output: 'reference mutation'
            }
        ]
    }

    constructor() {
        this.cachedCampaigns = []
        this.cacheTimestamp = null
        this.api = "http://localhost:5050/campaign"
        this.errorLog = []
        registerInstance(this)
        this.discountLogic = new DiscountCodeLogic()
        this.campaignLogic = new CampaignLogic()
    }

    #logAndThrow(e) {
        const error = e instanceof Error ? e : new Error(e.toString())
        const log = {
            time: Date.now(),
            error: error
        }
        this.errorLog.push(log)
        if (error instanceof CampaignErrors) throw error
        if (e.isMessage) throw e
        throw new CampaignErrors("Something went wrong, try again later")
    }

    async #getActiveCampaigns() {
        try {
            const response = await fetch(this.api)
            if (!response.ok) this.#logAndThrow(new EndpointNotReachable(response.status))

            const data = await response.json()

            this.cachedCampaigns = Array.isArray(data) ? data : [data];
            this.cacheTimestamp = Date.now()
            return this.cachedCampaigns;

        } catch (e) {
            new this.#logAndThrow(new EndpointNotReachable(e.message))
        }
    }

    #isExpired() {
        return (Date.now() - this.cacheTimestamp) > 30 * 60 * 1000
    }


    async run(context, campaignCode) {
        if (!Array.isArray(context)) this.#logAndThrow(Error("Incorrect module input type"))

        if (context.length === 0) return // noop

        const isCart = 'product' in context[0]

        if (!campaignCode && isCart) {
            try {
                this.discountLogic.checkCurrentValidity(context)
                return
            } catch (e) {
                this.#logAndThrow(e)
            }

        }
        if (this.cachedCampaigns.length === 0 || this.#isExpired()) {
            await this.#getActiveCampaigns()
        }

        if (isCart) {
            // Discount code pipe
            try {
                const discount = this.discountLogic.getDiscount(context, campaignCode, this.cachedCampaigns)
                context.push({product: discount, quantity: 1})
                this.#logAndThrow(new CampaignMessage(`${discount.name} successfully added`))
            } catch (e) {
                this.#logAndThrow(e)
            }
        } else if (!isCart && !campaignCode){
            // Campaign pipe
            try {
                this.campaignLogic.applyDiscount(context)
            } catch (e) {
                this.#logAndThrow(e)
            }
        }
    }
}

registerModule(Campaign)