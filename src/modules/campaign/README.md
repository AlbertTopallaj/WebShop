### Kampanj- och Rabattmodul

1. ##### Modulens syfte

Modulens syfte är att hantera validering, applicering och dynamisk omräkning av rabattkoder samt generella kampanjrabatter.

Modulen stödjer olika typer av rabattkoder (PERCENTAGE, THRESHOLD, BUY_X_PAY_Y) och ser till att varukorgens totalbelopp och aktiva rabatter hålls synkroniserade när varor läggs till, ändras eller tas bort.

Modulen muterar även inkommande data från servern längst upp i flödet för att applicera eventuella generella kampanjrabatter.

2. ##### Klassernas roller och relationer

Index (Huvudklass / Komposit):

Ansvarar för nätverksanrop mot API (/campaign), cachning av kampanjdata (cachedCampaigns, cacheTimestamp) samt felhantering och intern felloggning (errorLog)

DiscountCodeLogic (Beräkningsmotor för kampanjrabatter / Komponent):

Innehåller businesslogik. Den kontrollerar villkor såsom (discountCondition) och om varukorgen uppfyller kraven via getDiscount() samt sköter livscykelhantering av aktiva koder via checkCurrentValidity().

CampaignLogic (Datamotor för generella kampanjer / Komponent):

Innehåller businesslogik. Tar emot rådata från servern och muterar det på plats.

Discount (Datamodell):

Representerar en applicerad rabatt i varukorgen med tillhörande reduktionsvärde (price/discountValue), typ och villkor.

CampaignErrors (Felhantering):
Anpassade felklasser för domänspecifika fel som fångas och presenteras för slutanvändaren.

3. ##### Relationer:

Komposition: Huvudklassen har en (has-a) instans av DiscountCodeLogic och CampaignLogic, vilket separerar infrastrukturen (API/cache) från själva beräkningslogiken.

Arv: Discount är en extension av Product (Discount extends Product), vilket gör att rabatter kan placeras och itereras direkt i varukorgens befintliga cartItems-struktur.

4. ##### Motivering av designval

Komposition:
Genom att bryta ut affärsreglerna till DiscountCodeLogic frikopplas beräkningarna helt från API-anrop och nätverksberoenden. Detta gör beräkningslogiken enklare att enhetstesta.

Discount extends Product:
Genom att ärva från Product återanvänds varukorgens befintliga funktioner för rendering och summering utan att behöva bygga ut extralogik i frontend.

Tydlig ansvarsfördelning vid felhantering:
Modulen skiljer på operationella fel (CampaignErrors), vilka kastas vidare för att ge användaren tydlig feedback i UI, och programmeringsfel/systemfel, vilka loggas internt med tidsstämpel samt returnerar ett generiskt felmeddelande till användaren.

Upstream data mutation:
Genom att ändra data så nära källan som möjligt gör att det underliggande flödet automatiskt blir korrekt. Kundvagnen får en redan rabatterad vara och UIn visar rabatterna på plats utan att behöva göra lokala beräkningar