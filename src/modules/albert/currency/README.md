# VALUTA OCH MOMSMODUL

## Syfte

Modulen konverterar priser från produkterna mellan valutorna (USD, EUR och SEK) med USD som bas. Modulen beräknar även svensk moms beroende på vad för typ av kategori produkten faller inom. Ex Standard-katergorin ger 25% moms och 12% för livsmedel. Resultatet är formaterade priser med och utan moms i vald valuta.

## Klasser

### index.js

Huvudklassen som utgår och visas via modulkontraktet. Här används komposition för att äga instanser av ExchangeRateClient och TaxTable. run-metoden tar emot en kundvagn och en valuta och returnerar senare konverterade priser samt totalsumma med skatt inkluderat.

### ExchangeRateClient

ExchangeRateClient har som uppgift att asynkront hämta valutakurser via /api/rates och cachar svaret i this.cache. Cachen gör att API:t inte anropas i onödan - kurser hämtas bara en gång per instans.

### TaxTable

I TaxTable hanterar momsreglerna per produktkategori. Det returneras 1.12 för livsmedel samt 1.25 för standard produkter. Frakt och rabattkoder utan kategori får ingen moms.

### Money

Money-klassen hanterar ett värdeobjekt med privata fält (#amount samt #currency) som skyddar mot valutablandning. convert() och addTax() returnerar nya Money-objekt istället för ändra det befintliga.

### CurrencyErrorHandling

Egengjorda felklasser som ärver från Error via extends: EmptyCartError - Fel som kastas när kundvagnen är tom, UnknownCurrencyError - Fel som kastas när valutan är okänd och ifall den inte är USD, EUR eller SEK. RateFetchError - Fel som kastas ifall det sker något fel gällande fetch av valutakurser. Dessa fel ger alltså specifika felmeddelanden som React kan visa direkt.

## Designval

Jag valde **komposition** framför arv eftersom att klasserna har helt olika ansvarsområden och inte delar någon gemensam nämnare. index.js äger instanser av ExchangeRateClient och TaxTable via this.rateClient och this.taxTable.

**Arv** används i felklasserna eftersom de delar en gemensam bas vilket är just Error vilket passar väldigt bra just när det gäller egengjorda felklasser.

**Money** är designad som ett värdeobjekt med privata fält (#amount och #currency). convert() samt addTax() returnerar alltid nya Money-objekt istället för ändra det befintliga, syftet är att skydda mot ofrivillig valutablandning.

Modulen är en instans eftersom det finns en cache i ExchangeRateClient (this.cache) som bärs mellan anrop. Kurser hämtas bara en gång per session och inte vid varje konvertering, vilket minskar onödiga API-anrop när användaren byter valuta.

## Tester

Enhetstester finns i currency/tests/CurrencyModule.test.js och har som uppgift att testa modulens kärnlogik med Vitest. Testerna körs med kommandot `npm test` i terminalen.

Följande händelser testas:

- EmptyCartError kastas vid tom kundvagn
- UnknownCurrencyError kastas vid okänd valuta
- Korrekt priskonvertering till SEK
- Money.toString() formaterar korrekt
- convert() returnerar ett nytt Money-objekt för att undvika valutablandning.
- addTax() lägger på korrekt momssats
- convert() multiplicerar beloppet med rätt kurs
