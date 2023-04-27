# Frontend
A projekt Frontend logikai részét a React keretrendszerrel oldottam meg, amely a Typescript-et használja mint nyelv.
A stílusért a Bootstrap 5.3-as verziója felelős.

## App.tsx
Az App.tsx a weboldal gerincét alkotja. Ez a rész kezel olyan fontos dolgokat, mint a navigációs menü frissítése, működtetése,
valamint ami ennél is fontosabb, a felhasználó irányítása a weboldal részei között React Router-el. Két globális információt 
kell ismernünk a weboldal ezen szakaszában:

```js
const isLoggedIn = window.localStorage.getItem("loggedIn");
const UserName = window.localStorage.getItem("username");
```

Az isLoggedIn paraméterrel azt tartjuk számon, hogy a felhasználó bejelentkezett-e már, valamint a UserName peraméter segítségével be tudjuk
azonosítani hogy ki is az a felhasználó, aki belépett. Érdemes megjegyezni, hogy a felhasználó nevek egyediek, regisztráció során a Backend 
meggyőződik arról, hogy létezik-e már ilyen felhasználó vagy sem, így bátran használhatjuk a felhasználó nevét, mint egyedi azonosítót.

A navigációs logikát a React Router csomaggal oldottam meg, amellyel efektíven tudom befolyásolni, hogy mit, és mikor lásson a felhsaználó.
A navigációs menü túlnyomó részét hasonló logika övezi, miszerint a felhasználó bejelentkezési státuszát vesszük alapul az opciók megjelenítéséhez:

```js
<ul className="navbar-nav ml-auto">
...
<li className="nav-item">
  {isLoggedIn === "false" && (
    <Link className="nav-link" to={'/sign-in'}>
      Belépés
    </Link>
  )}
</li>
...
</ul>
```

A fenti példában láthatjuk, hogy ha a felhasználó még nem jelentkezett be, akkor a bejelentkezést biztosító menüpont rendelkezésre áll, ellentétben a "Kedvenceim" menü
ponttal:

```js
<ul className="navbar-nav ml-auto">
...
<li className="nav-item">
  {isLoggedIn === "true" && (
    <Link className="nav-link" to={'/favourites'}>
      Kedvenceim
    </Link>
  )}
</li>
...
</ul>
```

A Router nem csak a navigációs menü megjelenítését teszi lehetővé, hanem magát a navigációt is ez a csomag végzi <Routes> tag-el, a következőképpen:
  
```js
...
<Routes>
  <Route
    path="/"
    element={isLoggedIn === "true" ? <HomePage /> : <Login />}
  />
  <Route path="/sign-in" element={<Login />} />
  <Route path="/sign-up" element={<SignUp />} />
  <Route path="/log-out" element={<LogOut />} />
  <Route path="/userpage" element={<UserPage />} />
  <Route path="/favourites" element={<UserFavoritesTable username={UserName}/>} />
</Routes>
...
```

A weboldal balfelső részében található DasAuto és a mellette található logo is ebben a fájlban valósul meg. A Volkswagen 
ikont a react-icons csomag biztosította.

```js
...
import { SiVolkswagen } from 'react-icons/si';
...
<Link className="navbar-brand" to={'/'}>
  <SiVolkswagen /> DasAuto
</Link>
...
```

## login.tsx
A login.tsx fájl a bejelentkezés felületét valósítja meg. A bejelentkező felület egy 2 bemenetből álló form, amely kezelését a következő metódus 
valósítja meg:
  
```js
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    console.log(username, password);
    fetch("http://localhost:4000/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username,
        password,
      }),
    })
      .then((res) => {
        if (res.status >= 200 && res.status < 300) {
          window.localStorage.setItem("loggedIn", "true");
          window.localStorage.setItem("username", username);
          window.location.href = "./";
        } else {
          console.log('Valami hiba történt!');
          window.alert('Helytelen felhasználó vagy jelszó!')
        }
      }
      );
  }
```
A metódus először is megakadájozza, hogy az oldal frissüljön a form beküldése után az e.preventDefault(); direktívával. Ezután a Backendnek küldünk egy POST 
kérést, amelyben átadunk egy nevet és egy jelszót. Innentől kezdve a Backendnél valami történik a kapott információkkal: Vagy elfogadja őket miután sikeres autentikáció történt az adatbázissal, vagy eldobja a kapott információkat abban az esetben, ha a táblázat nem tertalmaz a kapott információknak megfelelő felhasználót. Bármilyen válasz is jön vissza, a metódus lekezeli azt.
                                                  
## signup.tsx
A regisztrációs felület egy fokkal bonyolultabb mechanizmus, bár a nehéz feladatot itt is a Backend végzi. A felület 5 bemeneti mezőt tartalmaz, amelyből a felhasználó név, a jelszó és az email cím kötelező. A jelszó természetesen kitakarásra kerül. A fájl érdekes részét megint csak a Backend-el való kommunikáció rejti, amely a következőképpen történik:
```js
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [favnum, setFavnum] = useState("");
  const [gender, setGender] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Submitting form data...");
    console.log(username, email, password, favnum, gender);
    fetch("http://localhost:4000/register", {
      method: "POST",
      body: JSON.stringify({
        username,
        email,
        password,
        favnum,
        gender,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status >= 200 && res.status < 300) {
          console.log(res);
          window.alert("Regisztráció sikeres!")
        } else if(res.status == 400) {
          window.alert("Már regisztráltak ezen a néven!")
        } else {
          window.alert("Helytelen információkat adott meg!")
        }
      }).catch(err => err);
  }
```
Miután a form felület begyűjtötte a felhasználó regisztrációs adatait, valamint verifikálta azokat (email cím tartalmaz-e @-ot, kötelező információk megadásra kerültek-e), a megadott információk elküldésre kerülnek a Backend felé egy POST kéréssel. A regisztráció háromféleképpen mehet: A regisztráció sikeres, ha minden információ helyes a Frontend és Backend oldalán is. A regisztráció sikertelen, ha a regisztrálni kívánt név már létezik az adatbázisban, vagy valamelyik információ helytelen.
  
