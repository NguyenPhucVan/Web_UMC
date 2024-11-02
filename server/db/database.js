const sql = require("mssql");

// Cấu hình kết nối với SQL Server
const dbConfig = {
  user: "sa",
  password: "sapassword",
  server: "PC-0369\\SQLEXPRESS", // Hoặc chỉ là "PC-0369"
  database: "DHYD_Web",
  port: 1433,
  options: {
    encrypt: false, // Nếu sử dụng Azure SQL, hãy để là true
    trustServerCertificate: true, // Đặt true nếu kết nối local
  },
};

const poolPromise = new sql.ConnectionPool(dbConfig)
  .connect()
  .then((pool) => {
    console.log("Kết nối SQL Server thành công!");
    return pool; // Trả về pool
  })
  .catch((err) => {
    console.error("Kết nối SQL Server thất bại: ", err);
    throw err; // Ném lại lỗi để dễ theo dõi
  });

module.exports = {
  sql,
  poolPromise,
};
