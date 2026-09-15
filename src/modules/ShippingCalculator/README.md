ShippingCalculator
Syfte
ShippingCalculator är en modul för att beräkna fraktofferter för en varukorg baserat på produkternas vikt, volym och destination. Modulen hämtar transportörsdata asynkront från /api/carriers, beräknar ett pris för varje tillgänglig transportör och returnerar en sorterad lista med de billigaste offerterna först. Modulen är fristående från React och kan därför användas av andra delar av applikationen via dess publika index.js.

Klassernas roller och relationer
Modulen består av flera samverkande klasser som har olika ansvarsområden:

ShippingCalculator är modulens publika ingång och koordinerar hela beräkningen. Den validerar indata, skapar ett Parcel-objekt från varukorgen och använder ShippingQuoteService för att hämta offerter. Klassen innehåller även en cache och historik, vilket gör att modulen har ett meningsfullt instanstillstånd mellan anrop.

Parcel representerar själva försändelsen och ansvarar för vikt, mått, volym och beräkning av volymvikt samt debiterbar vikt.

ShippingQuoteService ansvarar för det asynkrona arbetet. Den hämtar transportörerna från /api/carriers, skapar Carrier-objekt och samlar in samt sorterar deras offerter.

Carrier representerar en transportör och ansvarar för att använda transportörens konfigurerade prismodell för att beräkna priset.

PricingModels innehåller själva prismodellen och beräknar exempelvis debiterbar vikt som det största värdet av faktisk vikt och volymetrisk vikt.

Klasserna använder komposition snarare än arv. ShippingCalculator använder Parcel och ShippingQuoteService, medan ShippingQuoteService använder Carrier, som i sin tur använder PricingModels. Detta gör varje klass mer fokuserad och enklare att testa och förändra separat.

Designval
index.js är modulens enda publika ingång och exporterar en default-klass enligt modulkontraktet. Klassen har en no-arg-konstruktor och metoden run(values, context) är asynkron. Instansen innehåller en cache för transportörsdata och en historik över tidigare beräkningar, vilket motiverar varför modulen behöver vara en instans och inte en samling statiska funktioner.

Felaktig indata och fel från API:t hanteras genom begriplig felhantering istället för att låta modulen krascha. React-komponenten ansvarar endast för användargränssnittet och anropar modulen via moduleMaker, medan all affärslogik för fraktberäkningen ligger i modulen.