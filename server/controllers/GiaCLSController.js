const { poolPromise, sql } = require("../db/database"); // Điều chỉnh đường dẫn nếu cần

// Hàm xử lý xóa nhiều dòng
exports.deleteMultiple = async (req, res) => {
  const { ids } = req.body;

  if (!ids || ids.length === 0) {
    return res.status(400).json({ message: "Không có ID nào được cung cấp" });
  }

  try {
    const pool = await poolPromise;
    const request = pool.request();

    // Tạo chuỗi giá trị ID, ví dụ: "1, 2, 3"
    const idList = ids.join(", ");
    const query = `DELETE FROM GiaCLS WHERE Id IN (${idList})`;

    // Thực hiện truy vấn xóa
    const result = await request.query(query);

    if (result.rowsAffected[0] === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy các dòng cần xóa!" });
    }

    res.status(200).json({ message: "Xóa thành công các dòng được chọn" });
  } catch (error) {
    console.error("Lỗi khi xóa các dòng:", error);
    res.status(500).json({ message: "Lỗi khi xóa các dòng" });
  }
};
