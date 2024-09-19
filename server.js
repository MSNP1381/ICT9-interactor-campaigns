const express = require("express");
const path = require("path");

const app = express();

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// ... rest of your server code ...

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
