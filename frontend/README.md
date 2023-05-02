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

## logout.tsx

Miután a felhasználó bejelentkezett, a navigációs felület megváltozik, és többek között tartalmazni fogja a "kijelentkezés" opciót. Ahhoz, hogy ez a funkció ténylegesen visszavigye a felhasználót a bejelentkező oldalra, végre kell hajtani pár változtatást; a loggedIn paraméter immáron false, valamint az oldal visszatér a kezdő felületre, ahol be kell jelentkezni megint.
```js
export default function logout(){
  window.localStorage.setItem("loggedIn","false");
  window.location.href = "./";
  console.log("Logged out!");
  const isLoggedIn = window.localStorage.getItem("loggedIn");
  console.log(isLoggedIn);
  return(
    <div>
    </div>
  );
}
```

## userpage.tsx
Bejelentkezés után a felhasználó lehetőséget kap a profiljának megtekintésére. A profil lényegében tartalmaz minden információt ami a felhasználót leírja; a nevét, jelszavát, nemét, email címét valamint kedvenc számát. Ezeket az információkat maga a felhasználó adja meg regisztrációkor, így minden elérhető az adatbázisból. Ahhoz, hogy a felhasználó adatait lekérdezhessük, létre kell hoznunk egy típust, ami ezeket az adatokat eltárolja:
```js
interface User {
  name: string;
  pass: string;
  gender: string;
  email: string;
  favnum: number;
}
```
Miután létrehoztuk ezt a típust (interfészt), le kell kérnünk az adatokat a Backend oldaláról. A lekérdezés sikeres kimenetele esetén a Backend-től visszakapott User eltárolásra kerül a setUser() függvény alkalmazásával, különben hibát ad vissza. A megvalósítás:
```js
const username: string | null = window.localStorage.getItem("username");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    console.log("Requesting user data");
    fetch(`http://localhost:4000/users/${username}`)
      .then((res) => {
        if (res.status === 404) {
          setUser(null);
          console.log("User not found!");
        } else if (res.ok) {
          res
            .json()
            .then((data: User) => setUser(data))
            .catch((err) => console.error(err));
        } else {
          console.log("Valami hiba történt!");
        }
      })
      .catch((err) => console.error(err));
  }, [username]);
```
Az adatok lekérdezése után a weboldalra kiírjuk a felhasználó adatait, vagy töltést jelez:
```js
return (
    <div className="auth-wrapper">
      {user ? (
        <div className="auth-inner">
          <h2>{user.name} információi</h2>
          <h5>Email: {user.email}</h5>
          <h5>Password: {user.pass}</h5>
          <h5>Favorite Number: {user.favnum}</h5>
          <h5>Gender: {user.gender}</h5>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
```

## home.tsx
A home.tsx fájl tartalmazza a videó megtekintő felületet. Ez az oldal egy YouTube videó lejátszót, valamint 2 gombot tartalmaz. A "Még!" gombbal egy újabb videót kérhetünk az adatbázisból, a "Kedvencekhez adás" gomb pedig a videót a felhasználó kedvencei közé teszi. Az oldal megnyitásakor egy előre megadott videó fogad minket, majd a "Még!" gomb megnyomásával véletlenszerűen kaphat a felhasználó egy másikat. Mielőtt használhatnánk videókat, a YouTube lejátszót inicializálnunk kell, ezt a következőképpen teszem:
```js
  const onPlayerReady: YouTubeProps['onReady'] = (event) => {
    event.target.pauseVideo();
  };

  const opts: YouTubeProps['opts'] = {
    height: '440',
    width: '640',
    playerVars: {
      autoplay: 1,
    },
    onReady: onPlayerReady,
  };
  
```
A kód lényegében úgy hozza létre a lejátszó felületet, hogy az kezdeti állapotában egy megállított videó, majd minden más betöltött videó autómatikusan lejátszódik. A lejátszó felbontása 640x440. Az összes konfigurációs információt az "opts" paraméterben tárolom.

Ha új videót szeretne látni a felhasználó, akkor azt az adatbázisból kell lekérdeznie a Frontend-nek. Egy GET kérésben meg kell adnunk egy megfelelő video ID-t, amelyet véletlenól generálunk, majd a kapott videó linkjét beállítjuk a setVideo() függvénnyel. 

```js
  function getVideo(e: MouseEvent<HTMLButtonElement>) {
    setVid(getRandomInt(11));
    fetch(`http://localhost:4000/videos/${vid}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => res.text())
      .then(link => setVideo(link));
    console.log(video);
  }
```
  
Ahhoz, hogy egy videót a kedvencek közé tudjon adni a felhasználó, egy POST kéréssel kell fordulni a Backend felé. Ez a POST kérés egy videó ID-t és egy felhasználó nevet kér. Ha ezt a két dolgoz tudjuk biztosítani, akkor a Backend leellenőrzi, hogy a videó a kedvencek között van-e már ennél a felhasználónál. Ha igen, akkor erről értesítjük a felhasználót, ha nem, akkor pedig a hozzáadás sikeréről kap felugró ablakot. Ezt a folyamatot a következő kódrész kezeli:

```js
function addFavourite(e: MouseEvent<HTMLButtonElement>){
  const username = window.localStorage.getItem("username");
    fetch(`http://localhost:4000/videos/${vid}/${username}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(res => {
      if (res.status == 200){
        window.alert("Hozzáadva a kedvencekhez!");
      } else if(res.status == 400) {
        window.alert("Ez a videó már a kedvencek között van!");
      } else {
        window.alert("Ismeretlen belső hiba!");
      }
    });
  }
```
Az oldal megjelenítése lényegében csak a két gombból és a videó felületből áll, amely így áll elő:
```js
  return (
    <div className="video-wrapper">
      <div className="video-inner">
        <YouTube videoId={video} opts={opts} />
        <div>
          <button onClick={getVideo} type="button" className="btn btn-primary">Még!</button>
          <button onClick={addFavourite} type="button" className="btn btn-warning">Kedvencekhez adás</button>
        </div>
      </div>
    </div>
  );
```
