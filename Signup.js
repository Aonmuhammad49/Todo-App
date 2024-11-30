console.log(firebase)
const Name = document.getElementById("Name")
const email = document.getElementById("Email")
const password = document.getElementById("password")
const Signup = document.getElementById("Signup")
const GoogleSignIn = document.getElementById("GoogleSignIn")
const IMAGE = document.getElementById("IMAGEUPLOAD")

   Signup.addEventListener("click", function() {
      let file = IMAGE.files[0];
      console.log(file);
      
      if (!file) {
          alert("Please Select Image");
      } else if (email.value === "") {
          alert("Enter Your Email");
      } else {
          var check = false; 
          firebase.database().ref("user").get()
              .then((user) => {
                  let data = user.val();
                  for (let item in data) {
                      let Email = data[item].email;
                     if (Email === email.value) {
                          check = true;                            
                          break;  
                      }
                  }
                  if (check) {
                      alert("Email already registered!");
                  } 
                  else {
                        console.log(file)
                        const CLOUDNAME = "dwijkyrr2";
                        const UNSIGNEDUPOLOAD = "Server";
                        const URL= 'https://api.cloudinary.com/v1_1/'+CLOUDNAME+"/upload"
                        const formData = new FormData()
                        formData.append("upload_preset",UNSIGNEDUPOLOAD)
                        formData.append("file",file)
   
                   try{
                        fetch(URL,{
                        method:"POST",
                        body:formData,
                  })
                        .then((resp)=>resp.json())
                        .then(async (data)=>{
                        console.log(data.secure_url)
                        await firebase.auth().createUserWithEmailAndPassword(email.value,password.value)
                        .then( async (Data) => { 
                            console.log(Data.user.uid)
                            var object = {
                                "Name": Name.value,
                                "Email": email.value,
                                "photo": data.secure_url,
                                "userId": Data.user.uid
                             }
                             await firebase.database().ref("user").child(Data.user.uid).set(object)
                             localStorage.setItem("userId", Data.user.uid)
                             window.location.replace("Login.html")
                  })
                        .catch((error) => {
                                       console.log(error)
                  })       
                  })
                  }
                  catch(e){
                     console.log(e)
                  }
                  }
                  })
              .catch((error) => {
                  console.error("Error reading user data:", error);
              });
      }
  });
  
   
   
      
   