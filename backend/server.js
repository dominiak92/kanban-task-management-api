const express = require("express");
const colors = require('colors')
const dotenv = require("dotenv").config();
const cors = require('cors');
const { errorHandler } = require("./middleware/errorMiddleware");
const connectDB = require('./config/db')
const port = process.env.PORT || 5000;
connectDB();

const app = express();

app.use(cors({
    origin: 'http://localhost:5000'
    // || 'http://localhost:3000' // Zakładając, że Twój klient działa na porcie 3000
  }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/boards", require("./routes/boardsRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));
