const registerForm = document.getElementById('registerForm');

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const terms = registerForm['terms'].checked;
    if (!terms) {
        console.error('Must accept terms and conditions');
        return;
    }

    const username = registerForm['username'].value;
    const password = registerForm['password'].value;
    const rePassword = registerForm['rePassword'].value;
    const email = registerForm['email'].value;

    try {
        const isValid = validateInput(username, email, password, rePassword);
        if (!isValid) {
            console.error('Enter correct details');
            return;
        }

        const url = 'http://localhost:5000/register';
        const data = {
            username,
            email,
            password
        };

        const response = await fetch(url, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        console.log(result);

        if (result.status === true) {
            window.location.href = `/login?user=${result.user.username}`;
        }
    } catch (error) {
        console.error(error);
    }
});

function validateInput(username, email, password, rePassword) {
    if (!username || !email || !password || !rePassword) {
        console.error('All fields are required');
        return false;
    }
    if (username.length < 3 || username.length > 30) {
        console.error('Username must be between 3 and 30 characters');
        return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        console.error('Invalid email address');
        return false;
    }
    if (password.length < 5 || password.length > 30) {
        console.error('Password must be between 5 and 30 characters');
        return false;
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
        console.error('Password must contain at least one uppercase letter, one lowercase letter, and one digit');
        return false;
    }
    if (password !== rePassword) {
        console.error('Passwords do not match');
        return false;
    }
    return true;
}

