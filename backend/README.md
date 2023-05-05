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

## dbConnect.js
Ez a modul létesíti a kapcsolatot az adatbázissal. Ezt többféleképpen is megtehetem, én a mongoose csomagot használtam. A kapcsolat létrehozásánál meg kell adnunk a szerver címét, valamint hogy melyik kollekcióval kell kapcsolatot létrehozni. Ezután kezelnünk kell a hibát és a sikeres kapcsolatot egyaránt, ami egyszerű konzol kimenet esetünkben
```js
const mongoose = require('mongoose');
// Connect to MongoDB database
module.exports = function(){
  mongoose.connect('mongodb://127.0.0.1:27017/DasAuto');
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function() {
    console.log('Connected to MongoDB database.');
  });
}
```

## Sémák (userSchema.js és videoSchema.js)
Mielőtt beszélhetnénk a kérésekről amelyeket a Backendnek kezelnie kell, fel kell tudnunk állítani azt az adatmodellt (sémát) amelyek használatával ezeket a kéréseket ki tudjuk szolgálni. Két sémát kell realizálni; a felhasználó adatait definiáló userSchema-t, és a videó adatait megadó videoSchema-t:
```js
const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  name: String, // A felhasználó neve
  pass: String, // A felhasználó jelszava
  gender: String, // A felhasználó neme 
  email: String, // A felhasználó email címe
  favnum: Number // A felhasználó által választott kedvenc szám
});

module.exports = userSchema;
```

```js
const mongoose = require('mongoose');
const videoSchema = new mongoose.Schema({
  link: String, // A videó YouTube linkje
  favby: Array, // A videót mely felhasználók tették a kedvenceik közé (string array)
  vid: Number // A videó ID-ja
});

module.exports = videoSchema;
```
## userRequests.js
Ha felállítottuk a használandó sémákat, kezelhetjük az őket használó kéréseket is. Először a felhasználóval kapcsolatos lekérdezéseket vesszük figyelembe. Első lekérdezés amit megvalósítunk, az a felhasználó adatainak lekérdezése felhasználó név alapján. Mivel csak egy nevet kérünk be, elég ha a req.params-ban adjuk át a paramétert a Backend számára. Ha a felhasználó nem létezik, 404-es hibával, ha hiba történt akkor 500-al, ha sikeres a lekérdezés akkor pedig a felhasználó adataival válaszol a szerver.
```js
module.exports = function (app) {
 app.get('/users/:username', (req, res) => {
    const username = req.params.username;
    User.findOne({ name: username })
      .then(user => {
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
      })
      .catch(err => {
        console.error(err);
        res.status(500).send('Server Error');
      });
  });
  ...
}
```
Bár a Frontend nem használja ki ezt a funkciót, implementálásra került az az eset is, ha minden felhasználót le szeretnénk kérdezni. Ezt egy egyszerű /users kéréssel hajthatjuk végre, amely hasonlóan működik a felhasználó specifikus változattal.
```js
module.exports = function (app) {
...
  app.get('/users', function (req, res) {
    User.find()
      .then(users => {
        if (!users) {
          return res.status(404).send('User(s) not found');
        }
        res.send(users);
      })
      .catch(err => {
        console.error(err);
        res.status(500).send('Error retrieving users from database');
      });
  });
...
}
```
Ha a felhasználó bejelentkezéséről van szó, két információt kell összevetnünk az adatbázissal: Egy felhasználó nevet és egy jelszót. Ha az adatbázisban meglelhetó a felhsaználó és a az adott jelszó ugyanabban a rekordban, akkor a felhasználó sikeresen autentikálta magát (200-as kód + a felhasználó adatai). Ellenkező esetben 404-es kóddal jelez a Backend a felhasználó sikertelen azonosításáról.
```js
module.exports = function (app) {
  ...
  app.post('/users/login', function (req, res) {
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({ name: username, pass: password})
      .then(user => {
        if (!user) {
          return res.status(404).send('User not found');
        }
        res.status(200).send(user);
      })
      .catch(err => {
        console.error(err);
        res.status(500).send('Error retrieving user from database');
      });
  });
  ...
}
```
A felhasználó nem csak belépni tud, de létre is hozhat egy felhasználói fiókat. A Frontend signup.tsx fájljában implementált regisztrációs módszer ezt a kérést küldi el a Backend felé, amelyet a következőképpen kezelünk (magyarázat kommentekben):
```js
module.exports = function (app) {
...
  app.post('/register', (req, res) => {
    console.log(req.body);
    //A req.body tartalmazza a Frontendben megadott felhasználói adatokat
    const username = req.body.username;
    const password = req.body.password;
    const gender = req.body.gender;
    const email = req.body.email;
    const favnum = req.body.favnum;
    
    //Ellenőrizzük, hogy a felhasználó létezik-e már
    User.findOne({name: username})
      .then(user => {
        if (user) {
          // Ezzel a névvel már rendelkezik felhasználó az adatbázisban
          res.status(400).send('User with that name already exists');
        } else {
          // Nem létezik még ilyen felhasználó, hozzuk létre az adatbázisban
          const newUser = new User({
            name: username,
            pass: password,
            gender: gender,
            email: email,
            favnum: favnum
          }, {versionKey: false});
          //A létrehozott felhasználót leíró newUser rekord mentése, promise alapján működik
          newUser.save()
            .then(() => {
              // A felhasználó sikeresen került elmentésre
              res.status(200).send('User created successfully');
            })
            .catch(err => {
              // HIba történt mentés közben
              console.error(err);
              res.status(500).send('Internal server error');
            });
        }
      })
      .catch(err => {
        // Hiba történt azonosítás közben
        console.error(err);
        res.status(500).send('Internal server error');
      });
  });
  ...
}
```
Ugyancsak kihasználatlan eszköz a felhasználók törlése. Ebben az esetben egy felhasználó név alapján egy adatbázisból való törlést kérhet a Frontend:
```js
module.exports = function (app) {
  ...
  app.get('/users/remove/:name', (req, res) => {
    const name = req.params.name;
    User.findOneAndDelete({ name: name })
      .then(result => {
        if (result) {
          res.status(200).send('User deleted successfully');
        } else {
          res.status(400).send('User not found');
        }
      })
      .catch(err => {
        console.error(err);
        res.status(500).send('Internal server error');
      });
  });
}
```
