// Thêm vào phần JavaScript của bạn hoặc tạo một tệp JS mới
const postsPerPage = 2; // Số bài viết mỗi trang
const posts = [
    {
        title: "Cách nhận biết trung tâm gia sư uy tín",
        date: "09/12/2023",
        excerpt: "Thuê gia sư qua trung tâm là hình thức phổ biến được nhiều cha mẹ lựa chọn.",
    },
    {
        title: "Lưu ý về chế độ sinh hoạt hằng ngày của con",
        date: "10/12/2023",
        excerpt: "Đây là phần đầu của bài báo khác. Nội dung ngắn gọn để hấp dẫn độc giả ",
    },

];

const totalPosts = posts.length;
let currentPage = 1;

function showPosts(page) {
    const startIndex = (page - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const currentPosts = posts.slice(startIndex, endIndex);

    const contentSection = document.getElementById("main-content");
    contentSection.innerHTML = "";

    currentPosts.forEach(post => {
        const article = document.createElement("article");
        article.classList.add("blog-post");
        article.innerHTML = `
            <div>
                <h2 class="post-title">${post.title}</h2>
                <p class="post-meta">Ngày đăng: ${post.date}</p>
            </div>
            <img src="./image/canhcut.ico" alt="Ảnh minh họa" class="post-image">
            <p class="post-excerpt">${post.excerpt}</p>
        `;
        article.addEventListener("click", () => showFullPost(post));
        contentSection.appendChild(article);
    });
}

// Trong tệp script.js
function showFullPost(postId) {
    // Chuyển đổi postId thành chuỗi
    let postIdString = postId.toString();

    // Tạo URL của bài viết chi tiết
    let postUrl = `full-post-${postIdString}.html`;

    // Gọi hàm để lấy nội dung của bài viết từ server hoặc từ tệp HTML
    fetch(postUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
            return response.text();
        })
        .then(data => {
            // Hiển thị nội dung bài viết chi tiết trong phần tử có id="full-post-content"
            document.getElementById('full-post-content').innerHTML = data;
            // Ẩn danh sách các bài viết khi hiển thị chi tiết bài viết
            document.getElementById('main-content').style.display = 'none';
        })
        .catch(error => console.error('Error:', error));
}


function createPagination() {
    const pagination = document.getElementById("pagination");
    const totalPages = Math.ceil(totalPosts / postsPerPage);

    for (let i = 1; i <= totalPages; i++) {
        const pageLink = document.createElement("div");
        pageLink.classList.add("page-link");
        pageLink.textContent = i;
        pageLink.addEventListener("click", () => {
            currentPage = i;
            showPosts(currentPage);
            updatePagination();
        });

        pagination.appendChild(pageLink);
    }

    updatePagination();
}

function updatePagination() {
    const pageLinks = document.querySelectorAll(".page-link");
    pageLinks.forEach((link, index) => {
        if (index + 1 === currentPage) {
            link.style.backgroundColor = "#007BFF";
            link.style.color = "white";
        } else {
            link.style.backgroundColor = "white";
            link.style.color = "#007BFF";
        }
    });
}

// Trong tệp script.js
function goBack() {
    // Ẩn phần tử hiển thị nội dung chi tiết bài viết
    document.getElementById('full-post-content').style.display = 'none';
    // Hiển thị danh sách các bài viết
    document.getElementById('main-content').style.display = 'block';
}

// Hiển thị trang đầu tiên khi trang web được tải
showPosts(currentPage);
createPagination();
