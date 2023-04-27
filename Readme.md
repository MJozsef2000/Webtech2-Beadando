# Webtechnológiák 2 féléves beadandó feladat
 
## A feladat témája
A weboldal azon elterjedt autós videókról szól, amelyek viccet csinálnak a reklámokban elhangzó szlogenekból.
A weboldal lényege, hogy felhasználók tudjanak be és kijelentkezni, véletlenszerűen megtekinteni videókat a az adott felületen,
hozzáadni őket a kedvencek közé, valamint törölni azokat onnan. A felhasználó ezen felül megtekintheti a saját adatlapját is,
ahol a regisztrációs információit tekintheti meg. Az oldal legérdekesebb része a bejelentkezés után minket fogadó
videó megtekintő oldal, amely a Youtube API-t felhasználva rendelkezésünkra bocsájtja a YouTube videó lejátszóját.

Megjegyzés: A YouTube API elérését a React-Youtube csomag biztosítja, amely bár rengeteg hibát jelez a konzolban, tökéletesen működik.
A hibák forrása többek között abból jöhet, hogy a YouTube lényegében nem egyezett bele hogy használjam a videó megosztó portáljukat,
valamint saját tapasztalat szerint nem jelenik meg semmmilyen reklám az oldalon, így ez szembe megy a modelljüknek.

## A projekt elindítása
Frontend és Backend egyaránt
```npm
npm i 
npm run start
```

## Opciók
A projekt elindítása után a Bejelentkezés felület fogad minket, ahol Felhasználónév és Jelszó megadásával léphetünk be. Ha nem hoztunk még létre saját felhasználót, akkor ezt megtehetjük a Regisztráció menüpont alatt, amit a képernyő tetején találunk.

A regisztrációs felületen meg kell adni a felhasználó nevet amit használni szeretnénk, a jelszót, az email címünket, a nemünket és a kedvenc számunkat. Ezek közül nem kötelező a nem és a kedvenc szám megadása. A "Regisztrálok! gombbal egy POST kérést küldünk a backend-nek, amely létrehoz egy adatbázis bejegyzést a megadott felhasználói adatokkal. Miután a sikeres létrehozásról visszajelzést kaptunk, ideje bejelentkezni!

Megjegyzés: A regisztrációs felület fel van készítve olyan esetre, ahol a felhasználó név már létezik, így igyekezzünk eredeti nevet kitalálni, ami még nem regisztrált!

Belépést és autentikációt követően (ami szintén egy POST kérés a backend felé) a videó megtekintő felület fogad minket. Itt a YouTube API-t hívjuk segítségül, hogy a videókat meg tudjuk nézni. A videókat a Videos collection-ből nyeri ki a backend, és szolgáltatja azt véletlenszerüen a felhasználó számára. Ha a videót megtekintette a felhasználó, vagy másikat szeretne nézni, akkor a "Még!" gombra kattintva egy újabb vicces autós videó fogad minket.

A videókat nem csak nézni, hanem lementeni is tudjuk, a "Kedvencekhez adás" gombbal. Miután egy videót a kedvencek közé adtunk, az lementésre kerül és a felhasználó nevéhez fog kapcsolódni. Hogy ezt ellenőrízhessük, mentsünk le egy videót és tekintsük meg a "Kedvenceim" menüpontot!

A "Kedvenceim" menü eleinte üres, viszont ha már pár videót hozzá adtunk a listához, akkor megtudjuk tekinteni a YouTube linkeket, amelyekből a kedvenc videóink származnak. A lista dinamikus, növelhetjük amíg azt a videók száma engedi. Természetesen opciónk van a linkek törlésére is, ezt a piros "törlés" gombbal tudjuk megtenni minden elem mellett.

Ha vissza szeretnénk térni a videó megtekintő felülethez, kattintsunk a bal fent lévő "DasAuto" ikonra!
