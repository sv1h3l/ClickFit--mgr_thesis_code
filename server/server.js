const express = require("express");
const app = express();
const cors = require("cors");
const PORT = 8080;

app.use(cors());

app.get("/api/hello-world", (req, res) => {
  res.json({ message: "Hello World!" });
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
