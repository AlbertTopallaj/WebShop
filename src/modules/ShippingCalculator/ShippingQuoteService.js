import Carrier from "./Carrier.js";
console.log("IMPORTED CARRIER:", Carrier);
console.log("CARRIER TYPE:", typeof Carrier);

export default class ShippingQuoteService {
  constructor(moduleInstance) {
    this.module = moduleInstance;
  }

  async _fetchCarriers() {
    const cached = this.module.cache.get("carriers");

    if (cached) {
      return cached;
    }

    //const response = await fetch("/api/carriers");
    const response = await fetch("http://localhost:5050/carriers");

    if (!response.ok) {
      throw new Error(
        "Kunde inte hamta transportorsdata fran /api/carriers."
      );
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error(
        "Ogiltigt svar fran /api/carriers - forvantade en lista."
      );
    }

    this.module.cache.set("carriers", data);

    return data;
  }

  async getQuotesForParcel(parcel, country, postalCode) {
    const carriersData = await this._fetchCarriers();

    const carriers = carriersData.map(
      (c) => new Carrier(c)
    );

    const quotes = [];

    for (const carrier of carriers) {
      try {
        const price = carrier.calculatePrice(
          parcel,
          country
        );

        quotes.push({
          carrierId: carrier.id,
          carrierName: carrier.name,
          country,
          postalCode,
          price,
          product: {
            id: `shipping-${carrier.id}`,
            name: "Frakt",
            price
          }
        });
      } catch (err) {
        quotes.push({
          carrierId: carrier.id,
          carrierName: carrier.name,
          error: true,
          message: err.message
        });
      }
    }

    const ok = quotes
      .filter((q) => !q.error)
      .sort((a, b) => a.price - b.price);

    const failed = quotes.filter((q) => q.error);

    return [...ok, ...failed];
  }
}