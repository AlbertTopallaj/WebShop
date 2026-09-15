export default class Parcel {
  constructor({ weight, length, width, height }) {
    this.weight = weight;
    this.length = length;
    this.width = width;
    this.height = height;
  }

  getVolume() {
    return this.length * this.width * this.height;
  }

  getVolumetricWeight(divisor) {
    return this.getVolume() / divisor;
  }

  getChargeableWeight(divisor) {
    return Math.max(this.weight, this.getVolumetricWeight(divisor));
  }

  toSummary() {
    return {
      weight: this.weight,
      length: this.length,
      width: this.width,
      height: this.height,
      volume: this.getVolume()
    };
  }
}