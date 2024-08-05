       
async function fetchAddFavorite(bookId) {
    try {
        const response = await fetch('/api/v1/favorite', {
            method: 'POST',
            body: JSON.stringify({bookId: bookId})
        });

        console.log(response);

        if (response.status == 401){
            window.location.href = "/signin";
            return;
        }
        
        const data = await response.json();
        console.log(data);

        if (data){
            alert('Book added to favorite!');
        }
        
    } catch (error) {
        console.error('Error fetching favorite:', error);
    }
}

async function fetchRemoveFavorite(bookId) {
    try {
        const response = await fetch('/api/v1/favorite', {
            method: 'DELETE',
            body: JSON.stringify({bookId: bookId})
        });
        // const data = await response.json();

        console.log(response);

        if (response.status == 401){
            window.location.href = "/signin";
            return;
        }
        
        const data = await response.json();
        console.log(data);

        if (data){
            alert('Book removed from favorite!');
        }
        
    } catch (error) {
        console.error('Error fetching favorite:', error);
    }
}

const nonHeart = document.querySelector('.non-heart');
        const heart = document.querySelector('.heart');
        const urlParams = new URLSearchParams(window.location.search);
        const bookId = urlParams.get('id');

        nonHeart.addEventListener('click', () => {
            nonHeart.classList.toggle('active');
            heart.classList.toggle('active');
            fetchAddFavorite(bookId);
        });

        heart.addEventListener('click', () => {
            nonHeart.classList.toggle('active');
            heart.classList.toggle('active');
            fetchRemoveFavorite(bookId);
        });

        
document.addEventListener('DOMContentLoaded', function() {
    const ratingGroups = document.querySelectorAll('.rating-group');

    ratingGroups.forEach(group => {
        const stars = group.querySelectorAll('.fa-star');
        let currentRating = 0;

        stars.forEach(star => {
            star.addEventListener('mouseover', handleMouseOver);
            star.addEventListener('mouseout', handleMouseOut);
            star.addEventListener('click', handleClick);
        });

        function handleMouseOver(event) {
            const value = parseInt(event.target.getAttribute('data-value'));
            fillStars(value, stars);
        }

        function handleMouseOut() {
            fillStars(currentRating, stars);
        }

        function handleClick(event) {
            const value = parseInt(event.target.getAttribute('data-value'));
            if (value === currentRating) {
                currentRating = 0; // Reset rating if the same star is clicked
            } else {
                currentRating = value;
            }
            fillStars(currentRating, stars);
        }

        function fillStars(value, stars) {
            stars.forEach(star => {
                if (parseInt(star.getAttribute('data-value')) <= value) {
                    star.classList.remove('fa-regular');
                    star.classList.add('fa-solid');
                } else {
                    star.classList.remove('fa-solid');
                    star.classList.add('fa-regular');
                }
            });
        }
    });
});

 