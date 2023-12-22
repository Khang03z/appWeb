document.addEventListener('DOMContentLoaded', function () {
    // Thêm hiệu ứng scroll khi nhấp vào menu
    document.querySelectorAll('.menu-nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            // Chuyển hướng đến đường dẫn của menu item
            window.location.href = this.getAttribute('href');
        });
    });

    // Hiệu ứng khi rê chuột qua các thành phần
    const introSections = document.querySelectorAll('.nav-introduction .nav-intro1, .nav-introduction .nav-intro2');
    introSections.forEach(section => {
        section.addEventListener('mouseover', function () {
            this.classList.add('hover');
        });

        section.addEventListener('mouseout', function () {
            this.classList.remove('hover');
        });
    });

    // Lấy reference đến các nút "Đăng ký làm gia sư" và "Đăng ký thuê gia sư"
    var registerTutorButton = document.querySelector('.for-GS');
    var registerStudentButton = document.querySelector('.Reg-GS');

    // Thêm sự kiện click cho nút "Đăng ký làm gia sư"
    registerTutorButton.addEventListener('click', function () {
        // Chuyển hướng đến trang form_register.html
        window.location.href = 'form_register.html';
    });

    registerStudentButton.addEventListener('click', function () {
        // Chuyển hướng đến trang form_register.html
        window.location.href = 'form_register.html';
    });

    // Thêm sự kiện click cho nút "Đăng ký thuê gia sư"
   // registerStudentButton.addEventListener('click', function () {
        // Chuyển hướng đến trang form_register.html
    //    window.location.href = 'form_register.html';
    //});
});


