
const express = require('express');
var bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2')
const session = require('express-session');
const cookieParser = require('cookie-parser');
const path = require('path');


var app = express();
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(cors({ origin: '*' }));

const publicPath = 'E:/tutor_website/tutor-website-main'
app.use(express.static(publicPath))
app.get('/', (req, res) => {
    const indexPath = 'E:/tutor_website/tutor-website-main/index.html';
    res.sendFile(indexPath);
});

app.use(cookieParser());
app.use(session({
    secret: 'your-secret-key',
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 30 * 60 * 1000 } // 30 minutes
}));

var db = require('./Sqlconn.js');
const { error } = require('console');

app.get('/api/get_user_info', (req, res) => {
    const tb = {req_tb} = req.body;
    const tb1 = 'register_info';
    // Thực hiện truy vấn SQL để lấy thông tin người dùng
    const userId = req.session.userId; // Thay đổi thành phương thức lấy ID người dùng từ session hoặc request
    const sql = 'SELECT * FROM '+ tb1+' WHERE ACCID = ?';
   
    db.query(sql, [userId], (err, results) => {
       
        if (err) {
            console.error('Error executing MySQL query:', err);
            res.status(500).json({ message: 'Internal Server Error'});
            return;
        }

        if (results.length === 0) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const userInfo = results[0];
        res.json(userInfo);
    });
});


app.post('/api/register', (req, res) => {
    const { usrname, email, password, role } = req.body;

    // Kiểm tra xem email đã tồn tại chưa
    db.query('SELECT * FROM register_info WHERE email = ?', [email], (selectErr, selectResults) => {
        if (selectErr) {
            console.error('Error checking email:', selectErr);
           // res.status(500).json({ error: 'Internal Server Error' });
           // res.json({message:'emai da duoc dang ki'});
            return;
        }

        if (selectResults.length > 0) {
            // Email đã tồn tại, trả về thông báo lỗi
            res.status(400).json({ error: 'Email already registered' });
           // res.status(400).json({message:'emai da duoc dang ki'});
          
            return;
        }

        // Nếu email chưa tồn tại, tiếp tục đăng ký
        const randomId = 'a' + Math.floor(100000000 + Math.random() * 900000000);

        // Thay đổi tên cột trong INSERT INTO
        db.query('INSERT INTO register_info (accid, username, email, pass_w, acc_type) VALUES (?, ?, ?, ?, ?)', [randomId, usrname, email, password, role], (insertErr, insertResults) => {
            if (insertErr) {
                console.error('Error adding user:', insertErr);
                res.status(500).json({ error: 'Internal Server Error' });
                return;
            }
            res.json({ message: 'Tạo tài khoản thành công, vui lòng đăng nhập !!' });
        });
    });
});

const sessions = {}
function isAuthenticated(req, res, next) {
    const sessionId = req.cookies.session_id // Lấy Session ID từ cookie
    if (sessionId && sessions[sessionId]) {
      // Nếu có sessionId và nó tồn tại trong session
      req.session = sessions[sessionId] // Lấy thông tin session
      next() // Tiếp tục xử lý request
    } else {
      res.status(401).json({ message: 'Unauthorized' }) // Trả về lỗi 401 nếu chưa xác thực
    }
  }

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    // Kiểm tra thông tin đăng nhập
    db.query('SELECT * FROM register_info WHERE email = ? AND pass_w = ?', [email, password], (selectErr, selectResults) => {
        if (selectErr) {
            console.error('Error checking login:', selectErr);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        if (selectResults.length > 0) {
            // Đăng nhập thành công, tạo session và cookie
            const newSessionId = Math.random().toString(36).substring(2) // Tạo ID session mới
            req.session.id = newSessionId;
            req.session.userId = selectResults[0].ACCID;
            req.session.username = selectResults[0].username;
            req.session.role = selectResults[0].acc_type;
            sessions[newSessionId] = req.session
            msg = 'OK login' + req.session.userId+ req.session.username +''+ req.session.role ;
            res.cookie('sessionId', newSessionId, { maxAge: 60 * 60 * 1000, httpOnly: true });
            //msg = 'Login thành công !!!'
            res.status(200).json({ message: msg });
            console.log('Ok new session');
            
            
        } else {
            // Đăng nhập thất bại, trả về thông báo lỗi
            res.status(401).json({ error: 'Invalid credentials' });
        }
    });
});

// Đăng xuất
app.get('/api/test_ss',(req, res) => {
    const sessionData = req.session.id + ' '+ req.session.userId+ ' ' + req.session.role;

    // Làm cái gì đó với dữ liệu session
    console.log(sessionData);

    // Trả về phản hồi
    res.send('Hello, World!');


});
app.get('/api/logout', (req, res) => {
    // Hủy session và xóa cookie
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        res.clearCookie('sessionId');
        res.json({ message: 'Logout successful' });
    });
});

//check session middleware
function checkSession(req, res, next) {
    const sessionId = req.cookies.sessionId; // Lấy Session ID từ cookie
    if (sessionId && sessions[sessionId]) {
        // Nếu có sessionId và nó tồn tại trong session
        req.session = sessions[sessionId]; // Lấy thông tin session
        next(); // Tiếp tục xử lý request
    } else {
        res.status(401).json({ message: 'Unauthorized' });
        
        
    }
}

// Sử dụng middleware kiểm tra session cho các route cần xác thực
app.use('/api/authenticated_routes', checkSession);

app.get('/api/authenticated_routes/user_info', checkSession, (req, res) => {
    // Trả về thông tin user từ session
    res.json({
        userId: req.session.userId,
        username: req.session.username,
        role: req.session.role,
        // Thêm các thông tin khác nếu cần
    });
});

//cập nhật thông tin người dùng
app.post('/api/save_user_info', (req, res) => {
    const userInfo = req.body;

    // Kiểm tra xem có thiếu thông tin nào không
    const requiredFields = ['email', 'dob', 'edu', 'fullname', 'CCCD', 'phone_num', 'addr_number', 'ward', 'district', 'province'];
    for (const field of requiredFields) {
        if (!userInfo[field]) {
            return res.status(400).json({ message: `Thiếu thông tin bắt buộc: ${field}` });
        }
    }

    // Thực hiện truy vấn SQL để cập nhật thông tin người dùng trong database
    const query = `UPDATE register_info SET ? WHERE email = ?`;
    db.query(query, [userInfo, userInfo.email], (error, results) => {
        if (error) {
            console.error('Error executing SQL query:', error);
            return res.status(500).json({ message: 'Đã xảy ra lỗi khi cập nhật thông tin người dùng.' });
        }

        res.json({ message: 'Thông tin đã được cập nhật thành công.' });
    });
});
//gửi dữ liệu
// Lấy dữ liệu classes
app.get('/api/get_classes', async (req, res) => {
    function isValidClassID(str) {
        return /^c\d{9}$/.test(str);
    }
    try {
        const whereCondition = req.query.where || ''; 
        const hasQuestionMark = /\?/.test(whereCondition);
      //  const [classesData] = await db.promise().query('SELECT * FROM Class WHERE start_time > NOW() AND isBooked = 0');
      const query = 'SELECT Class.*,fullname,ward, district, subName FROM subjects inner join Class inner join register_info WHERE ' 
                            +'subjects.subID = Class.subID AND tutorID = register_info.ACCID AND ' + whereCondition;
      var classesData ='';   
      console.log(isValidClassID(whereCondition), whereCondition);            
        if(hasQuestionMark){
            [classesData] = await db.promise().query(query, req.session.userId);
        }
        else if(isValidClassID(whereCondition)){
            const currentTime = new Date();

            const _query = 'SELECT Class.*,fullname,ward, district, subName, edu FROM subjects inner join Class inner join register_info WHERE '
            + 'subjects.subID = Class.subID AND tutorID = register_info.ACCID AND '+`classID = '${whereCondition}' `;
            [classesData] = await db.promise().query(_query);
        }
         else {
            [classesData] = await db.promise().query(query);
        }
        
//SELECT Class.*,fullname,ward, district, subName FROM subjects inner join Class inner join register_info WHERE subjects.subID = Class.subID AND tutorID = register_info.ACCID AND start_time > NOW() AND isBooked = 0;
        res.json(classesData);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

//cập nhật thông tin lớp
app.get('api/getSubID', async (req, res) =>{

    try{
        const whereCondition = req.query.where || ''; 
        const query = 'SELECT subID FROM subjects WHERE ' + whereCondition;
        const [subID] = await db.promise().query(query);
        res.json(subID);

    }
    catch (error){
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
app.post('/api/editClass', (req, res) => {
    const classInfo = req.body;
    const _classID = classInfo.classID;
    delete classInfo['classID'];
    // Kiểm tra xem có thiếu thông tin nào không
    const requiredFields = ['class_name', 'subName', 'grade', 'price', 'start_time', 'end_time', 'detail'];
    for (const field of requiredFields) {
        if (!classInfo[field]) {
            return res.status(400).json({ message: `Thiếu thông tin bắt buộc: ${field}` });
        }
    }
    //
    var _subName = classInfo.subName;
    const _query = `SELECT subID FROM subjects WHERE subName = ?`
    var _subID ='';
    db.query(_query, [_subName], (error, results) => {
        if (error) {
            console.log('Error executing SQL query:', error);
            //return res.status(500).json({ message: 'Đã xảy ra lỗi khi cập nhật thông tin người dùng.' });
        }

        //res.json({ message: 'Thông tin đã được cập nhật thành công.' });
        _subID = results[0].subID;
        console.log(results);

    classInfo.subID = _subID;
    delete classInfo.subName;
    // Thực hiện truy vấn SQL để cập nhật thông tin người dùng trong database
    const query = `UPDATE Class SET ? WHERE classID = ?`;
    db.query(query, [classInfo, _classID], (error, results) => {
        if (error) {
            console.error('Error executing SQL query:', error);
            return res.status(500).json({ message: 'Đã xảy ra lỗi khi cập nhật thông tin người dùng.' });
        }

        res.json({ message: `Thông tin lớp ${_classID} đã được cập nhật thành công.` });
    });

    });
    
});

//delete class
app.delete('/api/deleteClass/:classID', async (req, res) => {
    const classID = req.params.classID;
    let isBooked = 0;
  
    try {
      // Thực hiện truy vấn SQL để kiểm tra trạng thái đặt chỗ
      const queryCheckBooked = 'SELECT isBooked FROM Class WHERE classID = ?';
      const [resultsCheckBooked] = await db.promise().query(queryCheckBooked, [classID]);
      isBooked = resultsCheckBooked[0].isBooked;
  
      const enddate = new Date(resultsCheckBooked[0].end_time);
      const isExpired = enddate < new Date();
  
      if (isBooked === 1 || (isExpired && isBooked === 1)) {
        return res.status(400).json({ message: 'Lớp đã đăng ký không thể xóa - Nếu hết hạn 30 ngày sau hệ thống sẽ tự động xóa!!' });
      }
  
      // Nếu không đăng ký hoặc đã hết hạn, tiếp tục xóa
      const queryDelete = 'DELETE FROM Class WHERE classID = ?';
      await db.promise().query(queryDelete, [classID]);
  
      res.status(200).json({ message: 'Dữ liệu đã được xóa thành công.' });
    } catch (error) {
      console.error('Lỗi khi thực hiện truy vấn SQL:', error);
      res.status(500).json({ message: 'Đã xảy ra lỗi khi xóa dữ liệu.' });
    }
  });

//Post lớp lên
app.post('/api/insertClass', (req, res) => {
    var { classID, class_name, subID, grade, price, start_time, end_time, detail } = req.body;
    if(req.session.role === 0){
        return res.status(400).json({message:'Hành động không được phép thực hiện !!'});
    }
    classID = 'c' + Math.floor(100000000 + Math.random() * 900000000);
    console.log(classID);
    // Kiểm tra xem có thiếu thông tin nào không
    const requiredFields = ['classID', 'class_name', 'start_time', 'end_time', 'subID', 'grade', 'price', 'detail'];
    for (const field of requiredFields) {
        if (!req.body[field]) {
            return res.status(400).json({ message: `Thiếu thông tin bắt buộc: ${field}` });
        }
    }

    // Thực hiện truy vấn SQL để chèn dữ liệu vào bảng Class
    const query = `INSERT INTO Class (classID, class_name, start_time, end_time, subID, grade, price, detail, tutorID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(query, [classID, class_name, start_time, end_time, subID, grade, price, detail, req.session.userId], (error, results) => {
        if (error) {
            console.error('Lỗi khi thực hiện truy vấn SQL:', error);
            return res.status(500).json({ message: 'Đã xảy ra lỗi khi thêm lớp.' });
        }

        res.status(200).json({ message: 'Dữ liệu lớp đã được thêm thành công!!' });
    });
});

//MOMO
const momo = require('./CollectionLink');
async function getMOMO(extradt,price) {
    try {
        const result = await momo.Func_MOMO(extradt, price );
        console.log('Response:', result);
        return result;
    } catch (error) {
        console.error('Error:', error);
        return;
    }
}

const fetch = require('node-fetch');
app.post('/api/momo',checkSession, async (req, res) => {

    var classID = req.body.classID;
    var price = '';
    if(req.session.role === 1){
        return res.status(400).json({message:'Hành động không được phép thực hiện !!'});
    }
    const query1 = `SELECT price FROM class WHERE classID = '${classID}'`;
    const [result] = await db.promise().query(query1);
    price = result[0].price;
    console.log("PRICE ", price);
    extradt = classID+req.session.userId;
    
    var js_res = await getMOMO(extradt, price);
   // console.log("RRRR",js_res);
   js_res = JSON.parse(js_res);
    var link = js_res.shortLink;
    console.log(link);
    res.status(200).json({message: link});



});

app.post('/api/insertTrans', async(req, res) => {
    const {transID, accID, classID} = req.body;
    const query1 = 'INSERT INTO Trans (transID, accID, classID) VALUES (?, ?, ?)';
    try{
        await db.promise().query(query1,[transID,accID,classID]);
        console.log("nhap trans thanh cong");
    }
    catch(error){
        console.log(error);
        return res.status(400).json({message: 'Lỗi!'});

    }

    const query2 = `UPDATE Class SET accID = '${accID}', isBooked = 1 WHERE classID = '${classID}'`;

    try{
        await db.promise().query(query2);
        console.log("upate thanh cong");
        return res.status(200).json({message: 'cap nhat lop thanh cong'});
    }
    catch(error){
        console.log(error);
        return res.status(400).json({message: 'Lỗi!'});

    }
});


app.get('/api/getAllClasses', (req, res) => {
    const query = `
        SELECT *
        FROM Class
        WHERE isBooked = 1
        GROUP BY accID, classID; 
    `;

    db.query(query, (error, results) => {
        if (error) {
            console.error('Lỗi khi thực hiện truy vấn SQL:', error);
            return res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy thông tin lớp.' });
        }

        // Trả về dữ liệu lớp
        res.status(200).json({ success: true, classes: results });
    });
});

app.post('/api/rateTutor', async (req, res) => {
    const { classID, rating } = req.body;

    // Kiểm tra điều kiện để đánh giá
    const checkQuery = 'SELECT * FROM Class WHERE classID = ? AND NOW() > END_TIME';
    db.query(checkQuery, [classID], (checkError, checkResults) => {
        if (checkError) {
            console.error('Lỗi khi kiểm tra điều kiện đánh giá:', checkError);
            return res.status(500).json({ message: 'Đã xảy ra lỗi khi kiểm tra điều kiện đánh giá.' });
        }

        if (checkResults.length === 0) {
            return res.status(400).json({ message: 'Bạn chưa học xong nên không thể thực hiện đánh giá. Vui lòng thử lại sau.' });
        }

        // Thực hiện truy vấn SQL để cập nhật rating của gia sư
        const updateQuery = 'UPDATE Class SET rating = ? WHERE classID = ?';
        db.query(updateQuery, [rating, classID], (updateError, updateResults) => {
            if (updateError) {
                console.error('Lỗi khi thực hiện truy vấn SQL:', updateError);
                return res.status(500).json({ message: 'Đã xảy ra lỗi khi cập nhật đánh giá.' });
            }

            res.status(200).json({ message: 'Đánh giá đã được cập nhật thành công.' });
        });
    });
});






// Endpoint mới để hủy lớp
app.post('/api/cancelClass', async(req, res) => {
    const { classID } = req.body;

    // Kiểm tra điều kiện trước khi hủy lớp
    const query = 'SELECT * FROM Class WHERE classID = ? AND isBooked = 1 AND start_time > NOW() + INTERVAL 1 DAY';

    db.query(query, [classID], (error, results) => {
        if (error) {
            console.error('Lỗi khi thực hiện truy vấn SQL:', error);
            return res.status(500).json({ success: false, message: 'Đã xảy ra lỗi khi hủy lớp.' });
        }

        if (results.length > 0) {
            // Cập nhật trạng thái của lớp về chưa đặt
            const updateQuery = 'UPDATE Class SET isBooked = 0 WHERE classID = ?';
            db.query(updateQuery, [classID], (updateError, updateResults) => {
                if (updateError) {
                    console.error('Lỗi khi cập nhật trạng thái lớp:', updateError);
                    return res.status(500).json({ success: false, message: 'Đã xảy ra lỗi khi hủy lớp.' });
                }

                res.status(200).json({ success: true, message: 'Lớp đã được hủy thành công.' });
            });
        } else {
            // Không đủ điều kiện để hủy lớp
            res.status(400).json({ success: false, message: 'Không thể hủy lớp. Điều kiện không đúng.' });
        }
    });
});








app.listen(3000, () => {
    console.log(`Server started on port 3000 `)

});
