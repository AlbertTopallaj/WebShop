import {CampaignErrors, EndpointNotReachable} from "./ErrorClasses.js";
import {registerModule} from "../../scripts/ModuleRegistry.js";
import DiscountCodeLogic from "./DiscountCodeLogic.js";
import CampaignLogic from "./CampaignLogic.js";
import DTO from "./DTO.js";
import Product from "../../components/ProductCard/Product.js";

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
                        pattern: "^[a-zA-Z0-9]{4,10}$",
                        transform: "uppercase",
                        required: true

                    }
                ],
                output: 'returns a DTO {context, message} containing a mutated collection and a message'
            }
        ]
    }

    static instance

    constructor() {
        if (!Campaign.instance) {
            Campaign.instance = this
        } else return // or throw
        this.cachedCampaigns = []
        this.cacheTimestamp = null
        this.api = "http://localhost:5050/campaign"
        this.errorLog = []
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
        throw new CampaignErrors("Something went wrong, try again later")
    }

    async #getActiveCampaigns() {
        try {
            const response = await fetch(this.api)
            if (!response.ok) this.#logAndThrow(new EndpointNotReachable(response.status))

            const data = await response.json()

            this.cachedCampaigns = {
                campaignCodes: data?.campaignCodes ?? [],
                campaigns: data?.campaigns ?? []
            }
            this.cacheTimestamp = Date.now()
            return this.cachedCampaigns

        } catch (e) {
            new this.#logAndThrow(new EndpointNotReachable(e.message))
        }
    }

    #isExpired() {
        return (Date.now() - this.cacheTimestamp) > 30 * 60 * 1000
    }

    #copy(original) {
        return original.map(item => ({
            ...item,
            product: Object.assign(
                Object.create(Object.getPrototypeOf(item.product)),
                item.product
            ),
        }));
    }


    async run(context, campaignCode) {
        if (!Array.isArray(context)) this.#logAndThrow(Error("Incorrect module input type"))

        if (context.length === 0) return new DTO() // noop

        const isCart = context[0]?.product instanceof Product

        if (!campaignCode && isCart) {
            try {
                const cartItems = this.#copy(context)
                const message = this.discountLogic.checkCurrentValidity(cartItems)
                return new DTO(cartItems, message)
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
                const cartItems = this.#copy(context)
                campaignCode = campaignCode ? campaignCode.toUpperCase() : undefined
                const discount = this.discountLogic.getDiscount(cartItems, campaignCode, this.cachedCampaigns.campaignCodes)
                cartItems.push({product: discount, quantity: 1})
                return new DTO(cartItems, `${discount.name} successfully added`)
            } catch (e) {
                this.#logAndThrow(e)
            }
        } else if (!isCart && !campaignCode){
            // Campaign pipe
            try {
                const rawData = structuredClone(context)
                this.campaignLogic.applyDiscount(rawData, this.cachedCampaigns.campaigns)
                return new DTO(rawData, "")
            } catch (e) {
                this.#logAndThrow(e)
            }
        }
    }
}

registerModule(Campaign)