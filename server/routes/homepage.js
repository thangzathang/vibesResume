const router = require("express").Router();

// Database
const pool = require("../db");

// Middle ware
const authorization = require("../middleware/authorization");

// Get All the movies and names
router.get("/", authorization, async (req, res) => {
  try {
    /* JWT tutorial code */
    // req.user has the payload from the authorization - in fact all router with the authorization has
    // res.json(req.user);
    // const user = await pool.query("SELECT user_name FROM users WHERE user_id = $1", [req.user.id]);
    // res.status(200).send(user.rows[0]);

    /* New code for data design*/
    const users = await pool.query(
      //
      "SELECT user_name FROM users LEFT JOIN movies ON users.user_id = movies.user_id WHERE users.user_id = $1",
      [req.user.id]
    );

    //
  } catch (error) {
    console.log("Error at Homepage route", error);
    res.status(500).send("Server Error -  at Homepage route");
  }
});

module.exports = router;
