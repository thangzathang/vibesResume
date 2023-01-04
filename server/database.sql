CREATE DATABASE movielist;

CREATE TABLE movies(
    movie_id SERIAL PRIMARY KEY,
    movie_name VARCHAR(255),
    movie_description VARCHAR(255),
    movie_rating INT
);