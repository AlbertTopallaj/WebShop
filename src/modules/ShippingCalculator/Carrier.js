import PricingModels from "./PricingModels.js";

export default class Carrier {
  constructor(rawData) {
    this.id = rawData.id;
    this.name = rawData.name;
    this.pricingModel = rawData.pricingModel;
    this.data = rawData;
  }

  calculatePrice(parcel, country) {
    switch (this.pricingModel) {
      case "weight_or_volumetric":
        return PricingModels.weightOrVolumetric({
          carrierData: this.data,
          parcel,
          country
        }).price;

      default:
        throw new Error(`Okänd prismodell: ${this.pricingModel}`);
    }
  }
}