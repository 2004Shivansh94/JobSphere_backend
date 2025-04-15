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

// ✅ Define allowed frontend origin
const allowedOrigins = [process.env.FRONTEND_URL];

// ✅ CORS Middleware
app.use(
  cors({
    origin: function (origin, callback) {
      console.log("🔍 Request Origin:", origin); // Log origin for debugging

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true); // Allow requests from allowed origins or no origin (e.g., Postman)
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
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
  console.log("🔍 Request Origin:", req.headers.origin);
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
