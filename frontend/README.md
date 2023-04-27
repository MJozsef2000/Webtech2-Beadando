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

A fenti példában láthatjuk, hogy ha a felhasználó még nem jelentkezett be, akkor a bejelentkezést biztosító menüpont rendelkezésre áll, ellentétben a Kedvencek menü
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
