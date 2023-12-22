document.addEventListener("DOMContentLoaded", function () {

    /*const classesData = [
        { name: "Lớp Toán Cơ Bản", time: "Thứ Hai, 18:00 - 20:00", tutor: "Nguyễn Văn A" },
        { name: "Lớp Tiếng Anh Giao Tiếp", time: "Thứ Ba, 17:00 - 19:00", tutor: "Trần Thị B" },
        { name: "Lớp Tiếng Anh Giao Tiếp", time: "Thứ Ba, 17:00 - 19:00", tutor: "Trần Thị C" },
        { name: "Lớp Tiếng Anh Giao Tiếp", time: "Thứ Ba, 17:00 - 19:00", tutor: "Trần Thị D" },
        { name: "Lớp Tiếng Anh Giao Tiếp", time: "Thứ Ba, 17:00 - 19:00", tutor: "Trần Thị E" },
      

    ];
    */

    // Số lớp hiển thị trên mỗi trang
    const classesPerPage = 4;
    let totalPages = 0;
    let Classes = '';
    // Hàm tính toán số lượng trang
    function calculateTotalPages(classes) {
        return Math.ceil(classes.length / classesPerPage);
    }
    function getClassesData(pageNumber) {
        const whereCondition = 'start_time > NOW() AND isBooked = 0';
        fetch('http://localhost:3000/api/get_classes?where=' + encodeURIComponent(whereCondition))
            .then(response => response.json())
            .then(classesData => {
                 totalPages = calculateTotalPages(classesData);
                Classes = classesData;
                displayClasses(pageNumber, classesData, totalPages);
                displayPagination(totalPages, classesData);
            })
            .catch(error => console.error('Error:', error));
    }
    // Hàm hiển thị danh sách lớp theo trang
    function displayClasses(pageNumber, classes) {
        const startIndex = (pageNumber - 1) * classesPerPage;
        const endIndex = startIndex + classesPerPage;
        const currentClasses = classes.slice(startIndex, endIndex);

        const classListContainer = document.getElementById("classList");
        classListContainer.innerHTML = "";

        currentClasses.forEach((classData, index) => {
            const start_time = new Date(classData.start_time);
            const end_time = new Date(classData.end_time);
            const options = { day: 'numeric', month: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: false };
            const option_2 = {hour: 'numeric', minute: 'numeric',  hour12: false };
            const start_formattedDate = new Intl.DateTimeFormat('en-US', options).format(start_time);
            const end_formattedDate = new Intl.DateTimeFormat('en-US', option_2).format(end_time);
            const classItem = document.createElement("article");
            classItem.classList.add("class-item");

            classItem.innerHTML = `
                <h2>${classData.class_name}</h2>
                <p class="class-info">Thời gian: ${start_formattedDate} - ${end_formattedDate}</p>
                <p class="class-info">Gia Sư: ${classData.fullname}</p>
                <p class="class-info">Địa chỉ: Phường ${classData.ward}, Quận/TP ${classData.district}</p>
                <p class="class-info">Lớp: ${classData.grade}</p> <p class="class-info">Môn: ${classData.subName}</p>
                <button class="class-btn">Xem chi tiết</button>
            `;

            // Thêm sự kiện click cho nút "Đặt Lịch Học"
            const classButton = classItem.querySelector(".class-btn");
            classButton.addEventListener("click", () => showConfirmation(classData.classID));

            classListContainer.appendChild(classItem);
        });
    }

    // Hàm hiển thị phân trang
    function displayPagination(totalPages,classesData) {
        const paginationContainer = document.getElementById("pagination");
        paginationContainer.innerHTML = "";

        for (let i = 1; i <= totalPages; i++) {
            const pageLink = document.createElement("a");
            pageLink.href = "#";
            pageLink.textContent = i;

            pageLink.addEventListener("click", () => {
                displayClasses(i, classesData);
            });

            paginationContainer.appendChild(pageLink);
        }
    }

    // Hàm hiển thị hộp thoại xác nhận
    function showConfirmation(classID) {
        //const classData = Classes[index];
        //const confirmation = confirm(`Bạn có chắc chắn muốn đăng ký lớp học "${classID}" không?`);

            window.location.href = `class_detail.html?classID=${classID}`;
    }
    window.applyFilters = function () {
        const searchInputValue = document.getElementById("searchInput").value.toLowerCase();
        const districtFilterValue = document.getElementById("districtFilter").value;
        const subjectFilterValue = document.getElementById("subjectFilter").value;
        const gradeFilterValue = document.getElementById("gradeFilter").value;

        // Lọc dữ liệu dựa trên các giá trị của ô tìm kiếm và bộ lọc
        const filteredClasses = Classes.filter(classData => {
            const classNameIncludes = classData.class_name.toLowerCase().includes(searchInputValue);
            const districtMatches = districtFilterValue === "" || classData.district === districtFilterValue;
            const subjectMatches = subjectFilterValue === "" || classData.subName === subjectFilterValue;
            const gradeMatches = gradeFilterValue === "" || classData.grade === gradeFilterValue;

            return classNameIncludes && districtMatches && subjectMatches && gradeMatches;
        });

        // Hiển thị danh sách lớp học đã lọc
        totalPages = calculateTotalPages(filteredClasses);
        displayClasses(1, filteredClasses);
        displayPagination(totalPages, filteredClasses);
    };
    // Tính toán số trang
    //const totalPages = calculateTotalPages(classesData);

    // Hiển thị trang đầu tiên khi trang web được tải
   // displayClasses(1, classesData);

    // Hiển thị phân trang
   // displayPagination(totalPages);
   function updateRealTimeData() {
    setInterval(() => {
        //code lấy giá trị mà page đang xem
        getClassesData(1);
    }, 60000);
}

// Khi trang web được tải, lấy dữ liệu và khởi động cập nhật thời gian thực
    getClassesData(1);
    updateRealTimeData();
});


// -----------phần get api
//load thông tin người dùng:
function handleSession() {
    fetch('http://localhost:3000/api/authenticated_routes/user_info')
        .then(response => response.json())
        .then(data => {
            if(data.message ==='Unauthorized'){
                alert(data.message);
                window.location.replace('./index.html');
            }
            if (data.userId) {
                // Nếu đã đăng nhập
                
                document.querySelector('.dropdown').style.visibility = 'visible'; // Hiển thị dropdown
                document.querySelector('.welcomeUsername p').innerText = data.username; // Hiển thị username
                document.querySelector('.welcomeUsername').style.visibility = 'visible'; // Hiển thị phần welcomeUsername
                const educationSelect = document.getElementById('education');
                if(data.role===0){
                    document.getElementById('btn_createClass').style.display = 'none'; //ẩn với student
                }
                else{
                    document.getElementById('btn_registeredClass').style.display = 'none'; //ẩn với tutor

                    
                }

                document.getElementById('ref_editprofile').href = './reg_GS.html'
                
            } else {
                // Nếu chưa đăng nhập
                
                document.querySelector('.dropdown').style.visibility = 'hidden'; // Ẩn dropdown
                document.querySelector('.welcomeUsername').style.visibility = 'hidden'; // Ẩn phần welcomeUsername
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// Gọi hàm kiểm tra session khi trang được load
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('btn_registeredClass').addEventListener('click', function(){
        // Chuyển hướng đến trang registered.html
        window.location.href = './registered.html';
    });
    // Kiểm tra session và load thông tin người dùng nếu đã đăng nhập
    handleSession();
});
