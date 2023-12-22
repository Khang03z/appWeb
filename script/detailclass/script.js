// Hàm để lấy giá trị của tham số từ URL
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// Lấy giá trị của tham số classID từ URL
var classID = getParameterByName('classID');

// Kiểm tra nếu classID không rỗng
if (classID !== null && classID !== '') {
    console.log('ClassID từ URL:', classID);
} else {
    console.log('Không tìm thấy giá trị classID trong URL.');
}


document.addEventListener('DOMContentLoaded', function() {

    var infoTable = document.getElementById('infoTable');

    function BuildTable() {

        const whereCondition = classID;
        fetch('http://localhost:3000/api/get_classes?where=' + encodeURIComponent(whereCondition))
            .then(response => response.json())
            .then(classesData => {
                addInfo('ID lớp:', classID);
                 //classesData[0][]
              
                const courseTitleElement = document.querySelector('.course-title');
                courseTitleElement.innerText = classesData[0]['class_name'];
                //Xử lý thời gian:
                const options = { day: 'numeric', month: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: false };
                const start_formattedDate = new Intl.DateTimeFormat('vi-VN', options).format(new Date(classesData[0]['start_time']));
                const end_formattedDate = new Intl.DateTimeFormat('vi-VN', options).format(new Date(classesData[0]['end_time']));
                addInfo('Gia sư:', classesData[0]['fullname']);
                addInfo('Chứng chỉ giảng viên:', classesData[0]['edu']);
                addInfo('Thời gian',`Từ ${start_formattedDate} đến ${end_formattedDate}`);
                addInfo('Địa chỉ gia sư:',`Phường ${classesData[0]['ward']}, Quận-TP ${classesData[0]['district']}` ) ;
                addInfo('Học phí', `${classesData[0]['price']} VND`);
                addInfo('Ghi chú',classesData[0]['detail']);
            })
            .catch(error =>{ 
                console.error('Error:', error);
                alert(error);
            
        });

        infoTable.innerHTML = '';
        
        

    }

    function addInfo(rowTitle, rowData) {
        var row = infoTable.insertRow();
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        cell1.innerHTML = rowTitle;
        cell2.innerHTML = rowData;
        cell2.style.width = '700px';
    }
    BuildTable();
});

document.addEventListener('DOMContentLoaded', function () {
    // Get the button element by its ID
    const enrollButton = document.getElementById('enroll-button');

    // Check if the button element exists
    if (enrollButton) {
        // Add a click event listener to the button
        enrollButton.addEventListener('click', function () {
            const info = {
                classID
            };
            console.log(info);
            fetch('http://localhost:3000/api/momo', {
                
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(info),
            })
            .then(response => response.json())
            .then(result => {
                console.log(result);
                //alert(result.message);
                window.location.href= result.message;

            })
            .catch(error => {
                console.error('Error:', error);
                alert('Đã xảy ra lỗi khi gửi dữ liệu.');
               
            });
        });
    } else {
        console.error('Button not found!');
    }
});



