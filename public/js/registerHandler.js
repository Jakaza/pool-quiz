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
    // Add your validation logic here
    return true; // Temporary, replace with actual validation
}
