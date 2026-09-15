import ShippingCalculator from "./ShippingCalculator/index.js";

export default {
  ShippingCalculator: new ShippingCalculator(),
  ShippingCalculatorDescriptor: ShippingCalculator.descriptor,
};