const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const giaCLSRoutes = require("./routes/giaCLSRoutes");
const LoginRoutes = require("./routes/LoginRoutes");

const app = express();
const PORT = 5000;

// Thiết lập middleware
app.use(cors());

app.use(bodyParser.json({ limit: "50mb" })); // Điều chỉnh kích thước cho JSON
app.use(bodyParser.urlencoded({ limit: "500mb", extended: true })); // Điều chỉnh kích thước cho form-urlencoded

app.get("/", (req, res) => {
  res.redirect("/login");
});

// Định tuyến
app.use("/api", giaCLSRoutes);
app.use("/api", LoginRoutes);

const giaCLSRouter = require("./routes/giaCLSRoutes");
app.use("/api/giaCLS", giaCLSRouter);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
