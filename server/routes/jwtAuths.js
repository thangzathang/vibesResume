const router = require("express").Router();

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
      INSERT INTO users (user_name, user_email, user_password) VALUES ($1, $2, $3)
      `,
      [username, email, bcryptPassword]
    );
    res.status(200).send({ "New user created:": newUser });
    // res.status(200).send({ message: "New User created" });
    // console.log("New user created:", newUser);

    // 5. Generate JWT.
    //
  } catch (error) {
    console.log("Error at Registering", error);
    res.status(500).send("Server Error -  at Registering");
  }
});

module.exports = router;
