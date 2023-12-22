document.addEventListener('DOMContentLoaded', function () {
    // Gọi hàm để lấy thông tin các lớp từ server
    getAllClasses();
});

function getAllClasses() {
    // Gửi yêu cầu GET đến server
    fetch('/api/getAllClasses')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Nếu yêu cầu thành công, hiển thị dữ liệu trên bảng
                displayClasses(data.classes);
            } else {
                console.error('Lỗi:', data.message);
            }
        })
        .catch(error => {
            console.error('Lỗi:', error);
            alert('Có lỗi xảy ra khi lấy thông tin lớp.');
        });
}

function displayClasses(classes) {
    var tbody = document.getElementById('registeredClassesBody');
    tbody.innerHTML = ''; // Xóa dữ liệu cũ trong bảng

    for (var i = 0; i < classes.length; i++) {
        addDataToTable(classes[i], tbody);
    }
}

function addDataToTable(data, tbody) {
    var row = document.createElement('tr');

    // ID lớp
    var classIDCell = document.createElement('td');
    classIDCell.textContent = data.classID;
    row.appendChild(classIDCell);

    // Tên lớp
    var classNameCell = document.createElement('td');
    classNameCell.textContent = data.class_name;
    row.appendChild(classNameCell);

    var startDateCell = document.createElement('td');
// Giả sử data.start_time là một chuỗi ngày thời gian, ví dụ: "2023-12-20T10:30:00"
    var startDate = new Date(data.start_time);
    var formattedDate = startDate.toLocaleDateString(); // Chuyển định dạng ngày

    startDateCell.textContent = formattedDate;
    row.appendChild(startDateCell);

    // Ghi chú
    var noteCell = document.createElement('td');
    noteCell.textContent = data.detail;
    row.appendChild(noteCell);

    // Gia sư
    var tutorCell = document.createElement('td');
    tutorCell.textContent = data.tutorID;
    row.appendChild(tutorCell);

    // SĐT gia sư
    var tutorPhoneCell = document.createElement('td');
    tutorPhoneCell.textContent = data.tutorID; // Note: Đây có thể cần được thay đổi nếu có dạng thuộc tính khác chứa SĐT của gia sư
    row.appendChild(tutorPhoneCell);

    // Tình trạng
    var statusCell = document.createElement('td');
    statusCell.textContent = data.isBooked === 1 ? 'Đã đặt' : 'Chưa đặt';
    row.appendChild(statusCell);

    // Đánh giá
    var ratingCell = document.createElement('td');
    var rating = data.rating || 0;

    for (var j = 0; j < 5; j++) {
        var starIcon = document.createElement('span');
        starIcon.innerHTML = j < rating ? '★' : '☆';
        starIcon.addEventListener('click', function () {
            displayRatingModal(data.classID, rating, this);
        });
        ratingCell.appendChild(starIcon);
    }


    row.appendChild(ratingCell);
    addCancelClassButton(row, data);
    tbody.appendChild(row);
}


function displayRatingModal(classID, currentRating, clickedStar) {
     // Hiển thị hộp thoại xác nhận
     var confirmRating = confirm('Bạn có chắc chắn muốn đánh giá không?');

     if (confirmRating) {
         var newRating = Array.from(clickedStar.parentNode.children).indexOf(clickedStar) + 1;
         rateTutor(classID, newRating);
 
         Array.from(clickedStar.parentNode.children).forEach(function (star, index) {
             star.innerHTML = index < newRating ? '★' : '☆';
         });
     } else {
         // Người dùng đã bấm "Không", hiển thị thông báo trong phần tử div
         displayNotification('Người dùng đã hủy đánh giá.', 'error');
     }
}
// Trong hàm rateTutor của script.js
function rateTutor(classID, rating) {
    fetch('/api/rateTutor', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ classID, rating }),
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        if (data.success) {
            // Đánh giá thành công
            displayNotification('Đánh giá đã được cập nhật thành công.', 'success');
        } else {
            // Đánh giá không thành công
            //displayNotification('Bạn chưa học xong lớp này, không thể đánh giá.', 'error');
            alert('Bạn chưa học xong lớp này, không thể đánh giá.')
            window.location.reload();
        }
    })
    .catch(error => {
        console.error('Lỗi:', error);
        alert('Có lỗi xảy ra: ' + error.message); // Hiển thị thông báo lỗi
    });
}


// Thêm vào đoạn mã JavaScript của bạn
function displayNotification(message, isError) {
    // Lấy phần tử div thông báo
    var notificationDiv = document.getElementById('notification');

    // Tạo một thẻ p chứa thông báo
    var notificationMessage = document.createElement('p');
    notificationMessage.textContent = message;

    // Thêm class 'error' nếu là thông báo lỗi
    if (isError) {
        notificationMessage.classList.add('error');
    }


    notificationDiv.innerHTML = '';
    notificationDiv.appendChild(notificationMessage);


    setTimeout(function () {
        notificationDiv.innerHTML = '';
    }, 5000); 
}





function updateIsBooked(classID) {
    // Gửi request đến server để hủy lớp
    fetch('/api/cancelClass', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ classID }),
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        if (data.success) {
            // Hủy lớp thành công, hiển thị thông báo
            alert('Lớp đã được hủy thành công.');

            window.location.reload();
        } else {
            // Xử lý nếu có lỗi
            console.error('Lỗi:', data.message);
            alert('Bạn không thể hủy lớp này');
            window.location.reload();
        }
    })
    .catch(error => {
        console.error('Lỗi:', error);
        alert('Có lỗi xảy ra: ' + error.message); // Hiển thị thông báo lỗi
    });
}



function addCancelClassButton(row, classInfo) {
    var cancelButtonCell = document.createElement('td');
    var cancelButton = document.createElement('button');
    cancelButton.textContent = 'Hủy lớp';
    cancelButton.className = 'cancel-button';

    // Kiểm tra giá trị isBooked trước khi hiển thị nút
    if (classInfo.isBooked) {
        // Nếu đã đặt học, hiển thị nút hủy lớp
        cancelButton.addEventListener('click', function () {
            // Gọi hàm để cập nhật trạng thái isBooked
            updateIsBooked(classInfo.classID);
            
            // Sau khi gọi hàm updateIsBooked, có thể thực hiện các hành động khác ở đây
            // Ví dụ: ẩn nút, cập nhật giao diện, v.v.
            cancelButton.style.display = 'none';
        });
    } else {
        // Nếu chưa đặt học, ẩn nút hủy lớp
        cancelButton.style.display = 'none';
    }

    cancelButtonCell.appendChild(cancelButton);
    row.appendChild(cancelButtonCell);
}




















