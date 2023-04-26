const signupForm = document.querySelector('#signup-form');
const emailIn = document.querySelector('#email');
const passIn = document.querySelector('#password');
const retypeIn = document.querySelector('#retypePassword');

signupForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!emailIn.value || !passIn.value || !retypeIn.value) {
        alert('Missing inputs.');
        return;
    } 
    if (passIn.value !== retypeIn.value) {
        alert('Passwords do not match.');
        return;
    }
    const user = {
        email: emailIn.value,
        password: passIn.value,
    };
    
    // ROUTING 
    // have user object into json 
    try {
        const res = await fetch('/signup', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(user),
        });
        // redirect to the dashboard
        if (res.redirected) {
            window.location.href = res.url;
        } else {
            alert('Failed to sign up.');
        }
    } catch (err) {
        // send login error
        console.log(err);
        alert('Failed to sign up.');
    }
});