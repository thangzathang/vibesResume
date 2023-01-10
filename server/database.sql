CREATE DATABASE movielist;

-- Create Movie 
CREATE TABLE movies(
    movie_id SERIAL PRIMARY KEY,
    movie_name VARCHAR(255),
    movie_description VARCHAR(255),
    movie_rating INT
);

-- set extension
-- Create Users
CREATE TABLE users(
    user_id uuid PRIMARY KEY DEFAULT 
    uuid_generate_v4(),
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    user_password VARCHAR(255) NOT NULL
);

-- Adding New Columns to the movie table in the database movieList
-- ALTER TABLE movies
-- ADD COLUMN movie_year INT;

-- ALTER TABLE movies
-- ADD COLUMN imageUrl VARCHAR(255);