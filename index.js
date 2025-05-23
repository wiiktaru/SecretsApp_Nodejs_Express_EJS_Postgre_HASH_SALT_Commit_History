import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import env from "dotenv";
import bcrypt from "bcrypt";

const app = express();
const port = 3000;
const saltRounds = 10;
env.config();

const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));

// use the public folder for static files
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.post("/register", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  console.log("client side input for username: " + email);
  console.log("client side input for password: " + password);

  try {
    const checkIfEmailExistsInDB = await db.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (checkIfEmailExistsInDB.rows.lengt > 0) {
      res.send("Email already exists. Try logging in");
    } else {
      //Passworg hashing
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
          console.log("Error hashing password", err);
        } else {
          const result = await db.query(
            "INSERT INTO users (email, password) VALUES ($1, $2)",
            [email, hash]
          );
          console.log(result);
          res.render("secrets.ejs");
        }
      });
    }
  } catch (err) {
    console.log(err);
  }
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const loginPassword = req.body.password;

  console.log("client side input for username: " + email);
  console.log("client side input for password: " + loginPassword);

  res.render("secrets.ejs");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
