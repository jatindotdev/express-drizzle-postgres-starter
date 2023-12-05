import { routes } from "@/routes/routes";
import { errorHandler, handle404Error } from "@/utils/errors";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import { PORT } from "./utils/config";

const app = express();

app.use(express.json());
app.use(cors());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    handler: (req, res) => {
      console.log(`DDoS Attempt from ${req.ip}`);
      res.status(429).json({
        error: "Too many requests in a short time. Please try in a minute.",
      });
    },
  }),
);

app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the API",
  });
});

app.get("/healthcheck", (req, res) => {
  res.json({
    message: "Server is running",
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

app.use("/api", routes());

app.all("*", handle404Error);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
