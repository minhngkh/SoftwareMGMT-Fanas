document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.sort').addEventListener('click', function() {
        document.querySelector('.box_sort').classList.toggle('active');
    });
});
document.getElementById('search-btn').addEventListener('click', async function () {
    const query = document.getElementById('search-input').value;

    try {
        const response = await fetch(`/search?query=${encodeURIComponent(query)}`);
        const data = await response.json();

        // Cập nhật danh sách sách hiển thị
        updateSearchResults(data);
    } catch (error) {
        console.error('Error:', error);
    }
});
document.querySelectorAll('.item_ctg').forEach(item => {
    item.addEventListener('click', async function () {
        const category = this.innerText;

        try {
            const response = await fetch(`/search?category=${encodeURIComponent(category)}`);
            const data = await response.json();

            // Cập nhật danh sách sách hiển thị
            updateSearchResults(data);
        } catch (error) {
            console.error('Error:', error);
        }
    });
});

function updateSearchResults(data) {
    const listBookElement = document.querySelector('.list_book');
    listBookElement.innerHTML = '';  // Xóa nội dung cũ

    data.forEach(book => {
        const bookItem = `
            <li class="item_book">
                <img src=" ${book.imageUrl} " alt="" width="84" height="95">
                <div class="info">
                    <h4 class="name">${book.name}</h4>
                    <span class="author">${book.author}</span>
                    <span class="rate">
                        ${book.rating}
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-regular fa-star"></i>
                    </span>
                </div>
            </li>`;
        listBookElement.innerHTML += bookItem;
    });
}