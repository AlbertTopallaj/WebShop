# Lagermodul

## 1. Modulens Syfte
### Denna modul hanterar lagerändringar (specifikt antalet produkter) samt lager historik och varningar om lågt saldo som skickas till admin

## 2. Klassernas Roller och Relationer
### StockItem: är en klass för att strukturera data som använder komposition för att samla data på ett effektivt och användarvänligt sätt. Den har fyra attribut: productId, stock, amount och date. Stock är produktens nuvarna lager saldo. Amount är hur mycket saldot ändrades med, detta kan hara negativt och positivt. Date är när klassen skapades. Som också blir då beställningen skedde men inte exact då det inte finns en koppling.
### StockWarning: är en yterligare klass som använder komposition. Den har tre attribut: productId, datum och meddelande. (Plus id som skapas automatiskt men används inte)
### ApiService: är en föreldrar klass som hanterar api anrop (get, put, pull, delete och patch. CRUD)
### StockService: ärver ApiService och hanterar ändringarna ändringar på "stock" värdet i produkterna som påverkas.
### StockHistoryService: ärver ApiService och hanterar StockItem:s datan. Alltså lager historiken.
### StockWarningsService: ärver ApiService och hanterar StockWarning:s datan. Alltså warning historiken.

## 3. Designval
### Konstruktorn innehäller tre värden "stockService", "stockHistory" och "stockWarnings". Objektet innehåller också "instance", detta är för att det skall bara finnas en instans av modulen. Detta hanteras i konstruktorn och ModuleRegistry i scripts. Jag är inte ansvarig för denna design. Alla andra är sina egna klasser som ärver ApiService. Detta är för att bara ha en instans av sökvägen per destination. Samt för att tydligare se vart man arbetar med api anropen i koden. T.ex. om man vill hämta lager historiken så kallar man det via stockHistory. Utan att behöva bygga om eller duplisera api funktionerna. Något jag skulle vilja ändra om jag hade mer tid hade varit att ta bort warningarna från databasen. Detta hade varit bättre då dem är tidsberoende och på lager historiken. Därför finns det lite användning av att spara det. Det hadde också varit bra om vi hadde en referense till beställningen i StockItem eller vise verse. Min namngivning är inte den bästa heller gällande vissa klasser.

P.S. Adminsidan är "/admin", den har ingen styling men fungerar
