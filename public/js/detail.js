async function fetchGetFavorite(bookId) {
    try {
        const response = await fetch('/api/v1/favorite/' + bookId, {
            method:"GET"
        });

        console.log(response.status);
        if (response.status == 200){
            return true;
        }

        return false;
    } catch (error) {
        console.error('Error fetching favorite:', error);
    }
}      

async function fetchAddFavorite(bookId) {
    try {
        const response = await fetch('/api/v1/favorite/' + bookId, {
            method: 'POST'
        });

        console.log(response.status);

        if (response.status == 401){
            window.location.href = "/signin";
        }

        if (response.status == 200){
            // alert('Book added to favorite!');
            return true;
        }
        
        return false;
    } catch (error) {
        console.error('Error fetching favorite:', error);
        return false;
    }
}

async function fetchRemoveFavorite(bookId) {
    try {
        const response = await fetch('/api/v1/favorite/' + bookId, {
            method: 'DELETE'
        });
        // const data = await response.json();

        console.log(response.status);

        if (response.status == 401){
            window.location.href = "/signin";
        }

        if (response.status == 200){
            // alert('Book removed from favorite!');
            return true;
        }

        return false;
    } catch (error) {
        console.error('Error fetching favorite:', error);
        return false;
    }
}

async function fetchReviews(bookId) {
    try {
        const response = await fetch('/api/v1/reviews/' + bookId, {
            method: 'GET'
        });
        const data = await response.json();
        console.log(data);

        if (response.status == 401){
            window.location.href = "/signin";
        }

        if (response.status == 200){
            // alert('Book removed from favorite!');
            return data;
        }

        return [];
    } catch (error) {
        console.error('Error fetching favorite:', error);
        return [];
    }
}

const nonHeart = document.querySelector('.non-heart');
const heart = document.querySelector('.heart');
const urlParams = new URLSearchParams(window.location.search);
const bookId = urlParams.get('id');

nonHeart.addEventListener('click', async() => {
    let result = await fetchAddFavorite(bookId);
    if (result){
        nonHeart.classList.toggle('active');
        heart.classList.toggle('active');
    }
});

heart.addEventListener('click', async () => {
    let result = await fetchRemoveFavorite(bookId);
    if (result){
        nonHeart.classList.toggle('active');
        heart.classList.toggle('active');
    }
});

        
document.addEventListener('DOMContentLoaded', async function() {
    const bookId = urlParams.get('id');
    let result = await fetchGetFavorite(bookId);
    console.log(result);

    if (result) {
        nonHeart.classList.toggle('active');
        heart.classList.toggle('active');
    }

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
    
    const allReviews = await fetchReviews(bookId);
    const reviewsList = document.getElementById('reviews-list');

    const allReviewsHTML = allReviews.map((review) => {
        return `
            <li class="item-eval box-cmt f-cmt">
                <span style="color: #00000099; margin-bottom: 5px; font-size: 20px; font-weight: 600;">${review.userEmail}</span>
                <p style="color: #00000099; margin-bottom: 5px; font-size: 14px;">${review.createdAt}</p>
                <p style="font-weight: 700; margin-top: 15px;">
                    ${review.reviewContent}
                </p>
            </li>
        `
    })
    if(allReviews.length === 0) {
        reviewsList.innerHTML = `
            <div style="display: flex; justify-content: center; margin-top: 20px">
                <span style="color: #00000099; margin-bottom: 5px; font-size: 20px; font-weight: 600;">Không có bình luận</span>
            </div>
        `
    }else {
        reviewsList.innerHTML = allReviewsHTML.join('');
    }
});

// document.addEventListener('DOMContentLoaded', function () {
//     fetch('/detail')
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error('Network response was not ok');
//             }
//             return response.json();
//         })
//         .then(data => {
//             // Cập nhật nội dung trang web với dữ liệu nhận được
//             document.querySelector('.info_book img').src = data.detail.coverPath;
//             document.querySelector('.info_book h4').textContent = data.detail.bookName;
//             document.querySelector('.info_book .actor').textContent = data.author.name;
//             document.querySelector('.footer-info p').textContent = data.detail.description;
//             document.querySelector('.box-info img').src = data.author.avatarPath;
//             document.querySelector('.box-info .name-au h5').textContent = data.author.name;
//             document.querySelector('.box-info .name-au span').textContent = '40 Sách'; //có thể thay đổi
//             document.querySelector('.box-info p').textContent = data.author.description;
//             document.querySelector('.header_cost-info span:last-of-type').textContent = `${data.detail.price}đ`; 
//             document.querySelector('.box-temp1').innerHTML = data.detail.genres.map(genre => `<span class="ctg">${genre}</span>`).join('');
//         })
//         .catch(error => {
//             console.error('Error fetching the detail:', error);
//         });
// });