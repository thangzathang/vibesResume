const router = require("express").Router();

// Database
const pool = require("../db");

// Middle ware
const authorization = require("../middleware/authorization");

router.get("/", authorization, async (req, res) => {
  try {
    // req.user has the payload from the authorization - in fact all router with the authorization has
    // res.json(req.user);
    const user = await pool.query("SELECT user_name FROM users WHERE user_id = $1", [req.user]);
    res.status(200).send(user.rows[0]);
  } catch (error) {
    console.log("Error at Homepage route", error);
    res.status(500).send("Server Error -  at Homepage route");
  }
});

module.exports = router;
