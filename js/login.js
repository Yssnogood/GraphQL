import { homePage } from "./home.js";

document.addEventListener("DOMContentLoaded", async () => {
    let token = getCookie("authToken");

    if (token) {
        console.log("Token found, logging in automatically...");
        try {
            homePage();
        } catch (error) {
            console.error("Invalid or expired token, clearing cookie.", error);
            document.cookie = "authToken=; path=/; max-age=0";
        }
    }
});

document.getElementById("login-button").addEventListener("click", login);

function showMessage(message, isError = false) {
    const messageDiv = document.getElementById("login-message");
    messageDiv.textContent = message;
    messageDiv.style.color = isError ? "#e74c3c" : "#2ecc71";
    messageDiv.style.marginTop = "10px";
    messageDiv.style.fontWeight = "bold";
}

export async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username && password) {
        try {
            console.log("Logging in...");
            const token = await submitLoginForm(username, password);
            document.cookie = `authToken=${token}; path=/; max-age=${60 * 60}; Secure`;
            showMessage(""); // Clear any previous error
            homePage();
        } catch (error) {
            showMessage("Login failed. Please check your credentials.", true);
            console.error("Login failed:", error);
        }
    } else {
        showMessage("Username and password are required.", true);
    }
}

export async function submitLoginForm(username, password) {
    const credentials = btoa(`${username}:${password}`);
    const response = await fetch('https://zone01normandie.org/api/auth/signin', {
        method: 'POST',
        headers: {
            'Content-Type': "application/json",
            'Authorization': `Basic ${credentials}`
        }
    });

    const data = await response.json();
    if (!response.ok) {
        console.error('Login response:', data);
        throw new Error('Failed to login');
    }
    console.log("Login successful, token received.");
    return data;
}

export function getCookie(name) {
    const cookies = document.cookie.split('; ');
    for (let cookie of cookies) {
        let [key, value] = cookie.split('=');
        if (key === name) return value;
    }
    return null;
}

export function logoutButton() {
    const left_bar = document.getElementById("left-box");

    const existing = document.getElementById("logout-button");
    if (existing) existing.remove();

    const logout = document.createElement("button");
    logout.id = "logout-button";
    logout.textContent = "Logout";

    logout.style.padding = "10px 20px";
    logout.style.marginTop = "10px";
    logout.style.border = "none";
    logout.style.borderRadius = "8px";
    logout.style.backgroundColor = "#e74c3c";
    logout.style.color = "#fff";
    logout.style.cursor = "pointer";
    logout.style.fontSize = "14px";
    logout.style.transition = "background-color 0.3s ease";

    logout.addEventListener("mouseenter", () => {
        logout.style.backgroundColor = "#c0392b";
    });
    logout.addEventListener("mouseleave", () => {
        logout.style.backgroundColor = "#e74c3c";
    });

    logout.addEventListener("click", () => {
        const confirmLogout = confirm("Are you sure you want to log out?");
        if (confirmLogout) {
            document.cookie = "authToken=; path=/; max-age=0";
            location.reload();
        }
    });

    left_bar.appendChild(logout);
}
