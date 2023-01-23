const router = require("express").Router();

// Database
const pool = require("../db");

// Middle ware
const authorization = require("../middleware/authorization");

// 1. Get User movies that they themselves rated
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

// 2. Update a movie.
router.put("/movies/:movie_id", authorization, async (req, res) => {
  try {
    const { movie_id } = req.params;
    const { movie_rating, movie_description } = req.body;

    console.log("Req Body:", req.body);
    console.log("Req Params:", req.params);

    const updatedMovieAllField = await pool.query(
      `
      UPDATE movies
      SET movie_description = $2,
      movie_rating = $3
      WHERE movie_id = $1
    `,
      [movie_id, movie_description, movie_rating]
    );

    res.json("Movie was updated!");
  } catch (error) {
    console.log("Error at UPDATE a [specific] movie:", error);
  }
});

module.exports = router;
