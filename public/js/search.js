document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.sort').addEventListener('click', function() {
        document.querySelector('.box_sort').classList.toggle('active');
    });
});

document.querySelectorAll('.item_ctg').forEach(item => {
    item.addEventListener('click', function () {
        document.querySelectorAll('.item_ctg').forEach(li => li.classList.remove('selected'));
        this.classList.add('selected');
    });
});

document.getElementById('search-btn').addEventListener('click', async function () {
    const query = document.getElementById('search-input').value;

    try {
        const response = await fetch(`/api/v1/search-books?phrase=${encodeURIComponent(query)}`);
        const data = await response.json();

        console.log('Dữ liệu trả về từ server:', data);

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
            const response = await fetch(`/api/v1/filter-books?genre=${encodeURIComponent(category)}`);
            const data = await response.json();

            console.log('Dữ liệu trả về từ server:', data);
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

    let listItems = ''; 

    data.forEach(book => {
        const bookItem = `
            <li class="item_book">
                <a href="/detail?id=${book.id}">
                    <img src="${book.coverPath}" alt="" width="84" height="95">
                </a>
                <div class="info">
                    <h4 class="name">${book.bookName}</h4>
                    <span class="author">${book.authorName}</span>
                </div>
            </li>`;
        listItems += bookItem;  // Thêm mỗi thẻ li vào biến listItems
    });

    listBookElement.innerHTML = listItems;  // Cập nhật nội dung cho listBookElement
}