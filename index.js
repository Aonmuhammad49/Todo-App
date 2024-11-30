var ButtonClick = document.getElementById("Button-Click")
var input = document.getElementById("input")
var Click = document.getElementById("Click")
var changecolor = document.getElementById("changecolor")
var update = document.getElementById("updateclick")
var checkbox = document.getElementById("checkbox")
var deletecheck = document.getElementById("deleteclick")
var Loading = document.getElementById("Loading")
var Datashow = document.getElementById("After")
var checkboxselected = false
var selected = "";
var Name = document.getElementById("Name")
var email = document.getElementById("email")
var image = document.getElementById("image")

Click.addEventListener("click", function() {
    if (input.value) {
        var div = document.createElement("div")
        div.className = "div"
        var checkbox = document.createElement("input")
        checkbox.type = "checkbox"
        checkbox.className = "check-box"
        
        var write = document.createElement("b")
        write.innerText = input.value
        write.className = "b"
        
        var key = firebase.database().ref("todos").push().key;

        var button1 = document.createElement("button")
        button1.className = "button-style"
        button1.style.display = "inline-block"
        button1.setAttribute("onclick", 'Editclick(this)')
        var editicon = document.createElement("i")
        editicon.classList.add("fa-solid")
        editicon.classList.add("fa-pen")
        button1.appendChild(editicon)
        button1.setAttribute("id",key)
        

        var button2 = document.createElement("button")
        button2.className = "button-style2"
        button2.setAttribute("onclick", 'deletetext(this)')
        var deleteicon = document.createElement("i")
        deleteicon.classList.add("fa-solid")
        deleteicon.classList.add("fa-trash-can")
        button2.appendChild(deleteicon)
        button2.setAttribute("id",key)
        
        
        addfirebase(input.value,key)
        div.appendChild(checkbox)
        div.appendChild(write)
        div.appendChild(button1)
        div.appendChild(button2)
        ButtonClick.appendChild(div)
                
    }    
})
async function addfirebase(val,key){
    var userId = localStorage.getItem("UserId") 
    var obj = {
        "todo":val,
         "todo_key":key,
         
    }
   await firebase.database().ref("todos").child(userId).child(key).set(obj) 
   input.value = ""
   setItem(); 
}

// Edit function
function Editclick(e) {
    console.log(e.id)
    console.log(e.parentNode.childNodes[1])
    input.value = e.parentNode.childNodes[1].innerText
    Click.style.display = "none"
    deletecheck.style.display = "none"
    update.style.display = "inline-block"
    selected = e.parentNode.childNodes[1]
}

// Delete function
async function deletetext(SMIT) {
    console.log(SMIT.id)
    console.log(SMIT.parentNode)
    SMIT.parentNode.remove()
    var userId = localStorage.getItem("UserId")
    await firebase.database().ref("todos").child(userId).child(SMIT.id).remove()
    setItem();  // Re-save todos to localStorage after deletion
}

// Update function
update.addEventListener("click", async function() {
    if (input.value) {
        var key = selected.parentNode.children[2].id
        selected.innerText = input.value
        Click.style.display = "inline-block"
        deletecheck.style.display = "inline-block"
        update.style.display = "none"
        var userId = localStorage.getItem("UserId")
        await firebase.database().ref("todos").child(userId).child(key).update({
            "todo": input.value
        })
        input.value = ""
        setItem();  // Re-save todos to localStorage after update
    }
})

// Checkbox function (toggle all checkboxes)
checkbox.addEventListener("click", function() {
    for (var item of ButtonClick.children) {
        item.children[0].checked = !checkboxselected
    }
    checkboxselected = !checkboxselected
})

// Delete selected function
deletecheck.addEventListener("click", function() {
    for (var i = 0; i < ButtonClick.children.length; i++) {
        if (ButtonClick.children[i].children[0].checked) {
            ButtonClick.children[i].remove()
            i = i - 1
        }
    }
    checkboxselected = false
    checkbox.checked = false
    setItem();  // Re-save todos to localStorage after deletion
})

// Function to save todo items to localStorage
function setItem() {
    var todoitem = []
    for (var item of ButtonClick.children) {
        todoitem.push(item.children[1].innerText)  // Push the text of the todo item
    }
    localStorage.setItem("TODO", JSON.stringify(todoitem));  // Save to localStorage

}

// Function to create todo items from saved data
function SetFirsttime(value) {
    if (value) {
        var div = document.createElement("div")
        div.className = "div"
        var checkbox = document.createElement("input")
        checkbox.type = "checkbox"
        checkbox.className = "check-box"
        
        var write = document.createElement("b")
        write.innerText = value.todo
        write.className = "b"
        
        var button1 = document.createElement("button")
        button1.className = "button-style"
        button1.style.display = "inline-block"
        button1.setAttribute("onclick", 'Editclick(this)')
        var editicon = document.createElement("i")
        editicon.classList.add("fa-solid")
        editicon.classList.add("fa-pen")
        button1.appendChild(editicon)
        button1.setAttribute("id",value.todo_key)

        var button2 = document.createElement("button")
        button2.setAttribute("onclick", 'deletetext(this)')
        var deleteicon = document.createElement("i")
        deleteicon.classList.add("fa-solid")
        deleteicon.classList.add("fa-trash-can")
        button2.className = "button-style2"
        button2.appendChild(deleteicon)
        button2.setAttribute("id",value.todo_key)
        
        div.appendChild(checkbox)
        div.appendChild(write)
        div.appendChild(button1)
        div.appendChild(button2)
        ButtonClick.appendChild(div)
    }
}

// Function to load todos from localStorage
async function getitem() {
    var Usersrid = localStorage.getItem("UserId");
    
    try {
        const snap = await firebase.database().ref("todos").child(Usersrid).get();
        if (snap.exists()) {
            console.log(snap.val());
            var values = Object.values(snap.val());
            console.log(values);  
           for (var item of values) {
                SetFirsttime(item);
            }
        } 
        else {
            console.log("No data available");
        }
        } 
        catch (error) {
        console.error("Error fetching data:", error);
        }
    
    Loading.style.display = "none";
    Datashow.style.display = "block";
}

console.log(firebase);
window.onload = function() {
    var userId = localStorage.getItem("UserId");
    if (userId) {
        console.log(userId);
        Getuserdata(); 
        getitem();
    } else {
        localStorage.clear(); // Clear the localStorage
        console.log("LocalStorage cleared");
        window.location.replace("Signup.html");
    }
};

async function Getuserdata(){
    var Usersrid = localStorage.getItem("UserId")
    await firebase.database().ref("user").child(Usersrid).get()
    .then((users)=>{
        var UserData = users.val()
        Name.innerText = UserData.Name
        email.innerText = UserData.Email
        console.log(UserData.photo)
        image.src = UserData.photo
        console.log(image) 
    })
    .catch((error)=>{
        console.log(error)
    })
}