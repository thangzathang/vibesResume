import React, { useEffect, useState } from "react";
import useSWR from "swr";
import Image from "next/image";

// FlowBite
import { Label, Checkbox, TextInput, Button, Spinner } from "flowbite-react";

// Component
import MoviesList from "../../components/MoviesList";

const options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": `52644b208cmsh00d0037ea531929p1a6804jsn4736295c5ec9`,
    "X-RapidAPI-Host": "online-movie-database.p.rapidapi.com",
  },
};

// swr fetcher
const fetcher = (...args) => fetch(...args).then((res) => res.json());

const index = () => {
  const [movieName, setMovieName] = useState("");
  const [movieYear, setMovieYear] = useState("");
  const [movieComment, setMovieComment] = useState("");
  //   const [moviePosterURL, setMoviePosterURL] = useState("https://m.media-amazon.com/images/M/MV5BZDA0OGQxNTItMDZkMC00N2UyLTg3MzMtYTJmNjg3Nzk5MzRiXkEyXkFqcGdeQXVyMjUzOTY1NTc@._V1_.jpg");
  const [moviePosterURL, setMoviePosterURL] = useState("");
  const [movieScore, setMovieScore] = useState("");
  const [movieList, setMovieList] = useState([]);

  // Loading State
  const [loading, setLoading] = useState(false);

  // Fetch all movies
  const { data, error, isLoading } = useSWR("http://localhost:5000/movies", fetcher);
  if (error) return <div>failed to load</div>;

  // Handle Submit
  async function handleSubmit(e, type) {
    e.preventDefault();
    setLoading(true);

    // If movie poster URL is blank, we have not selected a movie.
    if (moviePosterURL === "") {
      await fetch(`https://online-movie-database.p.rapidapi.com/title/find?q=${movieName}`, options)
        .then((response) => response.json())
        .then((response) => {
          // console.log("Movies retrieved:", response.results);

          // Only movies with images
          var newMovieArray = response.results.reduce(function (filtered, movie) {
            if (movie.hasOwnProperty("image")) {
              filtered.push(movie);
            }
            return filtered;
          }, []);
          console.log("New Movie List:", newMovieArray);
          setMovieList([...newMovieArray]);
          setLoading(false);
        })
        .catch((err) => console.error(err));
    }

    // Submit Movie
    try {
      const body = {
        //
        movie_name: movieName,
        movie_description: movieComment,
        movie_rating: movieScore,
        movie_year: movieYear,
        imageurl: moviePosterURL,
      };
      const response = await fetch("http://localhost:5000/movies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      console.log("Sent: ", response);

      // Reset All Back
      if (response) setLoading(false);

      setMovieList([]);
      setMovieName("");
      setMovieYear("");
      setMovieName("");
      setMoviePosterURL("");
    } catch (error) {
      console.log("Error at fetch:", error);
    }
  }

  // Handle Movie Click
  function handleItemClick(movie) {
    console.log("Movie click with:", movie);

    setMovieName(movie.title);
    setMovieYear(movie.year);
    setMoviePosterURL(movie.image.url);
    setMovieList([]);
  }

  return (
    <div>
      <main className="">
        <section className=" bg-green-600 pt-8 flex flex-col justify-center items-center">
          {/* Form */}
          <div className="text-2xl font-bold text-white">Fresh Pear 🍐</div>
          <div className="flex flex-col justify-center w-5/6 sm:w-1/2 mb-20">
            <form onSubmit={handleSubmit} className="flex flex-col">
              {/* Search Movie  */}
              <div className="mt-8">
                <div>
                  <div className="mb-2 block ">{!moviePosterURL && <div className="text-white text-base">Movie Name</div>}</div>
                  {moviePosterURL === "" ? (
                    <TextInput
                      onChange={(e) => {
                        setMovieName(e.target.value);
                      }}
                      id="movie_name"
                      type="text"
                      placeholder="Avatar 2"
                      required={true}
                    />
                  ) : (
                    <>
                      <div className="text-2xl font-bold text-white flex justify-center">{movieName}</div>
                      <div className="text-lg font-bold text-white flex justify-center">({movieYear})</div>
                    </>
                  )}
                </div>
                {!moviePosterURL && (
                  <div className="flex justify-end">
                    <Button className="my-4 bg-green-800 hover:bg-green-900 hover:text-2xl w-full md:w-1/3" type="submit">
                      Search
                    </Button>
                  </div>
                )}
              </div>
              {/* DIsplay Movie Poster, then comment and then rating */}
              {moviePosterURL && (
                <div className="">
                  <div className="flex justify-center">
                    <Image
                      //
                      className="my-4 rounded-lg"
                      height={100}
                      width={120}
                      src={moviePosterURL ? moviePosterURL : ""}
                      alt={"Movie poster"}
                    />
                  </div>

                  <div>
                    <div className="mb-2 block">
                      <div className="text-white text-base">Movie Comment</div>
                    </div>
                    <TextInput
                      onChange={(e) => {
                        setMovieComment(e.target.value);
                      }}
                      id="movie_comment"
                      type="text"
                      placeholder="Great visuals, cinematography"
                      required={true}
                    />
                  </div>
                  <div>
                    <div className="mb-2 block ">
                      <div className="text-white text-base">Movie Rating</div>
                    </div>
                    <TextInput
                      onChange={(e) => {
                        setMovieScore(e.target.value);
                      }}
                      id="movie_score"
                      type="number"
                      placeholder="1- 10"
                      required={true}
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button className="my-4 bg-green-800 hover:bg-green-900 hover:text-2xl w-full md:w-1/2" type="submit">
                      Submit Review
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Loading Spinner */}
          {loading && <Spinner aria-label="Default status example" />}

          <div className="text-2xl text-white font-bold">Past Movie Reviews:</div>

          <div className="flex flex-wrap justify-center items-center space-x-2 space-y-2 p-4 ">
            {movieList.length === 0 && <div className="text-white italic text-xl mt-12">No past movie reviews</div>}
            {movieList.map((movie, index) => {
              return (
                <div
                  key={movie.id}
                  className={`
                bg-gray-800 
                min-w-full
                sm: min-w-3/12
                rounded-lg 
                flex 
                flex-col 
                flex-wrap
                justify-center 
                items-center
                py-4
                px-8
                my-4
                `}
                >
                  <div className="mt-2">
                    <button onClick={() => handleItemClick(movie)} className="text-green-100 text-2xl sm:text-lg border-2 px-8 rounded-md">
                      Select
                    </button>
                  </div>
                  <div className="text-lg text-white pt-4">{movie.title}</div>
                  <div className="text-sm text-white">({movie.year})</div>
                  {/* <div>{movie?.image?.url && movie?.image?.url}</div> */}
                  {movie?.image?.url && (
                    <Image
                      //
                      className="p-2 mt-2 rounded-sm"
                      height={100}
                      width={120}
                      src={movie?.image?.url}
                      alt={`Movie poster for ${movie.title}`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </section>
        <section className="bg-blue-900">
          {isLoading && (
            <div className="flex justify-center mt-8">
              <Button>
                <Spinner aria-label="Spinner button example" />
                <span className="pl-3">Loading movies...</span>
              </Button>
            </div>
          )}
          <MoviesList moviesArray={!isLoading ? data : []} />
        </section>
        {/* List of past Movie Reviews */}
      </main>
    </div>
  );
};

export default index;
