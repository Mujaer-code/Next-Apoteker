const loginBox = document.querySelector('.login-box');
const loginOpacity = document.querySelector('.login-opacity');
const bodyLanding = document.querySelector('body');

function loginContainer() {
  bodyLanding.classList.add('login-body');
  openLogin();
}

function openLogin() {
    loginOpacity.classList.add('active');
}

function closeLogin() {
    loginOpacity.classList.remove('active');
    bodyLanding.classList.remove('login-body');
}


  function togglePassword() {
    if (password.type === "password") {
      password.type = "text"; // Show password
    } else {
      password.type = "password"; // Hide password
    }
  }



document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault(); 

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const scriptURL = 'https://script.google.com/macros/s/AKfycbyCvPT-g7YFelCv5OenY4m8YwyXYegKzExJepTsw-qonCuCR-rwdAW6AMJ5D3JLHbczPg/exec';

    const btn = document.querySelector('.submit');
    btn.innerText = "Keudeung Heula...";
    btn.disabled = true;

    fetch(scriptURL, {
        method: 'POST',
        body: JSON.stringify({ username: username, password: password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.href = "tryout.html"; 
        } else {
            alert('Gagal: ' + data.message);
            btn.innerText = "Login";
            btn.disabled = false;
        }
    })
    .catch(error => {
        console.error('Error!', error.message);
        alert('Terjadi kesalahan koneksi.');
        btn.innerText = "Login";
        btn.disabled = false;
    });
});

