const express = require("express");
const path = require("path");
const cors = require("cors");
const http = require("http");
require("dotenv").config();
const sanitize = require("sanitize");
const { initSocket } = require("./socket");
const router = require("./routes");

// --- Express App ---
const app = express();

// --- CORS Middleware ---
const corsOptions = {
  origin: "http://localhost:5173", // your frontend URL
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // allowed HTTP methods
  allowedHeaders: ["Content-Type", "x-access-token"], // allowed request headers
  credentials: true, // allow cookies/auth if needed
};
app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
// app.use((req, res, next) => {
//   res.header("Cross-Origin-Resource-Policy", "cross-origin");
//   next();
// });

app.use(
  "/uploads",
  cors(corsOptions),
  express.static(path.join(process.cwd(), "uploads"))
);
// --- JSON Middleware ---
app.use(express.json());

// --- Sanitize Middleware ---
app.use(sanitize.middleware);

// --- API Routes ---
app.use("/api", router);

// --- HTTP + Socket Setup ---
const port = process.env.PORT || 8080;
const server = http.createServer(app);
initSocket(server);

// --- Start Server ---
server.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});

module.exports = server;
