import {CampaignMessage, InvalidCampaignCode} from "./ErrorClasses.js";
import Discount from "./Discount.js";
import {DiscountType} from "./DiscountType.js";

export default class DiscountCodeLogic {

    constructor() {
        this.activeCampaigns = []
    }

    #findCampaign(campaignCode, cachedCampaigns) {
        const campaign = cachedCampaigns.find(
            c => c.code?.trim().toUpperCase() === campaignCode.trim().toUpperCase()
        );

        if (!campaign) throw new InvalidCampaignCode("Invalid campaign code")

        return campaign
    }

    getDiscount(cartItems, campaignCode, cachedCampaigns) {
        const campaign = this.#findCampaign(campaignCode, cachedCampaigns)

        let discountValue

        switch (campaign.type) {
            case DiscountType.BUY_X_PAY_Y: {
                if (this.activeCampaigns.some(entry => entry.campaign.type === campaign.type)) {
                    throw new InvalidCampaignCode("Code with the same type already exists")
                }
                const conditions = campaign.discountCondition
                    .toLowerCase()
                    .split("for")

                const validItems = cartItems
                    .filter(item => item.quantity >= conditions[0].valueOf())
                    .sort((a, b) => b.product.price - a.product.price)

                if (validItems.length === 0) throw new InvalidCampaignCode("Campaign conditions not fulfilled")

                this.activeCampaigns.push({campaign, itemReference: validItems[0].product})
                discountValue =
                    -Math.floor(validItems[0].product.price * conditions[0] *
                        (1 - (conditions[1] / conditions[0])) * 100) / 100

                break
            }
            case DiscountType.THRESHOLD: {
                if (this.activeCampaigns.some(entry => entry.campaign.type === campaign.type)) {
                    throw new InvalidCampaignCode("Code with the same type already exists")
                }

                const conditions = campaign.discountCondition

                const totalPrice = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
                if (totalPrice < conditions.valueOf()) throw new InvalidCampaignCode("Campaign conditions not fulfilled")
                this.activeCampaigns.push({campaign, itemReference: null})
                discountValue = -campaign.discountAmount

                break
            }
            case DiscountType.PERCENTAGE: {
                if (this.activeCampaigns.some(entry => entry.campaign.type === campaign.type)) {
                    throw new InvalidCampaignCode("Code with the same type already exists")
                }
                const cartSum = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
                const conditions = campaign.discountCondition
                if (conditions === null || cartSum >= conditions) {
                    this.activeCampaigns.push({campaign, itemReference: null})
                    discountValue = -Math.round(cartSum * campaign.discountAmount * 100) / 100
                } else throw new InvalidCampaignCode("Campaign conditions not fulfilled")
            }
        }

        if (discountValue) {
            return new Discount(campaign.id, campaignCode, discountValue, "",
                campaign.type, campaign.discountAmount, campaign.discountCondition)
        }
    }

    checkCurrentValidity(cartItems) {
        // If user deletes campaign code from the cart manually
        this.activeCampaigns = this.activeCampaigns.filter(entry => {
                return cartItems.some(item =>
                    item.product instanceof Discount && item.product.name === entry.campaign.code
                )
            }
        );

        for (let i = this.activeCampaigns.length - 1; i >= 0; i--) {
            const { campaign, itemReference } = this.activeCampaigns[i];
            switch (campaign.type) {
                case DiscountType.BUY_X_PAY_Y: {
                    const conditions = campaign.discountCondition
                        .toLowerCase()
                        .split("for")

                    const isValid = cartItems
                        .filter(item => item.product.name === itemReference.name)
                        .filter(item => item.quantity >= conditions[0])

                    console.log("cartItems:", cartItems);
                    console.log("validArray:", isValid);
                    console.log("isValid", isValid.length === 0);

                    if (isValid.length === 0) {
                        const item = cartItems.find(entry => entry.product instanceof Discount &&
                            entry.product.type === DiscountType.BUY_X_PAY_Y);
                        if (item) cartItems.splice(cartItems.indexOf(item), 1);
                        this.activeCampaigns.splice(i, 1);
                        throw new CampaignMessage(`${campaign.code} is no longer valid`)
                    }

                    break;

                }
                case DiscountType.THRESHOLD: {
                    const conditions = campaign.discountCondition

                    const totalPrice = cartItems
                        .filter(entry => !(entry.product instanceof Discount && entry.product.type === DiscountType.THRESHOLD))
                        .reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

                    if (totalPrice < conditions.valueOf()) {
                        const item = cartItems.find(entry => entry.product instanceof Discount &&
                            entry.product.type === DiscountType.THRESHOLD);
                        if (item) cartItems.splice(cartItems.indexOf(item), 1);
                        this.activeCampaigns.splice(i, 1);
                        throw new CampaignMessage(`${campaign.code} is no longer valid`)
                    }
                    break
                }
                case DiscountType.PERCENTAGE: {
                    const discountObject = cartItems.filter(entry => entry.product instanceof Discount &&
                        entry.product.type === DiscountType.PERCENTAGE)[0]?.product
                    if (discountObject) {
                        const cartSum = cartItems
                            .filter(entry => !(entry.product instanceof Discount && entry.product.type === DiscountType.PERCENTAGE))
                            .reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
                        const conditions = discountObject.discountCondition
                        if ((conditions === null && cartSum > 0) || (conditions != null && cartSum >= conditions)) {
                            discountObject.price = -Math.round(cartSum * discountObject.discountAmount * 100) / 100
                        } else {
                            const item = cartItems.find(entry => entry.product instanceof Discount &&
                                entry.product.type === DiscountType.PERCENTAGE);
                            if (item) cartItems.splice(cartItems.indexOf(item), 1);
                            this.activeCampaigns.splice(i, 1);
                            throw new CampaignMessage(`${campaign.code} is no longer valid`)
                        }

                    } // throw
                }
            }
        }
    }
}