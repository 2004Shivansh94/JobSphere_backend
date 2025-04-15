import express from "express";
import dbConnection from "./database/dbConnection.js";
import jobRouter from "./routes/jobRoutes.js";
import userRouter from "./routes/userRoutes.js";
import applicationRouter from "./routes/applicationRoutes.js";
import dotenv from "dotenv";
import cors from "cors";
import { errorMiddleware } from "./middlewares/error.js";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";

dotenv.config(); // Load environment variables

const app = express();



// ✅ CORS Middleware
const allowedOrigins = [process.env.FRONTEND_URL];

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://jobspheres.netlify.app" // ✅ Add your frontend URL here
    ],
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);



// ✅ Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
app.use((req, res, next) => {
  console.log("🔍 Request Headers:", req.headers);
  next();
});


// ✅ Routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/job", jobRouter);
app.use("/api/v1/application", applicationRouter);

// ✅ Error Middleware
app.use(errorMiddleware);

// ✅ Connect to DB
dbConnection();

export default app;
