export default class CampaignLogic {

    #dailyDiscounts = [
        [
            { category: "groceries", discountAmount: 0.10 },
            { category: "home-decoration", discountAmount: 0.25 },
            { category: "furniture", discountAmount: 0.20 }
        ],
        [
            { category: "laptops", discountAmount: 0.10 },
            { category: "smartphones", discountAmount: 0.10 },
            { category: "tablets", discountAmount: 0.15 },
            { category: "mobile-accessories", discountAmount: 0.30 }
        ],
        [
            { category: "beauty", discountAmount: 0.20 },
            { category: "skin-care", discountAmount: 0.20 },
            { category: "fragrances", discountAmount: 0.15 }
        ],
        [
            { category: "mens-shirts", discountAmount: 0.25 },
            { category: "mens-shoes", discountAmount: 0.20 },
            { category: "mens-watches", discountAmount: 0.15 },
            { category: "sunglasses", discountAmount: 0.25 }
        ],
        [
            { category: "womens-dresses", discountAmount: 0.25 },
            { category: "tops", discountAmount: 0.25 },
            { category: "womens-shoes", discountAmount: 0.20 },
            { category: "womens-bags", discountAmount: 0.20 }
        ],
        [
            { category: "womens-jewellery", discountAmount: 0.15 },
            { category: "womens-watches", discountAmount: 0.15 },
            { category: "sports-accessories", discountAmount: 0.20 }
        ],
        [
            { category: "vehicle", discountAmount: 0.05 },
            { category: "motorcycle", discountAmount: 0.05 },
            { category: "kitchen-accessories", discountAmount: 0.20 }
        ]
    ];

    applyDiscount(rawProductData) {

        //const dailyIndex = new Date().getDay()
        const dailyIndex = 2
        const dailyDiscounts = this.#dailyDiscounts[dailyIndex]

        rawProductData.forEach(product => {
            dailyDiscounts.forEach(discount => {
                if (discount.category === product.category) {
                    product.discountPercentage = `${discount.discountAmount}`
                    product.price = product.price * (1 - discount.discountAmount)
                }
            })
        })
    }
}