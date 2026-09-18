import CurrencyModule from "./albert/currency/index.js";
import ShippingCalculator from "./ShippingCalculator/index.js";

export default {
  ShippingCalculator: new ShippingCalculator(),
  ShippingCalculatorDescriptor: ShippingCalculator.descriptor,
  CurrencyModule: new CurrencyModule(),
  CurrencyModuleDescriptor: CurrencyModule.descriptor,
}