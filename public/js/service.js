const registerForm = document.getElementById('registerForm')

registerForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const terms = registerForm['terms'].checked
    if(!terms){
        console.log('Must accept terms and condition');
        return
    }
    const username = registerForm['username'].value
    const password = registerForm['password'].value
    const rePassword = registerForm['rePassword'].value
    const email = registerForm['email'].value

    registerNewUser(username, email, password, rePassword)   
})


async function registerNewUser(username, email, password, rePassword){
    const isValid = validateInput(username, email, password, rePassword)
    const url = 'http://localhost:5000/register'
    if(!isValid){
        console.log('Enter correct details');
    }
    const data = {
        username,
        email,
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
            window.location.href = '/login?user='+result.user.username;
        }
    } catch (error) {
        console.log(error);
    }
}

function validateInput(username, email, password, rePassword){
    return true
}

