const signupForm = document.querySelector('#signup-form');
const emailIn = document.querySelector('#email');
const passIn = document.querySelector('#password');
const retypeIn = document.querySelector('#retypePassword');

signupForm.addEventListener('submit', (event) => {
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
    console.log(user);
    // redirect to another HTML page
    window.location.href = './dashboard.html';
});