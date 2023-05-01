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
        pwd: passIn.value,
    };
    
    // ROUTING 
    // have user object into json 
    const res = await fetch('/signup', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(user)
    });
    // redirect
    if (!res.ok) {
        throw new Error('Signup failed.');
    }
        //window.location.href = '/dashboard.html';
    window.location.href = '/dashboard.html';

});