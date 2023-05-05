# Backend dokumentáció

## server.js
A server.js a Backend belépési/indítási pontja. Ebben a fájlban hívjuk meg az összes olyan másik .js állományt (modult), amely a beérkező adatokat feldolgozza és kiszolgálja, valamint a Backend-el kapcsolatos alapvető beállítások - mint például az elfogadott CORS műveletek valamint a port száma - itt kerülnek definiálásra. A fájl header-jében a következő található, minden fájl szerepe kommentként olvasható:
```js
const express = require('express'); //Az express alapcsomag, hivatkozása kötelező a szerver használatához
const app = express(); //Az express alapcsomag applikáció létrehozó metódusa
const userRequests = require('../backend/requests/userRequests'); // A később bemutatásra kerülő, felhasználói kéréseket kezelő modul
const videoRequests = require('../backend/requests/videoReqeusts'); // A később bemutatásra kerülő, videókkal kapcsolatos kéréseket kezelő modul
const connect = require('../backend/dbConnect'); // Az adatbázishoz való csatlakozást megvalósító modul
const port = 4000; // Ezen a porton fog futni a szerver
const bodyParser = require('body-parser'); // A CORS kérések feldolgozását segítő csomag
const cors = require('cors'); // CORS kérésekhez szükséges csomag, biztonságos adatcserét biztosít
```
A CORS egy szabvány amely a felhasználó és a szerver közti kommunikációt biztosítja be. Használatával kijelenthetjük, hogy milyen címekről fogadunk csak el kéréseket, valamint milyen címekről dobjuk el azokat (ha nincs megadva egy cím mint forrás akkor az autómatikusan elutasításra kerül). A CORS bemutatása nem csak hasznos, de szükséges is; modern webböngészők, mint például a Google Chrome alapvető megkötést tesz a fejlesztőre amely megkívánja ennek a technológiának a használatát. A CORS paramétereit így inicializálom:
```js
pp.use(bodyParser.json()); // A bodyparser csomag json fájlok feldolgozását segítő metódusát hívjuk meg

app.options('*', cors()); // Minden opció ami a CORS-al jár legyen az alapértelmezett

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000'); // Csak a Frontend portjáról fogadunk el kéréseket
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // Az elfogadott kérések a GET, POST, PUT, DELETE
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // A header tartalmazhat content-type valamint Requested-With adatokat
    next();
});
```
Ha kiszabtuk a kommunikációs határokat a Frontend és a Backend között, a belső logikát megvalósító modulok kerülnek meghívásra:
```js
connect(); // Csatlakozzunk a MongoDB-hez
userRequests(app); // Indítsuk el a felhasználói kérésekkel foglalkozó modult
videoRequests(app);// Indítsuk el a videós kérésekkel foglalkozó modult
```
Végül indítsuk el a szervert a header-ben megadott porton:
```js
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
```
