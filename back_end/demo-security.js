const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");

const app = express();

// WITHOUT HELMET AND MORGAN
console.log("🔴 WITHOUT Security Headers:");
app.get("/unsafe", (req, res) => {
  res.json({ message: "This endpoint has no security headers!" });
});

// WITH HELMET AND MORGAN
console.log("🟢 WITH Security Headers:");
app.use(morgan("dev")); // This will log all requests
app.use(helmet()); // This will add security headers

app.get("/safe", (req, res) => {
  res.json({ message: "This endpoint is protected!" });
});

app.listen(3001, () => {
  console.log("Demo server running on port 3001");
  console.log("Try these URLs:");
  console.log("- http://localhost:3001/unsafe (no protection)");
  console.log("- http://localhost:3001/safe (with protection)");
});
