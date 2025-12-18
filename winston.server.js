import express from "express";
import loggerMiddleware, { loggerInstance } from "./src/middelewares/logger.middeleware.js";

const server = express();

// use logger middleware
server.use(loggerMiddleware);

server.get("/", (req, res) => {
  res.send("Hello Winston Logger!");
});

server.get("/error", (req, res) => {
  try {
    throw new Error("Something went wrong!");
  } catch (err) {
    loggerInstance.error(err.message);
    res.status(500).send("Internal Server Error");
  }
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});


// for save only


import winston from "winston";

// Step 1: Create Winston logger instance
const loggerInstance = winston.createLogger({
  level: "info", // default log level
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    })
  ),
  transports: [
    // Show logs in console
    new winston.transports.Console(),
    // Save logs in file
    new winston.transports.File({ filename: "logs/app.log" }),
    // Save only error logs separately
    new winston.transports.File({ filename: "logs/error.log", level: "error" })
  ]
});

// Step 2: Middleware function
const loggerMiddleware = (req, res, next) => {
  const start = Date.now();

  console.log("start")

  res.on("finish", () => {
    const duration = Date.now() - start;
    const logMessage = `${req.method} ${req.originalUrl} ${res.statusCode} (${duration}ms)`;
    loggerInstance.info(logMessage);
    console.log("center")
  });
  console.log("end")

  next();
};

export default loggerMiddleware;
export { loggerInstance };

