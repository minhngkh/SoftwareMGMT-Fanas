
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