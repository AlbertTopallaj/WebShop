export default class CampaignLogic {

    #discountDayIndex = ["Home", "Electronics", "Beauty", "Men", "Women", "Sports", "Vehicles"];


    applyDiscount(rawProductData, campaigns) {

        const dailyIndex = new Date().getDay()
        const dailyDiscounts = campaigns[dailyIndex]

        rawProductData.forEach(product => {
            dailyDiscounts.forEach(discount => {
                if (discount.category === product.category) {
                    product.discountPercentage = `${discount.discountAmount}`
                    product.price = product.price * (1 - discount.discountAmount)
                }
            })
        })
        return this.#discountDayIndex[dailyIndex]
    }
}