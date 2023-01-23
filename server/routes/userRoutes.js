const router = require("express").Router();

// Database
const pool = require("../db");

// Middle ware
const authorization = require("../middleware/authorization");

// Get User movies that they themselves rated
router.get("/myMovies", authorization, async (req, res) => {
  try {
    /* New code for data design*/
    const userMovies = await pool.query(
      //
      `SELECT 
        movies.movie_id, 
        movies.movie_name, 
        movies.movie_description, 
        movies.movie_rating ,
        movies.movie_year,
        movies.imageurl
      FROM users LEFT JOIN movies ON users.user_id = movies.user_id WHERE users.user_id = $1`,
      [req.user.id]
    );

    console.log("User movies:", userMovies.rows);

    res.status(200).send(userMovies.rows);
  } catch (error) {
    console.log("Error at Homepage route", error);
    res.status(500).send("Server Error -  at Homepage route");
  }
});

module.exports = router;
