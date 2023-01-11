const router = require("express").Router();
const jwtGenerator = require("../utils/jwtGenerator");

// Bcrypt
const bcrypt = require("bcrypt");

// Database
const pool = require("../db");

// Registering
router.post("/register", async (req, res) => {
  try {
    // 1. Get data
    const { username, email, password } = req.body;

    // 2. Check if user exists
    const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [email]);

    // If User exists
    if (user.rows.length !== 0) {
      console.log("User already Exists:", user.rows);
      res.status(401).send({ message: "User already exists", data: user.rows });
      return;
    }

    // res.json(user.rows);

    // 3. Bcrypt the user password.
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const bcryptPassword = await bcrypt.hash(password, salt);

    // 4. Add the user to database.
    // NOTE: We store the encrypted password, not the password itself.
    const newUser = await pool.query(
      `
      INSERT INTO users (user_name, user_email, user_password) 
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [username, email, bcryptPassword]
    );

    // res.status(200).send({ "New user created:": newUser });
    // res.status(200).send({ message: "New User created" });

    // 5. Generate JWT.
    const token = jwtGenerator(newUser.rows[0].user_id);
    res.status(200).send({ token });
  } catch (error) {
    console.log("Error at Registering", error);
    res.status(500).send("Server Error -  at Registering");
  }
});

// Login Route
router.post("/login", async (req, res) => {
  try {
    // 1. Get data
    const { email, password } = req.body;

    // 2. Check if user exists
    const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [email]);

    console.log("User is:", user.rows[0]);

    // If user does not exist
    if (user.rows.length === 0) {
      return res.status(401).send({ message: "User with email does not exist" });
    }

    // 3. Check password
    const validPassword = await bcrypt.compare(password, user.rows[0].user_password);

    console.log("Valid password:", validPassword);
    if (!validPassword) {
      return res.status(401).send({ message: "Incorrect Password" });
    }

    // 4. Give JWT Token
    const token = jwtGenerator(user.rows[0].user_id);
    res.status(200).send({ token });
  } catch (error) {
    console.log("Error at Login Route", error);
    res.status(500).send("Server Error -  at Logging in");
  }
});

module.exports = router;
