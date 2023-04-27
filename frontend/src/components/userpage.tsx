import { useState, useEffect } from "react";

interface User {
  name: string;
  pass: string;
  gender: string;
  email: string;
  favnum: number;
}

function UserInfo() {
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
}

export default UserInfo;