import Parcel from "./Parcel.js";
import ShippingQuoteService from "./ShippingQuoteService.js";

export default class ShippingCalculator {
  static descriptor = {
    name: "ShippingCalculator",
    methodsAndInputs: [
      {
        method: "run",
        input: [
          {
            key: "country",
            label: "Land",
            type: "select",
            required: true,
            options: [
              "Sweden",
              "Norway",
              "Finland",
              "Denmark",
              "Germany",
              "USA"
            ]
          },
          {
            key: "postal_code",
            label: "Postnummer",
            type: "text",
            required: true,
            pattern: "^[A-Za-z0-9\\s-]{3,10}$"
          }
        ],
        output: "List"
      }
    ],
    ownedApiEndpoints: ["/api/carriers"],
    readsFromApiEndpoints: ["/api/carriers"]
  };

  constructor() {
    this.cache = new Map();
    this.history = [];
  }

  _validateInput(values) {
    const { country, postal_code } = values || {};

    if (!country) throw new Error("Land saknas.");
    if (!postal_code) throw new Error("Postnummer saknas.");

    const allowed = [
      "Sweden",
      "Norway",
      "Finland",
      "Denmark",
      "Germany",
      "USA"
    ];

    if (!allowed.includes(country)) {
      throw new Error(`Ogiltigt land: ${country}`);
    }

    const pattern = /^[A-Za-z0-9\s-]{3,10}$/;
    if (!pattern.test(postal_code)) {
      throw new Error("Ogiltigt postnummerformat.");
    }

    return { country, postal_code };
  }

  _createParcelFromContext(context) {
    if (!context || !Array.isArray(context.cartItems)) {
      throw new Error("context.cartItems saknas – modulen kräver en varukorg.");
    }

    const cart = context.cartItems;
    console.log("CART SOM SKICKAS TILL SHIPPING:", cart);

    let totalWeight = 0;
    let totalVolume = 0;

    for (const item of cart) {
      const { product, quantity } = item;

      if (!product) throw new Error("Varukorgsobjekt saknar product-fält.");

      const { weight, dimensions } = product;
      console.log("PRODUCT:", product);
      console.log("WEIGHT:", weight);
      console.log("DIMENSIONS:", dimensions);
      const qty = quantity || 1;

      if (typeof weight !== "number") {
        throw new Error(`Produkten '${product.name}' saknar giltig vikt.`);
      }

      if (
        !dimensions ||
        typeof dimensions.width !== "number" ||
        typeof dimensions.height !== "number" ||
        typeof dimensions.depth !== "number"
      ) {
        throw new Error(
          `Produkten '${product.name}' saknar giltiga mått (width/height/depth).`
        );
      }

      totalWeight += weight * qty;

      const volume = dimensions.width * dimensions.height * dimensions.depth;
      totalVolume += volume * qty;
    }

    const cubeRoot = Math.cbrt(totalVolume);

    return new Parcel({
      weight: totalWeight,
      length: cubeRoot,
      width: cubeRoot,
      height: cubeRoot
    });
  }

  async run(values, context = {}) {
    try {
      const { country, postal_code } = this._validateInput(values);
      const parcel = this._createParcelFromContext(context);

      const service = new ShippingQuoteService(this);
      const quotes = await service.getQuotesForParcel(parcel, country, postal_code);

      this.history.push({
        timestamp: new Date().toISOString(),
        country,
        postal_code,
        parcel: parcel.toSummary(),
        quotes
      });

      return quotes;
    } catch (err) {
      return [
        {
          error: true,
          message: err.message || "Ett okänt fel uppstod i ShippingCalculator."
        }
      ];
    }
  }
}