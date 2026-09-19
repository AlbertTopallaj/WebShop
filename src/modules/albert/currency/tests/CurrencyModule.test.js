import CurrencyModule from "../index.js";
import { test, expect } from "vitest";

test("kastar EmptyCartError på tom varukorg", async () => {
    const module = new CurrencyModule();
    await expect(module.run([], "USD")).rejects.toThrow("EmptyCartError");
});