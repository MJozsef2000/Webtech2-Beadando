import React from 'react'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'

import Login from './components/login'
import SignUp from './components/signup'
import HomePage from './components/home'
import LogOut from './components/logout'
import UserPage from './components/userpage'
import UserFavoritesTable from './components/favourites'

import { SiVolkswagen } from 'react-icons/si';
function App() {
  const isLoggedIn = window.localStorage.getItem("loggedIn");
  const UserName = window.localStorage.getItem("username");

  console.log(isLoggedIn);
  return (
    <Router>
      <div className="App">
        <nav className="navbar navbar-expand-lg navbar-light fixed-top">
          <div className="container">
            <Link className="navbar-brand" to={'/'}>
              <SiVolkswagen /> DasAuto
            </Link>
            <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
              <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                {isLoggedIn === "false" && (
                    <Link className="nav-link" to={'/sign-in'}>
                      Belépés
                    </Link>
                  )}
                </li>
                <li className="nav-item">
                  {isLoggedIn === "false" && (
                    <Link className="nav-link" to={'/sign-up'}>
                      Regisztráció
                    </Link>
                  )}
                </li>
                <li className="nav-item">
                  {isLoggedIn === "true" && (
                    <Link className="nav-link" to={'/userpage'}>
                      {UserName}
                    </Link>
                  )}
                </li>
                <li className="nav-item">
                  {isLoggedIn === "true" && (
                    <Link className="nav-link" to={'/log-out'}>
                      Kijelentkezés
                    </Link>
                  )}
                </li>
                <li className="nav-item">
                  {isLoggedIn === "true" && (
                    <Link className="nav-link" to={'/favourites'}>
                      Kedvenceim
                    </Link>
                  )}
                </li>
              </ul>
            </div>
          </div>
        </nav>
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
      </div>
    </Router>
  );
}

export default App