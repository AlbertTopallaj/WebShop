export default class PricingModels {
  static weightOrVolumetric({ carrierData, parcel, country }) {
    const zone = carrierData.zones[country];

    if (!zone) {
      throw new Error(
        `Transportören ${carrierData.name} saknar zon för ${country}.`
      );
    }

    const base = carrierData.baseRates[zone];
    const perKg = carrierData.perKgRate[zone];

    if (typeof base !== "number" || typeof perKg !== "number") {
      throw new Error(
        `Transportören ${carrierData.name} saknar prisdata för zon ${zone}.`
      );
    }

    const divisor = carrierData.volumetricDivisor;
    const chargeableWeight = parcel.getChargeableWeight(divisor);

    return {
      price: base + perKg * chargeableWeight,
      chargeableWeight,
      zone
    };
  }
}