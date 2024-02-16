const loginForm = document.getElementById('loginForm')

loginForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const username = loginForm['username'].value
    const password = loginForm['password'].value

    loginUser(username,password) 
})

async function loginUser(username,password){
    const url = 'http://localhost:5000/login'
    const data = {
        username,
        password
    }
    try {
        const response = await fetch(url, {
            method: "POST", 
            mode: "cors", 
            cache: "no-cache", 
            credentials: "same-origin", 
            headers: {
              "Content-Type": "application/json",
              // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify(data), 
          });
          const result = await response.json();
          console.log(result);
          if (result.status === true) {

            window.location.href = '/';
            const loggedInUsername = getUsernameFromToken(); 
        }
    } catch (error) {
        console.log(error);
    }

}

function getTokenFromCookie() {
    const cookieString = document.cookie;
    const cookies = cookieString.split('; ');
    const tokenCookie = cookies.find(cookie => cookie.startsWith('token='));
    return tokenCookie ? tokenCookie.split('=')[1] : null;
}

function getUsernameFromToken() {
    const token = getTokenFromCookie();
    if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.username;
    }
    return null;
}

