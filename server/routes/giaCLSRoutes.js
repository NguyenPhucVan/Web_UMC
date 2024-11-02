const express = require("express");
const router = express.Router();
const { poolPromise } = require("../db/database");
const sql = require("mssql");

// API lấy tất cả
router.get("/giaCLS", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT * FROM GiaCLS");
    res.json(result.recordset);
  } catch (err) {
    res
      .status(500)
      .send({ message: "Lỗi khi lấy dữ liệu", error: err.message });
  }
});

//API Lấy 1 dòng
router.get("/giaCLS/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const pool = await poolPromise; // Assuming poolPromise is defined elsewhere
    const result = await pool
      .request()
      .input("id", sql.Int, parseInt(id, 10))
      .query("SELECT * FROM GiaCLS WHERE id = @id");

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "Không tìm thấy dữ liệu!" });
    }

    res.status(200).json(result.recordset[0]); // Return the first item found
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu:", error);
    res.status(500).json({ error: "Lỗi khi lấy dữ liệu!" });
  }
});

// API Thêm
router.post("/giaCLS", async (req, res) => {
  const {
    Ma,
    Ten,
    DVT,
    GiaTH,
    GiaBH,
    LoaiVP,
    NhomVP,
    NhomVPBH,
    MaTD,
    TenTT43,
    GhiChu,
  } = req.body;

  try {
    const pool = await poolPromise; // Lấy pool từ mssql

    // Bước 1: Kiểm tra mã đã tồn tại
    const checkQuery = "SELECT COUNT(*) AS count FROM GiaCLS WHERE Ma = @Ma";
    const checkResult = await pool
      .request()
      .input("Ma", sql.NVarChar, Ma)
      .query(checkQuery);

    if (checkResult.recordset[0].count > 0) {
      // Nếu mã đã tồn tại, trả về lỗi
      return res
        .status(400)
        .json({ error: "Mã đã tồn tại. Vui lòng nhập mã khác." });
    }

    // Bước 2: Thêm mới dữ liệu nếu không có mã trùng
    const result = await pool
      .request()
      .input("Ma", sql.NVarChar, Ma)
      .input("Ten", sql.NVarChar, Ten)
      .input("DVT", sql.NVarChar, DVT)
      .input("GiaTH", sql.Float, GiaTH || 0)
      .input("GiaBH", sql.Float, GiaBH || 0)
      .input("LoaiVP", sql.NVarChar, LoaiVP)
      .input("NhomVP", sql.NVarChar, NhomVP)
      .input("NhomVPBH", sql.NVarChar, NhomVPBH)
      .input("MaTD", sql.NVarChar, MaTD)
      .input("TenTT43", sql.NVarChar, TenTT43)
      .input("GhiChu", sql.NVarChar, GhiChu || "")
      .query(
        "INSERT INTO GiaCLS (Ma, Ten, DVT, GiaTH, GiaBH, LoaiVP, NhomVP, NhomVPBH, MaTD, TenTT43, GhiChu) VALUES (@Ma, @Ten, @DVT, @GiaTH, @GiaBH, @LoaiVP, @NhomVP, @NhomVPBH, @MaTD, @TenTT43, @GhiChu)"
      );

    res
      .status(201)
      .json({ message: "Thêm thành công", id: result.rowsAffected[0] });
  } catch (err) {
    console.error("Lỗi :", err);
    res.status(500).json({ error: "Lỗi." });
  }
});

// API Xóa
router.delete("/giaCLS/:id", async (req, res) => {
  const { id } = req.params;
  const deleteId = parseInt(id, 10);

  try {
    const pool = await poolPromise; // Lấy pool từ mssql
    // Sử dụng pool.request() để khai báo biến @id
    const result = await pool
      .request()
      .input("id", sql.Int, deleteId) // Khai báo biến @id với kiểu dữ liệu
      .query("DELETE FROM GiaCLS WHERE id = @id");

    console.log("Kết quả truy vấn:", result);
    console.log("Số dòng bị ảnh hưởng:", result.rowsAffected); // In ra số dòng bị ảnh hưởng

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: "Không tìm thấy dòng cần xóa!" });
    }

    res.status(200).json({ message: "Xóa thành công!" });
  } catch (error) {
    console.error("Chi tiết lỗi:", error);
    res.status(500).json({ error: "Lỗi khi xóa dòng!" });
  }
});

// Cập nhật một dòng dữ liệu
router.put("/giaCLS/:id", async (req, res) => {
  const { id } = req.params; // Nhận id từ tham số URL
  const updateId = parseInt(id, 10);
  const {
    Ma,
    Ten,
    DVT,
    GiaTH,
    GiaBH,
    LoaiVP,
    NhomVP,
    NhomVPBH,
    MaTD,
    TenTT43,
    GhiChu,
  } = req.body;

  try {
    const pool = await poolPromise; // Lấy pool từ mssql
    console.log("ID để cập nhật:", id);
    console.log("Dữ liệu cần cập nhật:", req.body);
    const result = await pool
      .request()
      .input("id", sql.Int, updateId) // Khai báo biến @id với kiểu dữ liệu
      .input("Ma", sql.NVarChar, Ma)
      .input("Ten", sql.NVarChar, Ten)
      .input("DVT", sql.NVarChar, DVT)
      .input("GiaTH", sql.Float, GiaTH)
      .input("GiaBH", sql.Float, GiaBH)
      .input("LoaiVP", sql.NVarChar, LoaiVP)
      .input("NhomVP", sql.NVarChar, NhomVP)
      .input("NhomVPBH", sql.NVarChar, NhomVPBH)
      .input("MaTD", sql.NVarChar, MaTD)
      .input("TenTT43", sql.VarChar, TenTT43)
      .input("GhiChu", sql.NVarChar, GhiChu)
      .query(`UPDATE GiaCLS SET Ma = @Ma, Ten = @Ten, DVT = @DVT, GiaTH = @GiaTH, GiaBH = @GiaBH,
              LoaiVP = @LoaiVP, NhomVP = @NhomVP, NhomVPBH = @NhomVPBH, MaTD = @MaTD,
              TenTT43 = @TenTT43, GhiChu = @GhiChu WHERE id = @id`); // Sử dụng biến @id

    if (result.rowsAffected[0] === 0) {
      return res
        .status(404)
        .json({ error: "Không tìm thấy dòng cần cập nhật!" });
    }

    res.status(200).json({ message: "Cập nhật thành công!" });
    console.log("Số dòng bị ảnh hưởng:", result.rowsAffected[0]);
  } catch (error) {
    console.error("Chi tiết lỗi:", error);
    res.status(500).json({ error: "Lỗi khi cập nhật dòng!" });
  }
});

//import excel
router.post("/giaCLS/import", async (req, res) => {
  const items = req.body; // Dữ liệu từ file Excel
  const pool = await poolPromise;
  console.log("Dữ liệu nhận được từ client:", items); // In ra dữ liệu nhận được

  try {
    // Bước 1: Lấy danh sách mã đã có trong cơ sở dữ liệu
    const existingCodesResult = await pool
      .request()
      .query("SELECT Ma FROM GiaCLS");
    const existingCodes = existingCodesResult.recordset.map((row) => row.Ma); // Tạo mảng chứa các mã đã có

    const errors = [];
    const successfulInserts = [];

    for (const item of items) {
      // Kiểm tra từng trường có giá trị hợp lệ
      if (!item.Ma || typeof item.Ma !== "string" || item.Ma.trim() === "") {
        errors.push(
          `Giá trị 'Ma' không hợp lệ cho mục: ${JSON.stringify(item)}`
        );
        continue; // Bỏ qua mục này và chuyển sang mục tiếp theo
      }
      if (!item.Ten || typeof item.Ten !== "string" || item.Ten.trim() === "") {
        errors.push(
          `Giá trị 'Ten' không hợp lệ cho mục: ${JSON.stringify(item)}`
        );
        continue; // Bỏ qua mục này và chuyển sang mục tiếp theo
      }

      // Bước 2: Kiểm tra xem mã đã tồn tại hay chưa
      if (existingCodes.includes(item.Ma)) {
        errors.push(
          `Mã '${item.Ma}' đã tồn tại. Bỏ qua mục: ${JSON.stringify(item)}`
        );
        continue; // Bỏ qua mục này và chuyển sang mục tiếp theo
      }

      // Bước 3: Nếu không có lỗi, thực hiện thêm mới dữ liệu
      try {
        await pool
          .request()
          .input("Ma", sql.NVarChar, item.Ma)
          .input("Ten", sql.NVarChar, item.Ten)
          .input("DVT", sql.NVarChar, item.DVT || "")
          .input("GiaTH", sql.Float, item.GiaTH || 0)
          .input("GiaBH", sql.Float, item.GiaBH || 0)
          .input("LoaiVP", sql.NVarChar, item.LoaiVP || "")
          .input("NhomVP", sql.NVarChar, item.NhomVP || "")
          .input("NhomVPBH", sql.NVarChar, item.NhomVPBH || "")
          .input("MaTD", sql.NVarChar, item.MaTD || "")
          .input("TenTT43", sql.NVarChar, item.TenTT43 || "")
          .input("GhiChu", sql.NVarChar, item.GhiChu || "")
          .query(
            "INSERT INTO GiaCLS (Ma, Ten, DVT, GiaTH, GiaBH, LoaiVP, NhomVP, NhomVPBH, MaTD, TenTT43, GhiChu) VALUES (@Ma, @Ten, @DVT, @GiaTH, @GiaBH, @LoaiVP, @NhomVP, @NhomVPBH, @MaTD, @TenTT43, @GhiChu)"
          );

        successfulInserts.push(item.Ma); // Lưu mã thành công đã được thêm
      } catch (insertError) {
        console.error("Lỗi khi thêm mới:", insertError);
        errors.push(`Lỗi khi thêm mã '${item.Ma}': ${insertError.message}`);
      }
    }

    // Bước 4: Trả về kết quả
    if (errors.length > 0) {
      return res.status(400).json({ errors, successfulInserts });
    }

    res
      .status(201)
      .json({ message: "Nhập dữ liệu thành công!", successfulInserts });
  } catch (err) {
    console.error("Lỗi:", err); // In ra lỗi để biết thông tin chi tiết
    res.status(500).json({ error: "Lỗi khi nhập dữ liệu." });
  }
});

const giaCLSController = require("../controllers/GiaCLSController");

// Endpoint để xóa nhiều dòng
router.post("/delete-multiple", giaCLSController.deleteMultiple);

module.exports = router;
