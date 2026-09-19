    import CurrencyModule from "../index.js";
    import { test, expect } from "vitest";
    import { Money } from "../Money.js"

    test("kastar EmptyCartError på tom varukorg", async () => {
        const module = new CurrencyModule();
        await expect(module.run([], "USD")).rejects.toThrow("Kundvagnen är tom");
    });

    test("kastar UnknownCurrencyError på ogiltig valuta", async () => {
        const module = new CurrencyModule();
        await expect(module.run([{ price: 100, category: "default" }], "JPY")).rejects.toThrow("JPY");
    });

    test("konverterar pris korrekt till SEK", async () => {
        const module = new CurrencyModule();
        const result = await module.run([{ price: 100, category: "default"}], "SEK");
        expect(result.items[0].amount).toBeGreaterThan(0);
        expect(result.total).toContain("SEK");
    });

    test("toString formaterar korrekt i Money.js", () => {
        const money = new Money(100, "SEK");
        expect(money.toString()).toBe("100.00 SEK");
    });

    test("convert returnerar ett nytt Money-objekt, detta för att undvika valutablandning", () => {
        const money = new Money(100, "SEK");
        const converted = money.convert("USD", 0.1);
        expect(money.currency).toBe("SEK");
        expect(converted.currency).toBe("USD");
    });

    test("addTax lägger på 25% moms korrekt", () => {
        const money = new Money(100, "SEK");
        const withTax = money.addTax(0.25);
        expect(withTax.amount).toBe(125);
    });

    test("convert multiplicerar beloppet med kursen", () => {
        const money = new Money(100, "SEK");
        const converted = money.convert("USD", 0.1);
        expect(converted.amount).toBe(10);
    });
