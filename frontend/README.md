# Frontend
A projekt Frontend részét a React keretrendszerrel oldottam meg, amely a Typescript-et használja mint nyelv.

## App.tsx
Az App.tsx a weboldal gerincét alkotja. Ez a rész kezel olyan fontos dolgokat, mint a navigációs menü frissítése, működtetése,
valamint ami ennél is fontosabb, a felhasználó irányítása a weboldal részei között React Router-el. Két globális információt 
kell ismernünk ebben a szakaszban:

```js
const isLoggedIn = window.localStorage.getItem("loggedIn");
const UserName = window.localStorage.getItem("username");
```
