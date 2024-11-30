console.log(firebase)
var Email = document.getElementById("email")
var Password = document.getElementById("Password")
var Button = document.getElementById("Login")

Button.addEventListener("click", async function(){
    await firebase.auth().signInWithEmailAndPassword(Email.value,Password.value)
    .then((users)=>{
          console.log(users.user.uid)
          localStorage.setItem("UserId",users.user.uid)
          window.location.replace("index.html")
          }
    )
    .catch((error)=>{
        localStorage.clear()
        window.location.replace("Signup.html")
        alert(error)
    })
    
})


