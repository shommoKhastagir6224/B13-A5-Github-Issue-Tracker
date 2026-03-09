console.log("login functionality coming soon....");

function login() {
    const inputNumber = document.getElementById("inputName").value;
    const inputPin = document.getElementById("input-pin").value;

    if (inputNumber === "admin" && inputPin === "admin123") {
        alert("Login successful");
        // window.location.assign("../home.html");
        window.location.assign("https://shommokhastagir6224.github.io/B13-A5-Github-Issue-Tracker/home.html");

    } else {
        alert("Invalid credentials");
        return
    }
}

// Click event
document.getElementById("login-btn").addEventListener("click", login);

// Enter key event on password field
document.getElementById("input-pin").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        login();
    }
});
