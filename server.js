const express = require('express');
const dotenv = require('dotenv');
const mongoConnection = require("./config/db");
const userRouter = require('./routes/userRoute');
const blogRouter = require('./routes/blogRoute');
const friendsRoures = require('./routes/friendsRoute');
const chatRoutes = require('./routes/ChatRoutes')
const cors = require('cors')
dotenv.config()
mongoConnection();
const PORT = process.env.PORT || 8080;

const app = express();
const allowedOrigins = [
  "https://blog-frontend-ly3i.onrender.com",
  "http://localhost:3000"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Headers", "authorization");
  next();
});

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use('/api',userRouter)
app.use('/api',blogRouter)
app.use("/api", friendsRoures);
app.use("/api", chatRoutes);

app.listen(PORT, () => {
  console.log(`running on ${PORT}`);
});
