function toggleFooterInfo() {
    const footerInfo = document.getElementById('footer-info');
    footerInfo.classList.toggle('open');
}
const nonHeart = document.querySelector('.non-heart');
        const heart = document.querySelector('.heart');

        nonHeart.addEventListener('click', () => {
            nonHeart.classList.toggle('active');
            heart.classList.toggle('active');
        });

        heart.addEventListener('click', () => {
            nonHeart.classList.toggle('active');
            heart.classList.toggle('active');
        });