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
      `SELECT 
        users.user_name, 
        movies.movie_id, 
        movies.movie_name, 
        movies.movie_description, 
        movies.movie_rating 
      FROM users LEFT JOIN movies ON users.user_id = movies.user_id WHERE users.user_id = $1`,
      [req.user.id]
    );

    res.json(users.rows);

    //
  } catch (error) {
    console.log("Error at Homepage route", error);
    res.status(500).send("Server Error -  at Homepage route");
  }
});

// 1. Create a movie.
router.post("/movies", authorization, async (req, res) => {
  // await
  try {
    // console.log("Received", req.body);
    const { movie_name, movie_description, movie_rating, movie_year, imageurl } = req.body;

    const newMovie = await pool.query(
      `
    INSERT INTO movies (movie_name, movie_description, movie_rating, movie_year, imageurl, user_id ) 
    VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [movie_name, movie_description, movie_rating, movie_year, imageurl, req.user.id]
    );

    res.json(newMovie.rows[0]);
  } catch (error) {
    console.log("Error at POST movie:", error);
  }
});

// Update a movie
router.put("/movies/:movie_id", authorization, async (req, res) => {
  try {
    const { movie_id } = req.params;
    const { movie_name, movie_rating, movie_description } = req.body;

    console.log("Req Body:", req.body);

    const updatedMovieAllField = await pool.query(
      `
      UPDATE movies
      SET movie_name = $2,
      movie_description = $3,
      movie_rating = $4
      WHERE movie_id = $1
      AND user_id = $5
      RETURNING *
    `,
      [movie_id, movie_name, movie_description, movie_rating, req.user.id]
    );

    if (updatedMovieAllField.rows.length === 0) {
      return res.status(400).send({ message: "Unauthorized update! You are not the creator." });
    }

    return res.status(200).send("Movie was updated!");
  } catch (error) {
    console.log("Error at UPDATE a [specific] movie:", error);
  }
});

// 5. Delete a movie.
router.delete("/movies/:movie_id", authorization, async (req, res) => {
  try {
    const { movie_id } = req.params;
    const deleteMovie = await pool.query(
      `
      DELETE FROM movies
      WHERE movie_id = $1
      AND user_id =$2
       RETURNING *
      `,
      [movie_id, req.user.id]
    );

    if (deleteMovie.rows.length === 0) {
      return res.status(400).send({ message: "Unauthorized Delete! You are not the creator." });
    }

    // console.log("Movie was deleted!");
    // const allMovies = await pool.query(`SELECT * FROM movies`);
    // return res.json(allMovies.rows);

    return res.json(deleteMovie);
  } catch (error) {
    console.log("Error at DELETE a [specific] movie:", error);
  }
});

module.exports = router;
