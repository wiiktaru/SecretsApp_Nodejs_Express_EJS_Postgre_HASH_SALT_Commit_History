import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

// use the public folder for static files
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register", async (req, res) => {
  const username = req.body.email;
  const password = req.body.password;

  console.log("client side input for username: " + email);
  console.log("client side input for password: " + password);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
