import DiscountCodeLogic from "./DiscountCodeLogic.js";
import Discount from "./Discount.js";
import {CampaignMessage, InvalidCampaignCode} from "./ErrorClasses.js";
import {describe, expect, test} from 'vitest';

describe("Unit tests for happy and unhappy path", () => {
    describe("Happy path!", () => {
        const logic = new DiscountCodeLogic()
        const campaigns = [
            {
                "id": "percent-20",
                "code": "PROCENT20",
                "discountCondition": null,
                "discountAmount": 0.20,
                "type": "percentage"
            },
            {
                "id": "percent-40",
                "code": "PROCENT40",
                "discountCondition": 1000,
                "discountAmount": 0.40,
                "type": "percentage"
            },
            {
                "id": "thresh-100",
                "code": "SPARA100",
                "discountCondition": 500,
                "discountAmount": 100,
                "type": "threshold"
            },
            {
                "id": "b3p2",
                "code": "3FOR2",
                "discountCondition": "3for2",
                "discountAmount": 0.6667,
                "type": "buy_x_pay_y"
            }
        ]

        const cart = [
            {product: {name: "Book", price: 20}, quantity: 3},
            {product: {name: "Laptop", price: 2000}, quantity: 1}
        ]

        test("Non-existing campaign code", () => {
            expect(() => {
                const secondResult = logic.getDiscount(cart, "FREEMONEY", campaigns);
            }).toThrow(InvalidCampaignCode)
        })

        test("BUY_X_PAY_Y discount", () => {

            const result = logic.getDiscount(cart, "3FOR2", campaigns);
            expect(result.price).toBe(-20)
            expect(result).toBeInstanceOf(Discount)
            const cartCopy = structuredClone(cart)

            // Conditional check
            cartCopy[0].quantity = 2
            expect(() => {
                const secondResult = logic.getDiscount(cartCopy, "3FOR2", campaigns);
            }).toThrow(InvalidCampaignCode)

        })

        test("PERCENTAGE discount, unconditioned", () => {

            const result = logic.getDiscount(cart, "PROCENT20", campaigns)
            expect(result.price).toBe(-412)
            expect(result).toBeInstanceOf(Discount)

        })

        test("PERCENTAGE discount, with condition", () => {
            expect(() => {
                const result = logic.getDiscount(cart, "PROCENT40", campaigns)
            }).toThrow(InvalidCampaignCode) // Add second percentage discount error

            logic.activeCampaigns = [] // Clear

            const result = logic.getDiscount(cart, "PROCENT40", campaigns)
            expect(result.price).toBe(-824)
            expect(result).toBeInstanceOf(Discount)

            const cartCopy = structuredClone(cart)
            cartCopy.splice(1, 1) // Lower the cart value
            expect(() => {
                const secondResult = logic.getDiscount(cartCopy, "PROCENT40", campaigns);
            }).toThrow(InvalidCampaignCode)
        })

        test("THRESHOLD discount", () => {
            const result = logic.getDiscount(cart, "SPARA100", campaigns)
            expect(result.price).toBe(-100)
            expect(result).toBeInstanceOf(Discount)
        })


    })


    describe("Unhappy path tests", () => {

        const logic = new DiscountCodeLogic()
        const campaigns = [
            {
                id: "percent-20",
                code: "PROCENT20",
                discountCondition: null,
                discountAmount: 0.20,
                type: "percentage"
            },
            {
                id: "percent-40",
                code: "PROCENT40",
                discountCondition: 1000,
                discountAmount: 0.40,
                type: "percentage"
            },
            {
                id: "thresh-100",
                code: "SPARA100",
                discountCondition: 500,
                discountAmount: 100,
                type: "threshold"
            },
            {
                id: "b3p2",
                code: "3FOR2",
                discountCondition: "3for2",
                discountAmount: 0.6667,
                type: "buy_x_pay_y"
            }
        ]

        test("removes BUY_X_PAY_Y discount from cart when eligible item is completely removed", () => {

            const cart = [
                {product: {name: "Book", price: 20}, quantity: 3},
                {product: {name: "Laptop", price: 2000}, quantity: 1}
            ]

            const discount = logic.getDiscount(cart, "3FOR2", campaigns);
            cart.push({product: discount, quantity: 1});

            cart.splice(0, 1); // Remove book

            expect(() => {
                logic.checkCurrentValidity(cart);
            }).toThrow(CampaignMessage);

            // both the discount item and the activeCampaign record must be cleared
            expect(cart.some(item => item.product instanceof Discount)).toBe(false);
            expect(logic.activeCampaigns).toHaveLength(0);
        })

        test("removes THRESHOLD discount when item price decrease drops total below threshold", () => {

            const cart = [
                {product: {name: "Book", price: 20}, quantity: 3},
                {product: {name: "Laptop", price: 2000}, quantity: 1}
            ]

            const discount = logic.getDiscount(cart, "SPARA100", campaigns)
            cart.push({product: discount, quantity: 1})

            cart.splice(1, 1) // remove laptop

            expect(() => {
                logic.checkCurrentValidity(cart);
            }).toThrow(CampaignMessage);

            expect(cart.some(item => item.product instanceof Discount)).toBe(false);
            expect(logic.activeCampaigns).toHaveLength(0);
        })

        test("removes PERCENTAGE discount when cart sum drops below condition", () => {

            const cart = [
                {product: {name: "Book", price: 20}, quantity: 3},
                {product: {name: "Laptop", price: 2000}, quantity: 1}
            ]

            const discount = logic.getDiscount(cart, "PROCENT40", campaigns)
            cart.push({product: discount, quantity: 1})

            cart.splice(1, 1) // drop laptop again

            expect(() => {
                logic.checkCurrentValidity(cart);
            }).toThrow(CampaignMessage);

            expect(cart.some(item => item.product.name === "PROCENT40")).toBe(false)
            expect(logic.activeCampaigns).toHaveLength(0)
        })

    })
})