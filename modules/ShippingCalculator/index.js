class Parcel {
    constructor(weight, length, width, height) {
        if (!Number.isFinite(weight) || weight <= 0) {
            throw new Error(
                "Produktens vikt måste vara större än 0 kg."
            );
        }

        if (
            !Number.isFinite(length) ||
            !Number.isFinite(width) ||
            !Number.isFinite(height) ||
            length <= 0 ||
            width <= 0 ||
            height <= 0
        ) {
            throw new Error(
                "Produktens längd, bredd och höjd måste vara större än 0 cm."
            );
        }

        this.weight = weight;
        this.length = length;
        this.width = width;
        this.height = height;
    }

    get volume() {
        return this.length * this.width * this.height;
    }

    getVolumetricWeight(divisor) {
        return this.volume / divisor;
    }

    getBillableWeight(divisor) {
        return Math.max(
            this.weight,
            this.getVolumetricWeight(divisor)
        );
    }
}

class Carrier {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.pricingModel = data.pricingModel;
        this.zones = data.zones;
        this.baseRates = data.baseRates;
        this.perKgRate = data.perKgRate;
        this.volumetricDivisor = data.volumetricDivisor;
    }

    getZone(country) {
        const zone = this.zones[country];

        if (!zone) {
            throw new Error(
                `${this.name} levererar inte till ${country}.`
            );
        }

        return zone;
    }

    getPostalCodeSurcharge(country, postalCode) {
        const normalizedPostalCode =
            postalCode.replace(/\s/g, "");

        const digits =
            normalizedPostalCode.replace(/\D/g, "");

        if (!digits) {
            throw new Error(
                "Postnumret måste innehålla siffror."
            );
        }

        const postalNumber = Number(digits);

        const variation = postalNumber % 5;

        const carrierAdjustment = {
            postnord: 0,
            dhl: 10,
            bring: 5
        };

        const adjustment =
            carrierAdjustment[this.id] ?? 0;

        return variation * 5 + adjustment;
    }

    createQuote(parcels, country, postalCode) {
        const zone = this.getZone(country);

        if (this.pricingModel !== "weight_or_volumetric") {
            throw new Error(
                `Okänd prismodell för ${this.name}.`
            );
        }

        const baseRate = this.baseRates[zone];
        const perKgRate = this.perKgRate[zone];

        if (
            !Number.isFinite(baseRate) ||
            !Number.isFinite(perKgRate)
        ) {
            throw new Error(
                `Prisdata saknas för ${this.name}.`
            );
        }

        const billableWeight = parcels.reduce(
            (total, parcel) => {
                return total +
                    parcel.getBillableWeight(
                        this.volumetricDivisor
                    );
            },
            0
        );

        const postalCodeSurcharge =
            this.getPostalCodeSurcharge(
                country,
                postalCode
            );

        const price =
            baseRate +
            billableWeight * perKgRate +
            postalCodeSurcharge;

        return {
            name: "Frakt",
            carrierId: this.id,
            carrierName: this.name,
            price: Math.round(price * 100) / 100,
            currency: "SEK",
            zone: zone,
            billableWeight:
                Math.round(
                    billableWeight * 100
                ) / 100,
            postalCodeSurcharge:
                postalCodeSurcharge
        };
    }
}

class ShippingQuoteService {
    constructor() {

        this.carrierCache = null;

        this.quoteHistory = [];
    }

    async fetchCarriers() {
    if (this.carrierCache) {
        return this.carrierCache;
    }

    const response = await fetch("/api/carriers");

    if (!response.ok) {
        throw new Error(
            `Kunde inte hämta transportörer. HTTP ${response.status}.`
        );
    }

    const contentType =
        response.headers.get("content-type") || "";

    if (!contentType.includes("application/json")) {
        throw new Error(
            "API:t /api/carriers returnerade inte JSON."
        );
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
        throw new Error(
            "Transportörs-API:t returnerade ogiltig data."
        );
    }

    this.carrierCache = data.map(
        carrier => new Carrier(carrier)
    );

    return this.carrierCache;
}

    createParcels(cartItems) {
        if (
            !Array.isArray(cartItems) ||
            cartItems.length === 0
        ) {
            throw new Error(
                "Varukorgen är tom."
            );
        }

        const productItems =
            cartItems.filter(
                item => !item.isShipping
            );

        if (productItems.length === 0) {
            throw new Error(
                "Varukorgen innehåller inga produkter."
            );
        }

        const parcels = [];

        for (const item of productItems) {
            const product = item.product;
            const quantity = item.quantity;

            if (!product) {
                throw new Error(
                    "En produkt saknas i varukorgen."
                );
            }

            if (
                !Number.isInteger(quantity) ||
                quantity <= 0
            ) {
                throw new Error(
                    `Ogiltigt antal för ${product.name}.`
                );
            }

            const weightInKg =
                Number(product.weight) / 1000;

            if (
                !Number.isFinite(weightInKg) ||
                weightInKg <= 0
            ) {
                throw new Error(
                    `Produkten "${product.name}" saknar giltig vikt.`
                );
            }

            if (!product.dimensions) {
                throw new Error(
                    `Produkten "${product.name}" saknar dimensioner.`
                );
            }

            const {
                width,
                height,
                depth
            } = product.dimensions;

            for (let i = 0; i < quantity; i++) {
                parcels.push(
                    new Parcel(
                        weightInKg,
                        depth,
                        width,
                        height
                    )
                );
            }
        }

        return parcels;
    }

    async getQuotes(
        cartItems,
        country,
        postalCode
    ) {
        const parcels =
            this.createParcels(cartItems);

        const carriers =
            await this.fetchCarriers();

        const quotes = [];

        for (const carrier of carriers) {
            try {
                const quote =
                    carrier.createQuote(
                        parcels,
                        country,
                        postalCode
                    );

                quotes.push(quote);

            } catch (error) {
                console.warn(
                    `Kunde inte beräkna ${carrier.name}:`,
                    error.message
                );
            }
        }

        if (quotes.length === 0) {
            throw new Error(
                "Ingen transportör kan leverera till destinationen."
            );
        }

        quotes.sort(
            (a, b) => a.price - b.price
        );

        this.quoteHistory.push({
            country,
            postalCode,
            quotes,
            createdAt:
                new Date().toISOString()
        });

        return quotes;
    }
}

export default class ShippingModule {

    static descriptor = {
        name: "ShippingCalculator"
    };

    constructor() {
        this.shippingService =
            new ShippingQuoteService();
    }

    async run(values, context) {
        try {
            if (
                !values ||
                typeof values !== "object"
            ) {
                throw new Error(
                    "Ogiltiga indata."
                );
            }

            const {
                country,
                postal_code
            } = values;

            const allowedCountries = [
                "Sweden",
                "Norway",
                "Finland",
                "Denmark",
                "Germany",
                "USA"
            ];

            if (
                !allowedCountries.includes(
                    country
                )
            ) {
                throw new Error(
                    "Ett giltigt land måste väljas."
                );
            }

            const postalCodePattern =
                /^[A-Za-z0-9\s-]{3,10}$/;

            if (
                typeof postal_code !== "string" ||
                !postalCodePattern.test(
                    postal_code
                )
            ) {
                throw new Error(
                    "Postnumret har ett ogiltigt format."
                );
            }

            if (
                !context ||
                !Array.isArray(
                    context.cartItems
                )
            ) {
                throw new Error(
                    "Kundvagnen saknas."
                );
            }

            const quotes =
                await this.shippingService.getQuotes(
                    context.cartItems,
                    country,
                    postal_code
                );

            return quotes;

        } catch (error) {
            return {
                error: true,
                message:
                    error instanceof Error
                        ? error.message
                        : "Ett okänt fel uppstod."
            };
        }
    }
}