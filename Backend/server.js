const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

const requestRoutes = require("./routes/requests");

app.use("/requests", requestRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));