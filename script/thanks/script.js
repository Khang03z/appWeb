function getURLParameters(url) {
    const params = url.split('?')[1];
    if (!params) {
        return {};
    }

    return params.split('&').reduce((acc, param) => {
        const [key, value] = param.split('=');
        acc[key] = decodeURIComponent(value);
        return acc;
    }, {});
}


document.addEventListener('DOMContentLoaded', function() {
    const currentUrl = window.location.href;
    console.log(currentUrl);
    const obj = getURLParameters(currentUrl);
    console.log(obj);

    // Tính độ dài của chuỗi và chia đôi
    var extraData = obj.extraData 
    const length = extraData.length;
    const halfLength = Math.ceil(length / 2);

// Tách chuỗi thành hai phần
    const part1 = extraData.substring(0, halfLength);
    const part2 = extraData.substring(halfLength);
    document.getElementById('orderId').innerText = obj.orderId;
    document.getElementById('orderType').innerText = obj.orderType +'  thông qua  '+ obj.payType;
    document.getElementById('accID').innerText = part2;
    document.getElementById('transId').innerText = obj.transId;
    document.getElementById('orderId').innerText = obj.orderId;
    document.getElementById('classID').innerText = part1;
    document.getElementById('money').innerText = obj.amount + '   VND';

    if(obj.message === 'Successful.'){
        document.getElementById('header_status').innerText = 'THANH TOÁN THÀNH CÔNG'
        document.getElementById('header_status').style.color = 'green';
        //
        var transID = obj.transId;
        var accID = part2;
        var classID = part1;
        const class_info = {
            transID,
            accID,
            classID
    
        }
        console.log(class_info);
    
        fetch('http://localhost:3000/api/insertTrans', {
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
           
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Đã xảy ra lỗi khi gửi dữ liệu.');
        }); 
        
    }
    else{
        document.getElementById('header_status').innerText = 'THANH TOÁN THẤT BẠI'
        document.getElementById('header_status').style.color = 'red';
    }
    



    
});
