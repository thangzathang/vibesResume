CREATE DATABASE movielist;

CREATE TABLE movies(
    movie_id SERIAL PRIMARY KEY,
    movie_name VARCHAR(255),
    movie_description VARCHAR(255),
    movie_rating INT
);

-- Adding New Columns to the movie table in the database movieList
-- ALTER TABLE movies
-- ADD COLUMN movie_year INT;

-- ALTER TABLE movies
-- ADD COLUMN imageUrl VARCHAR(255);