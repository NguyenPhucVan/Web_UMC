const express = require("express");
const router = express.Router();
const { poolPromise, sql } = require("../db/database"); // Đảm bảo đúng cách xuất nhập
const bcrypt = require("bcrypt");

const passwordToHash = "1"; // Thay thế bằng mật khẩu thực tế bạn muốn sử dụng
const saltRounds = 10; // Số vòng băm, có thể thay đổi theo ý muốn

bcrypt.hash(passwordToHash, saltRounds, function (err, hash) {
  if (err) {
    console.error("Error hashing password:", err);
    return;
  }
  console.log("Hashed password:", hash);
  // Sử dụng hash này để cập nhật vào cơ sở dữ liệu
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("username", sql.VarChar, username)
      .query("SELECT * FROM Login WHERE username = @username");

    if (result.recordset.length > 0) {
      const user = result.recordset[0];

      console.log("User data:", user); // Log the user object to check its properties

      // Compare password with hashed password
      const match = await bcrypt.compare(password, user.Password); // Make sure to use the correct password field

      if (match) {
        res.status(200).json({ message: "Login successful", user });
      } else {
        res.status(401).json({ message: "Invalid password" });
      }
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/logout", async (req, res) => {
  // Không cần làm gì trong backend nếu không sử dụng session
  res.status(200).json({ message: "Logout successful" });
});

module.exports = router; // Xuất router
