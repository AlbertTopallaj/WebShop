# FRAKTBERÄKNINGSMODUL

## Syfte

Modulen räknar ut fraktalternativ för produkterna i en kundvagn. Den tar emot land och postnummer och använder informationen från kundvagnen för att räkna ut vikt, volym och debiterbar vikt. Därefter hämtas information om olika transportörer asynkront från /api/carriers och ett fraktpris räknas ut för varje transportör. Resultaten sorteras efter pris så att de billigaste alternativen hamnar först.

Destinationen påverkar fraktpriset genom vilket land kunden befinner sig i. Olika länder tillhör olika fraktzoner och har därför olika prisnivåer. Postnumret valideras och följer med i resultatet, men används inte för att ändra själva fraktpriset.

Tanken är att all logik för fraktberäkningen ska ligga i modulen istället för i React. Det gör att React endast behöver använda modulen och visa resultatet.

## Klasser

### ShippingCalculator
Huvudklassen som används via modulkontraktet. Den validerar land och postnummer, skapar ett Parcel från kundvagnen och skickar sedan vidare beräkningen till ShippingQuoteService. Klassen har även en cache och en historik som sparar data mellan anrop.

### Parcel
Parcel representerar själva försändelsen och räknar ut bland annat volym, volymetrisk vikt och debiterbar vikt. Den debiterbara vikten är det högsta värdet av den faktiska vikten och den volymetriska vikten.

### ShippingQuoteService
Hämtar transportörerna asynkront från /api/carriers och skapar Carrier-objekt för varje transportör. Därefter räknas ett pris ut för varje transportör. De offerter som lyckas sorteras efter pris, medan offerter som innehåller fel placeras sist.

### Carrier och PricingModels
Carrier representerar en transportör och använder PricingModels för att räkna ut priset. Just nu används prismodellen weight_or_volumetric, där den debiterbara vikten används tillsammans med transportörens prisdata och den zon som landet tillhör.

### modulemaker.js
modulemaker.js skapar en instans av ShippingCalculator och exporterar den tillsammans med dess descriptor. Det är sedan genom denna instans som resten av applikationen kan använda modulen.

## Designval

Jag valde komposition istället för arv eftersom klasserna har olika ansvarsområden. ShippingCalculator använder Parcel och ShippingQuoteService, som i sin tur använder Carrier och PricingModels. Detta gör koden mer uppdelad och enklare att ändra eller testa.

Modulen är en instans eftersom den har ett tillstånd i form av cache och historik som finns kvar mellan anrop. Fel hanteras också i modulen så att den kan returnera ett tydligt felmeddelande istället för att applikationen kraschar.

//Johan