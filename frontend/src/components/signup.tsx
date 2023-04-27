import { useState, FormEvent } from 'react'
export default function SignUp() {
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

  return (
    <div className="auth-wrapper">
      <div className="auth-inner">
        <form onSubmit={handleSubmit}>
          <h3>Regisztráció</h3>
          <div className="mb-3">
            <label>Felhasználó név*</label>
            <input
              type="text"
              className="form-control"
              placeholder="Never"
              required={true}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label>Jelszó*</label>
            <input
              type="password"
              className="form-control"
              placeholder="Gonna"
              required={true}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label>E-mail cím*</label>
            <input
              type="email"
              className="form-control"
              placeholder="Give@You.up"
              required={true}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label>Neme</label>
            <input
              type="text"
              className="form-control"
              onChange={(e) => setGender(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label>Kedvenc száma</label>
            <input
              type="number"
              className="form-control"
              onChange={(e) => setFavnum(e.target.value)}
            />
          </div>
          <div className="d-grid">
            <button type="submit" className="btn btn-primary">
              Regisztrálok!
            </button>
          </div>
          <p className="forgot-password text-right">
            Már <a href="/sign-in">regisztráltál?</a>
          </p>
        </form>
      </div>
    </div>
  );
}