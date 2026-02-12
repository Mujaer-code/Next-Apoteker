const menuLinks = document.querySelectorAll('.menu a');
const currentUrl = window.location.href;

menuLinks.forEach(link => {
    link.classList.remove('active');

    if (currentUrl.includes(link.getAttribute('href'))) {
        link.classList.add('active');
    }
});


function startExam () {
    window.location.href = "tryout.html";
}