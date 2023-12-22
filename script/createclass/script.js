document.addEventListener('DOMContentLoaded', function () {
    //addSampleData();
    getClassesData();
});
const SubList = {Toán: 's000000001', Văn:'s000000011',Anh: 's000000021',Sinh: 's000000031',Lý: 's000000041',Hóa: 's000000051',Địa: 's000000061',Sử: 's000000071',GDCD: 's000000081', Khác: 's000000404'};
function convertToISOFormat(inputDate) {
    // Chuyển đổi định dạng "MM/dd/yyyy, HH:mm" thành "yyyy-MM-ddTHH:mm"
    const parts = inputDate.split(/[\s,]+/); // Tách ngày và giờ
    const dateParts = parts[0].split('/'); // Tách ngày thành mảng [MM, dd, yyyy]
    const timeParts = parts[1].split(':'); // Tách giờ thành mảng [HH, mm]
  
    const isoFormat = `${dateParts[2]}-${dateParts[0]}-${dateParts[1]}T${timeParts[0]}:${timeParts[1]}`;
    return isoFormat;
  }

// Nhấn button Submit
  function submitForm() {
    classID ='aaaa';
    class_name = document.getElementById('className').value;
        subName = document.getElementById('subject').value;
    subID = SubList[subName];
    start_time = document.getElementById('startTime').value ;
    end_time = document.getElementById('endTime').value ;
    grade = document.getElementById('grade').value ;
    price = document.getElementById('price').value;
    detail = document.getElementById('details').value;
    
    if (!class_name || !subName || !grade || !price || !start_time || !end_time || !detail) {
        alert('Vui lòng điền đầy đủ thông tin.');
        return;
    }
    const class_info = {
        classID,
        class_name,
        subID,
        grade,
        price,
        start_time,
        end_time,
        detail

    }
    console.log(class_info);

    fetch('http://localhost:3000/api/insertClass', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(class_info),
    })
    .then(response => response.json())
    .then(result => {
        console.log(result);
        alert(result.message);
       // closeForm();
       // getClassesData();
       
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Đã xảy ra lỗi khi gửi dữ liệu.');
    }); 
    
    
    closeForm();
}
const editButton = document.getElementById('btnEditclass');
editButton.addEventListener('click', function () 
{
    classID = document.getElementById('classID').value;
    class_name = document.getElementById('className').value;
    subName = document.getElementById('subject').value;
    start_time = document.getElementById('startTime').value ;
    end_time = document.getElementById('endTime').value ;
    grade = document.getElementById('grade').value ;
    price = document.getElementById('price').value;
    detail = document.getElementById('details').value;
    //code gọi api edit
    if (!class_name || !subName || !grade || !price || !start_time || !end_time || !detail) {
        alert('Vui lòng điền đầy đủ thông tin.');
        return;
    }
    const class_info = {
        classID,
        class_name,
        subName,
        grade,
        price,
        start_time,
        end_time,
        detail

    }
    console.log(class_info);

    fetch('http://localhost:3000/api/editClass', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(class_info),
    })
    .then(response => response.json())
    .then(result => {
        console.log(result);
        alert(result.message);
        closeForm();
        getClassesData();
       
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Đã xảy ra lỗi khi gửi dữ liệu.');
    }); 
    


});

const delButton = document.getElementById('btnDelclass');
delButton.addEventListener('click', function () 
{
    classID = document.getElementById('classID').value;
    class_name = document.getElementById('className').value;
    subName = document.getElementById('subject').value;
    start_time = document.getElementById('startTime').value ;
    end_time = document.getElementById('endTime').value ;
    grade = document.getElementById('grade').value ;
    price = document.getElementById('price').value;
    detail = document.getElementById('details').value;
    
    const userConfirmed = window.confirm(`Bạn chắc chắn muốn xóa ClassID ${classID} không?`);



   if (userConfirmed) {
        // Gửi yêu cầu xóa thông qua fetch API
        fetch(`http://localhost:3000/api/deleteClass/${classID}`, {
            method: 'DELETE',
            cache: 'no-cache',
        })
        .then(response => response.json())
        .then(result => {
            alert(result.message);
            closeForm();
            getClassesData();
            // Xử lý kết quả sau khi xóa dữ liệu thành công
        })
        .catch(error => {
            console.error('Lỗi:', error);
            // Xử lý lỗi khi gọi API
        });
    } else {
        // Nếu người dùng chọn Cancel, đóng form
        closeForm();
        getClassesData();
    }
    


});


function addSampleData() {
    var tbody = document.querySelector('.class-table tbody'); 

    var Data = [
        { 'Class ID': 'CLS001', 'Tên lớp': 'Lớp A', 'Môn học': 'Toán', 'Thời gian bắt đầu': '17/09/2023', 'Thời gian kết thúc': '1/1/2024', 'Link tài liệu': 'http://abc.com', 'Trạng thái đăng kí': 'Đã đăng kí', 'Ghi chú': 'Đang học' },
        { 'Class ID': 'CLS002', 'Tên lớp': 'Lớp B', 'Môn học': 'Anh Văn', 'Thời gian bắt đầu': '17/11/2023', 'Thời gian kết thúc': '1/1/2024', 'Link tài liệu': 'http://123.com', 'Trạng thái đăng kí': 'Chưa đăng kí', 'Ghi chú': 'Hết hạn' },
    ];


    for (var i = 0; i < Data.length; i++) {
        addDataToTable(Data[i], tbody);
    }
}
function getClassesData() {
    const whereCondition = 'tutorID = ?';
    fetch('http://localhost:3000/api/get_classes?where='+ encodeURIComponent(whereCondition))
        .then(response => response.json())
        .then(data => {
            // Xóa tất cả các dòng hiện tại trong bảng
            //var tableBody = document.querySelector('.class-table tbody');
            var tableBody = document.getElementById('bodytable');
            tableBody.innerHTML = '';

            // Thêm dữ liệu mới từ API vào bảng
            console.log(data[0]['classID']);
         //   data.forEach(classData => {
        //        addDataToTable(classData, tableBody);
        //    });
            for(var i = 0; i <data.length;i++){
                addDataToTable(data[i], tableBody);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}


function addDataToTable(data, tbody) {
    //console.log(data); 
    var row = document.createElement('tr');
    const keys = ['classID','class_name', 'subName', 'start_time', 'end_time', 'docID', 'isBooked', 'accID']
    
        
    for (var i = 0; i <keys.length; i++) {
        if(i===3 || i ===4){
            var cell = document.createElement('td');
            var _date = new Date(data[keys[i]]);
            const options = { day: 'numeric', month: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: false };
             _date = new Intl.DateTimeFormat('en-US', options).format(_date);
            cell.textContent = _date;
            row.appendChild(cell);
        }
        else{
        var cell = document.createElement('td');
        cell.textContent = data[keys[i]];
        row.appendChild(cell);
        }
    }
    const endTime = new Date(data['end_time']);
    if (endTime < new Date()) {
        row.classList.add('finished'); // Thêm lớp CSS 'finished' cho hàng đã kết thúc
    }


    var actionCell = document.createElement('td');

    // Thêm nút "Edit"
    var editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.style.marginLeft = '15px';
    editButton.id =data['classID'];
    editButton.addEventListener('click', function () {
        showEditForm(data['classID']);
        console.log('Edit button clicked for class ID:', data['classID']);
    });
    actionCell.appendChild(editButton);

    // Thêm nút "Delete"
    var deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.style.marginLeft = '30px';
    deleteButton.style.backgroundColor ='#e21616ef';
    deleteButton.addEventListener('click', function () {
        showDeleteForm(data['classID']);
        console.log('Delete button clicked for class ID:', data['classID']);
    });
    actionCell.appendChild(deleteButton);

    // Thêm ô chứa cả hai nút vào hàng
    row.appendChild(actionCell);

    tbody.appendChild(row);

}
function filterClasses(isNotExpired) {
    const tableBody = document.querySelector('.class-table tbody');
    const rows = Array.from(tableBody.children);

    rows.forEach(row => {
        const endTime = new Date(row.children[4].textContent); // Lấy thời gian kết thúc từ cột thứ 4 (index 3)
        const isExpired = endTime < new Date();

        // Nếu lớp còn hạn và đang lọc lớp còn hạn
        // hoặc lớp đã hết hạn và đang lọc lớp đã hết hạn
        if ((isNotExpired && !isExpired) || (!isNotExpired && isExpired)) {
            row.style.display = ''; // Hiển thị hàng
        } else {
            row.style.display = 'none'; // Ẩn hàng
        }
    });
}
document.getElementById('filterNotExpired').addEventListener('click', filterClasses.bind(null, true));
document.getElementById('filterExpired').addEventListener('click', filterClasses.bind(null, false));

document.getElementById('refresh').addEventListener('click', getClassesData);



function openForm() {

    document.getElementById("classForm").style.display = "block";
    document.getElementById('btnSubmit').style.display = "block";
    document.getElementById('classForm').style.height = '620px';

}

function closeForm() {
    document.getElementById("classForm").style.display = "none";
    document.getElementById('btnSubmit').style.display = "none";
    document.getElementById('btnEditclass').style.display = "none";
    document.getElementById('btnDelclass').style.display = "none";
    document.getElementById('classID').style.display = "none";
    document.getElementById('labelID').style.display= 'none';
    document.getElementById('classForm').style.height = '700px';
    document.getElementById('startTime').value = '';
    document.getElementById('endTime').value = '';
    document.getElementById('className').value ='';
    document.getElementById('subject').value ='';
    document.getElementById('startTime').value = '';
    document.getElementById('endTime').value = ''; 
    document.getElementById('grade').value ='';
    document.getElementById('price').value = '';
    document.getElementById('details').value ='';

    //Close form path...
    
}



function showEditForm(classID) {
    // Hiển thị form
    document.getElementById('classForm').style.display = 'block';

    // Chỉnh nút thành "Edit"
    
    document.getElementById('btnEditclass').style.display = 'block';

    
    document.getElementById('classID').style.display = 'block';
    document.getElementById('classID').value = classID;
    document.getElementById('labelID').style.display= 'block';

    //thực hiện load lên
    
    const whereCondition = `classID = '${classID}' `;
    var class_name, subName,grade,price, start_time, end_time, detail ='';
    fetch('http://localhost:3000/api/get_classes?where='+ encodeURIComponent(whereCondition))
        .then(response => response.json())
        .then(data => {
            
            
            class_name = document.getElementById('className').value = data[0]['class_name'];
            subName = document.getElementById('subject').value = data[0]['subName'];
           start_time = new Date(data[0]['start_time']) ;
           const options = { day: 'numeric', month: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: false };
               var _date = new Intl.DateTimeFormat('en-US', options).format(start_time);
            
            document.getElementById('startTime').value = convertToISOFormat(_date);
  
            end_time = new Date(data[0]['end_time']);
              _date = new Intl.DateTimeFormat('en-US', options).format(end_time);
            document.getElementById('endTime').value =  convertToISOFormat(_date)
            
            grade = document.getElementById('grade').value = data[0]['grade'];
            price = document.getElementById('price').value = data[0]['price'];
            detail = document.getElementById('details').value = data[0]['detail'];

        

        })
        .catch(error => {
            console.error('Error:', error);
        });
        //edit form part
       

}

function showDeleteForm(classID) {
    // Hiển thị form
    document.getElementById('classForm').style.display = 'block';

    // Chỉnh nút thành "Delete"
    //document.getElementById('btnSubmit').style.display = 'none';
    document.getElementById('btnDelclass').style.display = 'block';

    
    document.getElementById('classID').style.display = 'block';
    document.getElementById('classID').value = classID;
    document.getElementById('labelID').style.display= 'block';
    //load lên form
    const whereCondition = `classID = '${classID}' `;
    var class_name, subName,grade,price, start_time, end_time, detail ='';
    fetch('http://localhost:3000/api/get_classes?where='+ encodeURIComponent(whereCondition))
        .then(response => response.json())
        .then(data => {

            class_name = document.getElementById('className').value = data[0]['class_name'];
            subName = document.getElementById('subject').value = data[0]['subName'];
            start_time = new Date(data[0]['start_time']) ;
            const options = { day: 'numeric', month: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: false };
            var _date = new Intl.DateTimeFormat('en-US', options).format(start_time);
          
            document.getElementById('startTime').value = convertToISOFormat(_date);

            end_time = new Date(data[0]['end_time']);
            _date = new Intl.DateTimeFormat('en-US', options).format(end_time);
            document.getElementById('endTime').value =  convertToISOFormat(_date)
          
            grade = document.getElementById('grade').value = data[0]['grade'];
            price = document.getElementById('price').value = data[0]['price'];
            detail = document.getElementById('details').value = data[0]['detail'];

          

        })
        .catch(error => {
            console.error('Error:', error);
        });

        //phần del

}
