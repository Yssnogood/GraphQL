import { homePage } from "./home.js";

document.addEventListener("DOMContentLoaded", async () => {
    let token = getCookie("authToken"); // Check if token exists

    if (token) {
        console.log("Token found, logging in automatically...");
        try {
            //await console.log(fetchGraphFieldsInfo(token))
            homePage()
        } catch (error) {
            console.error("Invalid or expired token, clearing cookie.", error);
            document.cookie = "authToken=; path=/; max-age=0"; // Clear the cookie
        }
    }
});

document.getElementById("login-button").addEventListener("click", login);

export async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (username && password) {
        try {
            console.log("Logging in...");
            const token = await submitLoginForm(username, password);
            
            // Store token in a cookie (expires in 1 hour)
            document.cookie = `authToken=${token}; path=/; max-age=${60 * 60}; Secure`;

            // Call homePage or redirect
            homePage();
        } catch (error) {
            console.error("Login failed:", error);
        }
    } else {
        console.log("Username and password are required.");
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

// Function to get a cookie by name
export function getCookie(name) {
    const cookies = document.cookie.split('; ');
    for (let cookie of cookies) {
        let [key, value] = cookie.split('=');
        if (key === name) return value;
    }
    return null;
}
