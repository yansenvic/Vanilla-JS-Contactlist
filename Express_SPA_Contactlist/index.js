const express = require("express");
const path = require("path");
const app = express();
const port = 3000;

app.use(express.static("src"));
app.use(express.static("public"));
app.use(express.static("component"));

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(port, () => {
  console.log("Running on port " + port);
});

// penjelasan tentang request di dalam app.get adalah data" yang melakukan akses terhadap server
// app.get("/user", (req, res) => {
//   var obj = {
//     ip: req.ip,
//     method: req.method,
//   };
//   res.json(obj);
// });
