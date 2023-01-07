const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const app = express();
dotenv.config();

// Database
const pool = require("./db");
// console.log("pool:", pool);

// PORT
let PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server has started on port ${PORT}.`);
});

// Routes

// 1. Create a movie.
app.post("/movies", async (req, res) => {
  // await
  try {
    // console.log("Received", req.body);
    const { movie_name, movie_description, movie_rating, movie_year, imageurl } = req.body;

    const newMovie = await pool.query(
      `
    INSERT INTO movies (movie_name, movie_description, movie_rating, movie_year, imageurl ) 
    VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [movie_name, movie_description, movie_rating, movie_year, imageurl]
    );

    res.json(newMovie.rows[0]);
  } catch (error) {
    console.log("Error at POST movie:", error);
  }
});

// 2. Get all movies.
app.get("/movies", async (req, res) => {
  try {
    const allMovies = await pool.query(`SELECT * FROM movies`);

    res.json(allMovies.rows);
  } catch (error) {
    console.log("Error at GET movies:", error);
  }
});

// 3. Get a [specific] movie.
app.get("/movies/:movie_id", async (req, res) => {
  try {
    const { movie_id } = req.params;

    // 1. This works
    // const movieData = await pool.query(
    //   `
    //   SELECT * FROM movies WHERE movie_id = ${movie_id};
    // `
    // );

    // 2. This works too
    const movieData = await pool.query(
      `
      SELECT * FROM movies WHERE movie_id = $1
    `,
      [movie_id]
    );

    res.json(movieData.rows[0]);
  } catch (error) {
    console.log("Error at GET a [specific] movie:", error);
  }
});

// 4. Update a movie.
app.put("/movies/:movie_id", async (req, res) => {
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
    `,
      [movie_id, movie_name, movie_description, movie_rating]
    );

    res.json("Movie was updated!");
  } catch (error) {
    console.log("Error at UPDATE a [specific] movie:", error);
  }
});

// 5. Delete a movie.
app.delete("/movies/:movie_id", async (req, res) => {
  try {
    const { movie_id } = req.params;
    const deleteMovie = await pool.query(
      `
      DELETE FROM movies
      WHERE movie_id = $1
      `,
      [movie_id]
    );

    console.log("Movie was deleted!");
    const allMovies = await pool.query(`SELECT * FROM movies`);
    res.json(allMovies.rows);
  } catch (error) {
    console.log("Error at DELETE a [specific] movie:", error);
  }
});
