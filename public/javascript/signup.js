async function signupFormHandler(event) {
    event.preventDefault();

    const alias = document.querySelector('#username-signup').value.trim();
    const email = document.querySelector('#email-signup').value.trim();
    const password = document.querySelector('#password-signup').value.trim();

    if (alias && email && password) {

        const response = await fetch('/api/users', {
            method: 'POST',
            body: JSON.stringify({
                alias,
                email,
                password
            }),
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            document.location.replace('/dashboard');
        } else {
            alert(response.statusText);
        }
        
    }
}

document.querySelector('#signup-form').addEventListener('submit', signupFormHandler);