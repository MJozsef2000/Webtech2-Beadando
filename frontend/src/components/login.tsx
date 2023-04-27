import { useState, FormEvent } from 'react'

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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

  return (
    <div className="auth-wrapper">
      <div className="auth-inner">
        <form onSubmit={handleSubmit}>
          <h3>Bejelentkezés</h3>
          <div className="mb-3">
            <label>Felhasználó</label>
            <input
              type="text"
              className="form-control"
              required={true}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label>Jelszó</label>
            <input
              type="password"
              className="form-control"
              required={true}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <div className="custom-control custom-checkbox">
              <input
                type="checkbox"
                className="custom-control-input"
                id="customCheck1"
              />
              <label className="custom-control-label" htmlFor="customCheck1">
                &#160;Emlékezz rám
              </label>
            </div>
          </div>

          <div className="d-grid">
            <button type="submit" className="btn btn-primary">
              Belépek
            </button>
          </div>
          <p className="forgot-password text-right">
            Elfelejtette a <a href="#">jelszavát?</a>
          </p>
        </form>
      </div>
    </div>
  )
}