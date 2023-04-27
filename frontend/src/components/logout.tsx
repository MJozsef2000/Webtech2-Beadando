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