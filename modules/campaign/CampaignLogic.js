export default class CampaignLogic {

    applyDiscount(rawProductData, campaigns) {

        //const dailyIndex = new Date().getDay()
        const dailyIndex = 2
        const dailyDiscounts = campaigns[dailyIndex]

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