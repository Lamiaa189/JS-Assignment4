let loginBox = document.getElementById("login-box");
let header = document.querySelector("form h2");
let nameInputBox = document.getElementById("nameInputBox");
let signupLinkContainer = document.getElementById("signup-link");
let signinLinkContainer = document.getElementById("signin-link");
let loginPage = document.getElementById("loginSection");
let homePage = document.getElementById("home");
// Inputs
let nameInput = document.getElementById("name");
let emailInput = document.getElementById("email");
let passwordInput = document.getElementById("password");
let allInputs = document.querySelectorAll("input");
// Buttons
let loginBtn = document.getElementById("login");
let signupBtn = document.getElementById("signup");
let logoutBtn = document.getElementById("logout");
//  Links
let signupLink = document.querySelector("#signup-link a");
let signinLink = document.querySelector("#signin-link a");

let users = [];
let usersKey = "users";

let usersString = localStorage.getItem(usersKey);
users = JSON.parse(usersString) || [];

allInputs.forEach(input => {
    input.addEventListener("blur", () => checkFilledInput(input));
})

signupLink.addEventListener("click", showSignUpBlocks);
signinLink.addEventListener("click", showSigninBlocks);

signupBtn.addEventListener("click", createNewUser);
loginBtn.addEventListener("click", login);
logoutBtn.addEventListener("click", logout);

function login(e) {
    e.preventDefault();
    if(validateLoginInputs()) {
        let currentUser = users.find(user => user.email === emailInput.value.trim());
        loginPage.style.display = "none";
        homePage.style.display = "block";
        let welcomeMsg = document.createElement("h2");
        welcomeMsg.innerHTML = `Welcome ${currentUser.name}`;
        homePage.append(welcomeMsg)
        clearInputs();
    }
}

function logout() {
    let welcomeMsg = document.querySelector("#home h2");
    homePage.removeChild(welcomeMsg);
    loginPage.style.display = "flex";
    homePage.style.display = "none";
}

function showSignUpBlocks() {
    header.innerHTML = "Sign Up";
    nameInputBox.style.display = "block";
    loginBtn.style.display = "none";
    signupBtn.style.display = "block";
    signupLinkContainer.style.display = "none";
    signinLinkContainer.style.display = "block";
    clearInputs();
}

function showSigninBlocks() {
    header.innerHTML = "Login";
    nameInputBox.style.display = "none";
    loginBtn.style.display = "block";
    signupBtn.style.display = "none";
    signupLinkContainer.style.display = "block";
    signinLinkContainer.style.display = "none";
    clearInputs();
}

function createNewUser(e) {
    e.preventDefault();
    if(validateSignUpInputs()){
        let user = {
            name: nameInput.value,
            email: emailInput.value,
            password: passwordInput.value
        }
        users.push(user);
        localStorage.setItem(usersKey, JSON.stringify(users));
        showSigninBlocks();
    }
}

function validateName() {
    let pattern = /^[a-zA-Z\s]{3,}$/
    return pattern.test(nameInput.value.trim())
}

function validateEmail() {
    let pattern = /^([\w]+[-\.]*)+@([\w-]+\.)+[\w-]+$/
    return pattern.test(emailInput.value.trim())
}

function validatePassword() {
    let pattern = /^(?=.*[A-Z]).{6,}$/
    return pattern.test(passwordInput.value.trim())
}

function setError(element, message) {
    let inputControl = element.parentElement;
    let errorDiasplay = inputControl.querySelector(".invalid-feedback");
    errorDiasplay.innerHTML = message;
    if(message === "") {
        errorDiasplay.style.display = "none";
        inputControl.classList.remove("mb-5");
    } else {
        errorDiasplay.style.display = "block";
        inputControl.classList.add("mb-5");
    }
}

function validateSignUpInputs() {
    let name = nameInput.value.trim();
    let email = emailInput.value.trim();
    let password = passwordInput.value.trim();

    let isValid = {
        isValidName: true,
        isValidEmail: true,
        isValidPassword: true,
    }

    if(name === "") {
        setError(nameInput, "This field is required.");
        isValid.isValidName = false;
    } else if(!validateName()) {
        setError(nameInput, "Name must be at least 3 letters long.");
        isValid.isValidName = false;
    } else {
        setError(nameInput, "");
    }

    if(email === "") {
        setError(emailInput, "This field is required.");
        isValid.isValidEmail = false;
    } else if(!validateEmail()) {
        setError(emailInput, "Provide a valid email address.");
        isValid.isValidEmail = false;
    } else if(users.some(user => user.email === email)) {
        setError(emailInput, "This email already exists.");
        isValid.isValidEmail = false;
    }
     else {
        setError(emailInput, "");
    }

    if(password === "") {
        setError(passwordInput, "This field is required.");
        isValid.isValidPassword = false;
    } else if(!validatePassword()) {
        setError(passwordInput, "Password must be 6+ characters with at least 1 uppercase letter.");
        isValid.isValidPassword = false;
    } else {
        setError(passwordInput, "");
    }

    return isValid.isValidName && isValid.isValidEmail && isValid.isValidPassword;
}

function validateLoginInputs() {
    let email = emailInput.value.trim();
    let password = passwordInput.value.trim();

    let isValid = {
        isValidEmail: true,
        isValidPassword: true,
    }

    if(email === "") {
        setError(emailInput, "This field is required.");
        isValid.isValidEmail = false;
    } else if(!validateEmail()) {
        setError(emailInput, "Provide a valid email address.");
        isValid.isValidEmail = false;
    } else if(!users.some(user => user.email === email)) {
        setError(emailInput, "This email doesn't exist.");
        isValid.isValidEmail = false;
    }
    else {
        setError(emailInput, "");
    }

    if(password === "") {
        setError(passwordInput, "This field is required.");
        isValid.isValidPassword = false;
    } else if(isValid.isValidEmail) {
        let currentUser = users.find(user => user.email === email)
        if(currentUser !== undefined && currentUser.password === password) {
            setError(passwordInput, "");
        } else {
            isValid.isValidPassword = false;
            setError(passwordInput, "Invalid password.");
        }
    } else {
        isValid.isValidPassword = false;
        setError(passwordInput, "Invalid email.");
    }

    return isValid.isValidEmail && isValid.isValidPassword;
}

function clearInputs() {
    nameInput.value = "";
    emailInput.value = "";
    passwordInput.value = "";
    allInputs.forEach(input => checkFilledInput(input));
    setError(nameInput, "");
    setError(emailInput, "");
    setError(passwordInput, "");
}

function checkFilledInput(input) {
    if(input.value.trim() !== "") {
        input.classList.add("filled");
    } else {
        input.classList.remove("filled");
    }       
}