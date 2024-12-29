const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const session = require('express-session');
const multer = require('multer');
const path = require('path');

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(cors({
  origin: true, // Thay đổi theo URL frontend của bạn
  credentials: true                // Cho phép gửi cookie (session)
}));
// Cấu hình express-session
app.use(session({
  secret: 'secretkey',
  saveUninitialized: true,
  cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 }
}));

// Cấu hình middleware
app.use(express.json()); // Xử lý JSON
app.use(express.urlencoded({ extended: true })); // Xử lý form data


// Kết nối với MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'tro'
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('MySQL Connected...');
});

// Cấu hình multer để lưu trữ tệp
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'Images');  // Đường dẫn nơi lưu trữ ảnh
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);  // Đặt tên tệp là thời gian hiện tại + đuôi tệp
  }
});

const upload = multer({ storage: storage });


// API để lấy dữ liệu từ bảng diachi
app.get('/api/diachi', (req, res) => {
  const sql = 'SELECT * FROM diachi';
  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json(result);
  });
});

app.get('/api/vungmien', (req, res) => {
  const sql = 'SELECT * FROM vungmien';
  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json(result);
  });
});

// API để lấy dữ liệu từ bảng phongtro
app.get('/api/phongtro', (req, res) => {
  const sql = `
  SELECT phongtro.*, diachi.*
  FROM phongtro
  LEFT JOIN diachi ON phongtro.diachi_id = diachi.diachi_id
`;
  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json(result);
  });
});

app.post('/api/register', async (req, res) => {
  const { hoten, username, password, email, sdt } = req.body;

  // Kiểm tra dữ liệu có đầy đủ không
  if (!hoten || !username || !password || !email || !sdt) {
    return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin' });
  }
  try {
    // Truy vấn MySQL để thêm người dùng mới
    db.query(
      'INSERT INTO taikhoan (hoten, username, password, email, sdt) VALUES (?, ?, ?, ?, ?)',
      [hoten, username, password, email, sdt],
      (error, results) => {
        if (error) {

          return res.status(500).json({ message: 'Lỗi server khi thêm người dùng' });
        }
        return res.status(201).json({ message: 'Đăng ký thành công!' });
      }
    );
  } catch (error) {
    console.error('Lỗi server:', error);
    return res.status(500).json({ message: error.message });
  }
});

// API đăng nhập
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  // Kiểm tra dữ liệu có đầy đủ không
  if (!username || !password) {
    return res.status(400).json({ message: 'Vui lòng nhập đầy đù tài khoản và mật khẩu' });
  }

  try {
    // Truy vấn MySQL để kiểm tra người dùng
    db.query('SELECT * FROM taikhoan WHERE username = ?', [username], (error, results) => {
      if (error) {
        console.error('Lỗi server:', error);
        return res.status(500).json({ message: 'Lỗi server' });
      }

      if (results.length === 0) {
        return res.status(400).json({ message: 'Tên đăng nhập không tồn tại' });
      }
      const user = results[0];
      // So sánh mật khẩu người dùng nhập vào với mật khẩu lưu trong cơ sở dữ liệu
      if (user.password !== password) {
        return res.status(400).json({ message: 'Sai mật khẩu' });
      }
      // Lưu thông tin người dùng vào session
      req.session.user = {
        user_id: user.user_id,
        username: user.username,
        hoten: user.hoten,
        email: user.email,
        sdt: user.sdt
      };

      req.session.save((err) => {
        if (err) {
          console.error('Lỗi khi lưu session:', err);
          return res.status(500).json({ message: 'Lỗi khi lưu session' });
        }

        // Trả về thông báo đăng nhập thành công
        return res.status(200).json({ message: 'Đăng nhập thành công!' });
      });
    });
  } catch (error) {
    console.error('Lỗi server:', error);
    return res.status(500).json({ message: 'Lỗi server' });
  }
});

// API kiểm tra trạng thái đăng nhập
app.get('/api/check-session', (req, res) => {
  console.log('Session:', req.session);  // Log session để kiểm tra
  if (req.session.user) {
    // Nếu có phiên (session), trả về thông tin người dùng
    return res.status(200).json({
      message: 'Người dùng đã đăng nhập',
      user: req.session.user
    });
  } else {
    // Nếu không có phiên, người dùng chưa đăng nhập
    return res.status(401).json({ message: 'Người dùng chưa đăng nhập' });
  }
});

app.post('/api/logout', (req, res) => {
  // Hủy session của người dùng
  req.session.destroy((err) => {
    if (err) {
      console.error('Lỗi khi hủy session:', err);
      return res.status(500).json({ message: 'Lỗi khi đăng xuất' });
    }
    // Xóa cookie session
    res.clearCookie('connect.sid');  // Tên của cookie session mặc định trong Express là 'connect.sid'
    // Trả về thông báo đăng xuất thành công
    return res.status(200).json({ message: 'Đăng xuất thành công' });
  });
});

// API thêm phòng trọ
app.post('/api/themphongtro', upload.single('AnhBia'), (req, res) => {
  if (!req.session.user || !req.session.user.user_id) {
    return res.status(401).json({ message: 'Bạn cần đăng nhập để thêm phòng trọ' });
  }

  const { tenphongtro, mota, diachicuthe, gia, loaiphong, tienich, soluong, thoigiandang, diachi_id, vm_id } = req.body;
  const user_id = req.session.user.user_id;
  const AnhBia = req.file ? req.file.filename : '';  // Lấy tên tệp ảnh nếu có

  if (!tenphongtro || !mota || !diachicuthe || !gia || !loaiphong || !tienich || !soluong || !diachi_id || !vm_id || !AnhBia) {
    return res.status(400).json({ message: 'Thiếu thông tin phòng trọ' });
  }

  const query = `
      INSERT INTO phongtro (tenphongtro, mota, diachicuthe, gia, loaiphong, tienich, soluong, thoigiandang, user_id, diachi_id, vm_id, AnhBia)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(query, [tenphongtro, mota, diachicuthe, gia, loaiphong, tienich, soluong, thoigiandang, user_id, diachi_id, vm_id, AnhBia], (err, result) => {
    if (err) {
      console.error('Lỗi thêm phòng trọ:', err);
      return res.status(500).json({ message: 'Lỗi server', error: err });
    }
    res.status(200).json({ message: 'Thêm phòng trọ thành công', maphongtro: result.insertId });
  });
});

// API lấy chi tiết phòng trọ theo maphongtro
app.get('/api/chitiet/:maphongtro', (req, res) => {
  const { maphongtro } = req.params;

  // Truy vấn MySQL để lấy chi tiết phòng trọ
  const query = `
        SELECT phongtro.*, taikhoan.*, diachi.*
        FROM phongtro
        LEFT JOIN taikhoan ON phongtro.user_id = taikhoan.user_id
        LEFT JOIN diachi ON phongtro.diachi_id = diachi.diachi_id
        WHERE phongtro.maphongtro = ?
      `;

  db.query(query, [maphongtro], (err, result) => {
    if (err) {
      console.error('Lỗi khi truy vấn phòng trọ:', err);
      return res.status(500).json({ message: 'Lỗi server', error: err });
    }

    if (result.length > 0) {
      res.json(result[0]);
    } else {
      res.status(404).json({ message: "Property not found" });
    }
  });
});

// API tìm kiếm phòng trọ theo địa chỉ, vùng miền và địa chỉ cụ thể
app.get('/api/timkiem', (req, res) => {
  const { diachi_id, vm_id, diachi_cu_the } = req.query; 
  let sql = `
      SELECT phongtro.*, diachi.tendiachi, vungmien.tenvungmien
      FROM phongtro
      LEFT JOIN diachi ON phongtro.diachi_id = diachi.diachi_id
      LEFT JOIN vungmien ON phongtro.vm_id = vungmien.vm_id
      WHERE 1=1`; // Điều kiện luôn đúng để dễ dàng bổ sung thêm các điều kiện khác

  const params = []; // Mảng chứa các giá trị truyền vào cho câu SQL

  // Nếu có giá trị địa chỉ cụ thể
  if (diachi_cu_the) {
      sql += ' AND phongtro.diachicuthe LIKE ?';
      params.push(`%${diachi_cu_the}%`); // Tìm kiếm theo phần chuỗi
  }

  // Nếu có giá trị diachi_id
  if (diachi_id) {
      sql += ' AND diachi.diachi_id = ?';
      params.push(diachi_id);
  }

  // Nếu có giá trị vm_id
  if (vm_id) {
      sql += ' AND vungmien.vm_id = ?';
      params.push(vm_id);
  }

  // Thực hiện câu lệnh truy vấn
  db.query(sql, params, (err, result) => {
      if (err) {
          console.error('Lỗi khi tìm kiếm:', err);
          return res.status(500).json({ error: 'Có lỗi xảy ra khi tìm kiếm' });
      }
      res.json(result); // Trả về kết quả tìm kiếm dưới dạng JSON
  });
});

// Lấy phòng trọ theo user_id 
app.get('/baidang', (req, res) => {
  // Kiểm tra xem người dùng đã đăng nhập chưa
  if (!req.session.user) {
    return res.status(401).json({ message: 'Vui lòng đăng nhập để tiếp tục.' });
  }
  const userId = req.session.user.user_id;  // Lấy user_id từ session
  // Truy vấn lấy tất cả phòng trọ của userId từ bảng phongtro
  db.query('SELECT * FROM phongtro WHERE user_id = ?', [userId], (err, results) => {
    if (err) {
      console.error('Lỗi khi lấy phòng trọ:', err);
      return res.status(500).json({ message: 'Không thể lấy phòng trọ.' });
    }
    res.status(200).json({ phongtro: results });
  });
});

// API.xóa phòng trọ
app.delete('/baidang/:maphongtro', (req, res) => {
  console.log('Yêu cầu DELETE nhận được:', req.params.maphongtro);
  const { maphongtro } = req.params;

  const query = 'DELETE FROM phongtro WHERE maphongtro = ?';

  db.query(query, [maphongtro], (err, result) => {
    if (err) {
      console.error('Lỗi khi xóa phòng trọ:', err);
      return res.status(500).json({ message: 'Không thể xóa phòng trọ.' });
    }
    res.status(200).json({ message: 'Phòng trọ đã được xóa thành công.' });
  });
});



// API đăng nhập admin
app.post('/api/admin-login', (req, res) => {
  const { user_admin, password } = req.body;
  if (!user_admin || !password) {
    return res.status(400).json({ message: 'Vui lòng nhập tên đăng nhập và mật khẩu.' });
  }
  db.query('SELECT * FROM admin WHERE user_admin = ?', [user_admin], (err, results) => {
    if (err) {
      console.error('Lỗi khi truy vấn:', err);
      return res.status(500).json({ message: 'Lỗi khi truy vấn.' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Tên đăng nhập không tồn tại.' });
    }

    const admin = results[0];

    // So sánh mật khẩu trực tiếp
    if (admin.password !== password) {
      return res.status(401).json({ message: 'Mật khẩu không chính xác.' });
    }

    // Đăng nhập thành công, lưu thông tin vào session
    req.session.admin = {
      id_admin: admin.id_admin,
      tenadmin: admin.tenadmin,
      user_admin: admin.user_admin
    };

    return res.status(200).json({ message: 'Đăng nhập thành công.' });
  });
});

// API kiểm tra xem admin đã đăng nhập hay chưa
app.get('/api/check-session-admin', (req, res) => {
  if (req.session.admin) {
    res.status(200).json({ admin: req.session.admin });
  } else {
    res.status(401).json({ message: 'Chưa đăng nhập' });
  }
});

// API đăng xuất
app.post('/api/admin-logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Lỗi khi đăng xuất.' });
    }
    res.status(200).json({ message: 'Đăng xuất thành công.' });
  });
});

app.get('/api/allphongtro', (req, res) => {
  const sql = 'SELECT * FROM phongtro';
  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json(result);
  });
});

app.get('/api/alltaikhoan', (req, res) => {
  const sql = 'SELECT * FROM taikhoan';
  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json(result);
  });
});
// API xóa phòng user
app.delete('/taikhoan/:user_id', (req, res) => {
  console.log('Yêu cầu DELETE nhận được:', req.params.user_id);
  const { user_id } = req.params;

  const query = 'DELETE FROM taikhoan WHERE user_id = ?';

  db.query(query, [user_id], (err, result) => {
    if (err) {
      console.error('Lỗi khi xóa:', err);
      return res.status(500).json({ message: 'Không thể xóa.' });
    }
    res.status(200).json({ message: 'Tài khoản đã được xóa thành công.' });
  });
});


// Start server
const port = 4000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
