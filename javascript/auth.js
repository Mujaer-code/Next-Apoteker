function checkLogin() {
    const loginTime = localStorage.getItem('loginTime');
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const deadline = 20 * 60 * 1000; 
    const now = new Date().getTime();

    if (!isLoggedIn || !loginTime) {
        if (!window.location.pathname.includes("index.html")) {
            window.location.href = "index.html";
        }
        return;
    }
    if (now - loginTime > deadline) {
        localStorage.clear();
        alert("Sesi habis, silakan login kembali.");
        window.location.href = "index.html";
    } else {
        localStorage.setItem('loginTime', now);

        if (window.location.pathname.includes("index.html") || window.location.pathname === "/") {
            window.location.href = "dashboard.html";
        }
    }
}

let lastUpdate = 0;
let updateTimeidle = 10 * 60 * 1000;
['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(name => {
    document.addEventListener(name, () => {
        const now = new Date().getTime();
        
        if (now - lastUpdate > updateTimeidle) { 
            const isLoggedIn = localStorage.getItem('isLoggedIn');
            if (isLoggedIn) {
                localStorage.setItem('loginTime', now);
                lastUpdate = now;
                console.log("Session extended"); 
            }
        }
    });
});

checkLogin();

document.addEventListener('DOMContentLoaded', function() {
    const logoutBtn = document.querySelector('.logout a');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault(); 
            localStorage.clear();
            window.location.href = "index.html";
        });
    }
});