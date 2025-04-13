import express from "express";
import { connectToDatabase } from "./database/connectionToDatabase.js";
import dotenv from "dotenv";
import authRoutes from "./routes/auth-route.js";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();

const app = express();

// CORS configuration that works in both development and production
const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL, // Add your frontend Vercel URL here
];

app.use(cors({ 
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true 
}));

app.use(express.json()); // for parsing application/json
app.use(cookieParser()); // for parsing cookies

connectToDatabase();

app.use("/api/auth", authRoutes);

// Simple health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Handle Vercel serverless functions
export default app;