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

          <div className="flex flex-wrap justify-center items-center space-x-2 space-y-2 p-4 ">
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

// let movieList = [
//   {
//     id: "/title/tt0126029/",
//     image: {
//       height: 1500,
//       id: "/title/tt0126029/images/rm955136512",
//       url: "https://m.media-amazon.com/images/M/MV5BOGZhM2FhNTItODAzNi00YjA0LWEyN2UtNjJlYWQzYzU1MDg5L2ltYWdlL2ltYWdlXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_.jpg",
//       width: 1007,
//     },
//     runningTimeInMinutes: 90,
//     title: "Shrek",
//     titleType: "movie",
//     year: 2001,
//     principals: [
//       {
//         disambiguation: "I",
//         id: "/name/nm0000196/",
//         legacyNameText: "Myers, Mike (I)",
//         name: "Mike Myers",
//         attr: ["voice"],
//         billing: 1,
//         category: "actor",
//         characters: ["Shrek", "Blind Mouse", "Opening Narration"],
//         roles: [
//           {
//             character: "Shrek",
//             characterId: "/character/ch0002004/",
//           },
//           {
//             character: "Blind Mouse",
//             characterId: "/character/ch0052191/",
//           },
//           {
//             character: "Opening Narration",
//           },
//         ],
//       },
//       {
//         disambiguation: "I",
//         id: "/name/nm0000552/",
//         legacyNameText: "Murphy, Eddie (I)",
//         name: "Eddie Murphy",
//         attr: ["voice"],
//         billing: 2,
//         category: "actor",
//         characters: ["Donkey"],
//         roles: [
//           {
//             character: "Donkey",
//             characterId: "/character/ch0002002/",
//           },
//         ],
//       },
//       {
//         id: "/name/nm0000139/",
//         legacyNameText: "Diaz, Cameron",
//         name: "Cameron Diaz",
//         attr: ["voice"],
//         billing: 3,
//         category: "actress",
//         characters: ["Princess Fiona"],
//         roles: [
//           {
//             character: "Princess Fiona",
//             characterId: "/character/ch0002001/",
//           },
//         ],
//       },
//     ],
//   },
//   {
//     id: "/title/tt0298148/",
//     image: {
//       height: 3000,
//       id: "/title/tt0298148/images/rm183384576",
//       url: "https://m.media-amazon.com/images/M/MV5BMDJhMGRjN2QtNDUxYy00NGM3LThjNGQtMmZiZTRhNjM4YzUxL2ltYWdlL2ltYWdlXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_.jpg",
//       width: 2031,
//     },
//     runningTimeInMinutes: 93,
//     title: "Shrek 2",
//     titleType: "movie",
//     year: 2004,
//     principals: [
//       {
//         disambiguation: "I",
//         id: "/name/nm0000196/",
//         legacyNameText: "Myers, Mike (I)",
//         name: "Mike Myers",
//         attr: ["voice"],
//         billing: 1,
//         category: "actor",
//         characters: ["Shrek"],
//         roles: [
//           {
//             character: "Shrek",
//             characterId: "/character/ch0002004/",
//           },
//         ],
//       },
//       {
//         disambiguation: "I",
//         id: "/name/nm0000552/",
//         legacyNameText: "Murphy, Eddie (I)",
//         name: "Eddie Murphy",
//         attr: ["voice"],
//         billing: 2,
//         category: "actor",
//         characters: ["Donkey"],
//         roles: [
//           {
//             character: "Donkey",
//             characterId: "/character/ch0002002/",
//           },
//         ],
//       },
//       {
//         id: "/name/nm0000139/",
//         legacyNameText: "Diaz, Cameron",
//         name: "Cameron Diaz",
//         attr: ["voice"],
//         billing: 3,
//         category: "actress",
//         characters: ["Princess Fiona"],
//         roles: [
//           {
//             character: "Princess Fiona",
//             characterId: "/character/ch0002001/",
//           },
//         ],
//       },
//     ],
//   },
//   {
//     id: "/title/tt0413267/",
//     image: {
//       height: 2048,
//       id: "/title/tt0413267/images/rm4214262784",
//       url: "https://m.media-amazon.com/images/M/MV5BOTgyMjc3ODk2MV5BMl5BanBnXkFtZTcwMjY0MjEzMw@@._V1_.jpg",
//       width: 1382,
//     },
//     runningTimeInMinutes: 93,
//     title: "Shrek the Third",
//     titleType: "movie",
//     year: 2007,
//     principals: [
//       {
//         disambiguation: "I",
//         id: "/name/nm0000196/",
//         legacyNameText: "Myers, Mike (I)",
//         name: "Mike Myers",
//         attr: ["voice"],
//         billing: 1,
//         category: "actor",
//         characters: ["Shrek"],
//         roles: [
//           {
//             character: "Shrek",
//             characterId: "/character/ch0002004/",
//           },
//         ],
//       },
//       {
//         id: "/name/nm0000139/",
//         legacyNameText: "Diaz, Cameron",
//         name: "Cameron Diaz",
//         attr: ["voice"],
//         billing: 3,
//         category: "actress",
//         characters: ["Princess Fiona"],
//         roles: [
//           {
//             character: "Princess Fiona",
//             characterId: "/character/ch0002001/",
//           },
//         ],
//       },
//       {
//         disambiguation: "I",
//         id: "/name/nm0000552/",
//         legacyNameText: "Murphy, Eddie (I)",
//         name: "Eddie Murphy",
//         attr: ["voice"],
//         billing: 2,
//         category: "actor",
//         characters: ["Donkey"],
//         roles: [
//           {
//             character: "Donkey",
//             characterId: "/character/ch0002002/",
//           },
//         ],
//       },
//     ],
//   },
//   {
//     id: "/title/tt0892791/",
//     image: {
//       height: 593,
//       id: "/title/tt0892791/images/rm3802959104",
//       url: "https://m.media-amazon.com/images/M/MV5BMTY0OTU1NzkxMl5BMl5BanBnXkFtZTcwMzI2NDUzMw@@._V1_.jpg",
//       width: 400,
//     },
//     runningTimeInMinutes: 95,
//     title: "Shrek Forever After",
//     titleType: "movie",
//     year: 2010,
//     principals: [
//       {
//         disambiguation: "I",
//         id: "/name/nm0000196/",
//         legacyNameText: "Myers, Mike (I)",
//         name: "Mike Myers",
//         attr: ["voice"],
//         billing: 1,
//         category: "actor",
//         characters: ["Shrek"],
//         roles: [
//           {
//             character: "Shrek",
//             characterId: "/character/ch0002004/",
//           },
//         ],
//       },
//       {
//         id: "/name/nm0000139/",
//         legacyNameText: "Diaz, Cameron",
//         name: "Cameron Diaz",
//         attr: ["voice"],
//         billing: 3,
//         category: "actress",
//         characters: ["Princess Fiona"],
//         roles: [
//           {
//             character: "Princess Fiona",
//             characterId: "/character/ch0002001/",
//           },
//         ],
//       },
//       {
//         disambiguation: "I",
//         id: "/name/nm0000552/",
//         legacyNameText: "Murphy, Eddie (I)",
//         name: "Eddie Murphy",
//         attr: ["voice"],
//         billing: 2,
//         category: "actor",
//         characters: ["Donkey"],
//         roles: [
//           {
//             character: "Donkey",
//             characterId: "/character/ch0002002/",
//           },
//         ],
//       },
//     ],
//   },
//   {
//     id: "/title/tt0897387/",
//     image: {
//       height: 1410,
//       id: "/title/tt0897387/images/rm3632146432",
//       url: "https://m.media-amazon.com/images/M/MV5BZDE0NGZkOGMtNGY4My00OTM4LTliM2MtM2Y5OTVjOTFmNTA5XkEyXkFqcGdeQXVyNDgyODgxNjE@._V1_.jpg",
//       width: 1000,
//     },
//     runningTimeInMinutes: 21,
//     title: "Shrek the Halls",
//     titleType: "tvShort",
//     year: 2007,
//     principals: [
//       {
//         disambiguation: "I",
//         id: "/name/nm0000196/",
//         legacyNameText: "Myers, Mike (I)",
//         name: "Mike Myers",
//         attr: ["voice"],
//         billing: 1,
//         category: "actor",
//         characters: ["Shrek"],
//         roles: [
//           {
//             character: "Shrek",
//             characterId: "/character/ch0002004/",
//           },
//         ],
//       },
//       {
//         disambiguation: "I",
//         id: "/name/nm0000552/",
//         legacyNameText: "Murphy, Eddie (I)",
//         name: "Eddie Murphy",
//         attr: ["voice"],
//         billing: 2,
//         category: "actor",
//         characters: ["Donkey"],
//         roles: [
//           {
//             character: "Donkey",
//             characterId: "/character/ch0002002/",
//           },
//         ],
//       },
//       {
//         id: "/name/nm0000139/",
//         legacyNameText: "Diaz, Cameron",
//         name: "Cameron Diaz",
//         attr: ["voice"],
//         billing: 3,
//         category: "actress",
//         characters: ["Princess Fiona"],
//         roles: [
//           {
//             character: "Princess Fiona",
//             characterId: "/character/ch0002001/",
//           },
//         ],
//       },
//     ],
//   },
//   {
//     id: "/title/tt3070936/",
//     image: {
//       height: 2048,
//       id: "/title/tt3070936/images/rm2746636032",
//       url: "https://m.media-amazon.com/images/M/MV5BN2U4YzBhNmYtNzAxZS00ZjcyLTg5NDEtMDM4ODVkMTZlZmNkXkEyXkFqcGdeQXVyNzMwOTY2NTI@._V1_.jpg",
//       width: 1500,
//     },
//     runningTimeInMinutes: 130,
//     title: "Shrek the Musical",
//     titleType: "movie",
//     year: 2013,
//     principals: [
//       {
//         id: "/name/nm0195421/",
//         legacyNameText: "d'Arcy James, Brian",
//         name: "Brian d'Arcy James",
//         as: "Brian D'Arcy James",
//         billing: 1,
//         category: "actor",
//         characters: ["Shrek"],
//         roles: [
//           {
//             character: "Shrek",
//             characterId: "/character/ch0002004/",
//           },
//         ],
//       },
//       {
//         disambiguation: "I",
//         id: "/name/nm1900397/",
//         legacyNameText: "Foster, Sutton (I)",
//         name: "Sutton Foster",
//         billing: 2,
//         category: "actress",
//         characters: ["Fiona"],
//         roles: [
//           {
//             character: "Fiona",
//             characterId: "/character/ch0002001/",
//           },
//         ],
//       },
//       {
//         id: "/name/nm0796758/",
//         legacyNameText: "Sieber, Christopher",
//         name: "Christopher Sieber",
//         billing: 3,
//         category: "actor",
//         characters: ["Lord Farquaad"],
//         roles: [
//           {
//             character: "Lord Farquaad",
//             characterId: "/character/ch0002008/",
//           },
//         ],
//       },
//     ],
//   },
//   {
//     id: "/title/tt3915174/",
//     image: {
//       height: 1154,
//       id: "/title/tt3915174/images/rm342562561",
//       url: "https://m.media-amazon.com/images/M/MV5BNjMyMDBjMGUtNDUzZi00N2MwLTg1MjItZTk2MDE1OTZmNTYxXkEyXkFqcGdeQXVyMTQ5NjA0NDM0._V1_.jpg",
//       width: 760,
//     },
//     runningTimeInMinutes: 102,
//     title: "Puss in Boots: The Last Wish",
//     titleType: "movie",
//     year: 2022,
//     principals: [
//       {
//         id: "/name/nm0000104/",
//         legacyNameText: "Banderas, Antonio",
//         name: "Antonio Banderas",
//         attr: ["voice"],
//         billing: 1,
//         category: "actor",
//         characters: ["Puss in Boots"],
//         roles: [
//           {
//             character: "Puss in Boots",
//           },
//         ],
//       },
//       {
//         id: "/name/nm0000161/",
//         legacyNameText: "Hayek, Salma",
//         name: "Salma Hayek",
//         attr: ["voice"],
//         billing: 2,
//         category: "actress",
//         characters: ["Kitty Softpaws"],
//         roles: [
//           {
//             character: "Kitty Softpaws",
//           },
//         ],
//       },
//       {
//         id: "/name/nm2957490/",
//         legacyNameText: "Guillén, Harvey",
//         name: "Harvey Guillén",
//         attr: ["voice"],
//         billing: 3,
//         category: "actor",
//         characters: ["Perrito"],
//         roles: [
//           {
//             character: "Perrito",
//           },
//         ],
//       },
//     ],
//   },
//   {
//     id: "/title/tt0360985/",
//     image: {
//       height: 2100,
//       id: "/title/tt0360985/images/rm2844808960",
//       url: "https://m.media-amazon.com/images/M/MV5BNDVlOWZkNTEtNTcxZS00NDVhLWFlZWItYWFhNmZmZWNhYzU1XkEyXkFqcGdeQXVyNzMwOTY2NTI@._V1_.jpg",
//       width: 1400,
//     },
//     runningTimeInMinutes: 13,
//     title: "Shrek: The Ghost of Lord Farquaad",
//     titleType: "video",
//     year: 2003,
//     principals: [
//       {
//         disambiguation: "I",
//         id: "/name/nm0000196/",
//         legacyNameText: "Myers, Mike (I)",
//         name: "Mike Myers",
//         attr: ["voice"],
//         billing: 1,
//         category: "actor",
//         characters: ["Shrek"],
//         roles: [
//           {
//             character: "Shrek",
//             characterId: "/character/ch0002004/",
//           },
//         ],
//       },
//       {
//         disambiguation: "I",
//         id: "/name/nm0000552/",
//         legacyNameText: "Murphy, Eddie (I)",
//         name: "Eddie Murphy",
//         attr: ["voice"],
//         billing: 2,
//         category: "actor",
//         characters: ["Donkey"],
//         roles: [
//           {
//             character: "Donkey",
//             characterId: "/character/ch0002002/",
//           },
//         ],
//       },
//       {
//         id: "/name/nm0000139/",
//         legacyNameText: "Diaz, Cameron",
//         name: "Cameron Diaz",
//         attr: ["voice"],
//         billing: 3,
//         category: "actress",
//         characters: ["Fiona"],
//         roles: [
//           {
//             character: "Fiona",
//             characterId: "/character/ch0002001/",
//           },
//         ],
//       },
//     ],
//   },
//   {
//     id: "/title/tt10167324/",
//     image: {
//       height: 712,
//       id: "/title/tt10167324/images/rm370499840",
//       url: "https://m.media-amazon.com/images/M/MV5BMmVkNDkwNjktODBjYi00MTczLTgzNTctZTIxNTYxNjYyMzE5XkEyXkFqcGdeQXVyNjAyNTUxMzA@._V1_.jpg",
//       width: 714,
//     },
//     runningTimeInMinutes: 2,
//     title: "Shrek is Love, Shrek is Life",
//     titleType: "video",
//     year: 2014,
//     principals: [
//       {
//         id: "/name/nm10613579/",
//         legacyNameText: "Exe, Catalyst",
//         name: "Catalyst Exe",
//         category: "actor",
//         characters: ["Narrator"],
//         roles: [
//           {
//             character: "Narrator",
//           },
//         ],
//       },
//     ],
//   },
//   {
//     id: "/title/tt0448694/",
//     image: {
//       height: 1500,
//       id: "/title/tt0448694/images/rm407879168",
//       url: "https://m.media-amazon.com/images/M/MV5BMTMxMTU5MTY4MV5BMl5BanBnXkFtZTcwNzgyNjg2NQ@@._V1_.jpg",
//       width: 960,
//     },
//     runningTimeInMinutes: 90,
//     title: "Puss in Boots",
//     titleType: "movie",
//     year: 2011,
//     principals: [
//       {
//         id: "/name/nm0000104/",
//         legacyNameText: "Banderas, Antonio",
//         name: "Antonio Banderas",
//         attr: ["voice"],
//         billing: 1,
//         category: "actor",
//         characters: ["Puss in Boots"],
//         roles: [
//           {
//             character: "Puss in Boots",
//             characterId: "/character/ch0067513/",
//           },
//         ],
//       },
//       {
//         id: "/name/nm0000161/",
//         legacyNameText: "Hayek, Salma",
//         name: "Salma Hayek",
//         attr: ["voice"],
//         billing: 2,
//         category: "actress",
//         characters: ["Kitty Softpaws"],
//         roles: [
//           {
//             character: "Kitty Softpaws",
//             characterId: "/character/ch0156582/",
//           },
//         ],
//       },
//       {
//         id: "/name/nm0302108/",
//         legacyNameText: "Galifianakis, Zach",
//         name: "Zach Galifianakis",
//         attr: ["voice"],
//         billing: 3,
//         category: "actor",
//         characters: ["Humpty Alexander Dumpty"],
//         roles: [
//           {
//             character: "Humpty Alexander Dumpty",
//             characterId: "/character/ch0012253/",
//           },
//         ],
//       },
//     ],
//   },
//   {
//     id: "/title/tt21803526/",
//     image: {
//       height: 671,
//       id: "/title/tt21803526/images/rm2183335425",
//       url: "https://m.media-amazon.com/images/M/MV5BNjFlNTQyOTItMmM1NC00NDUzLWEwYTMtMmVmMWVkMjI4NGM1XkEyXkFqcGdeQXVyODAxMTA0NjA@._V1_.jpg",
//       width: 970,
//     },
//     runningTimeInMinutes: 1,
//     title: "Shrek: I Feel Good",
//     titleType: "short",
//     year: 1996,
//     principals: [
//       {
//         disambiguation: "I",
//         id: "/name/nm0000394/",
//         legacyNameText: "Farley, Chris (I)",
//         name: "Chris Farley",
//         attr: ["voice"],
//         category: "actor",
//         characters: ["Shrek"],
//         roles: [
//           {
//             character: "Shrek",
//           },
//         ],
//       },
//       {
//         disambiguation: "I",
//         id: "/name/nm0444786/",
//         legacyNameText: "Kenny, Tom (I)",
//         name: "Tom Kenny",
//         attr: ["voice"],
//         category: "actor",
//         characters: ["Mugger"],
//         roles: [
//           {
//             character: "Mugger",
//           },
//         ],
//       },
//     ],
//   },
//   {
//     id: "/title/tt9334162/",
//     image: {
//       height: 2647,
//       id: "/title/tt9334162/images/rm3391330049",
//       url: "https://m.media-amazon.com/images/M/MV5BZDY3ZDFjZWYtNDhmNC00OGVjLWIxZDYtNzlmYTAyYjMwNTcyXkEyXkFqcGdeQXVyNTk5NzczMDE@._V1_.jpg",
//       width: 1800,
//     },
//     runningTimeInMinutes: 90,
//     title: "Shrek Retold",
//     titleType: "movie",
//     year: 2018,
//     principals: [
//       {
//         id: "/name/nm4425060/",
//         legacyNameText: "Duffrin, Grant",
//         name: "Grant Duffrin",
//         attr: ["voice"],
//         billing: 1,
//         category: "actor",
//         characters: ["Shrek", "Donkey", "Pinocchio"],
//         roles: [
//           {
//             character: "Shrek",
//           },
//           {
//             character: "Donkey",
//           },
//           {
//             character: "Pinocchio",
//           },
//         ],
//       },
//       {
//         id: "/name/nm10412630/",
//         legacyNameText: "Nitshcke, Eric",
//         name: "Eric Nitshcke",
//         billing: 3,
//         category: "actor",
//         characters: ["Donkey"],
//         roles: [
//           {
//             character: "Donkey",
//           },
//         ],
//       },
//       {
//         id: "/name/nm10293478/",
//         legacyNameText: "Antonucci, Harry",
//         name: "Harry Antonucci",
//         attr: ["voice"],
//         category: "actor",
//         characters: ["Donkey", "Captain of Guards", "Old Woman"],
//         roles: [
//           {
//             character: "Donkey",
//           },
//           {
//             character: "Captain of Guards",
//           },
//           {
//             character: "Old Woman",
//           },
//         ],
//       },
//     ],
//   },
//   {
//     disambiguation: "III",
//     id: "/name/nm1277920/",
//     image: {
//       height: 2048,
//       id: "/name/nm1277920/images/rm4156419585",
//       url: "https://m.media-amazon.com/images/M/MV5BNWQ4NjUxNTctYzFiMi00MTY1LTlhOWYtMTBjZDBmZGEwZjE2XkEyXkFqcGdeQXVyNTIxODk4OQ@@._V1_.jpg",
//       width: 1536,
//     },
//     legacyNameText: "Webb, Mark (III)",
//     name: "Mark Webb",
//     knownFor: [
//       {
//         crew: [
//           {
//             category: "transportation_department",
//             job: "transportation",
//           },
//         ],
//         summary: {
//           category: "transportation_department",
//           displayYear: "2015",
//         },
//         id: "/title/tt4046784/",
//         title: "Maze Runner: The Scorch Trials",
//         titleType: "movie",
//         year: 2015,
//       },
//       {
//         crew: [
//           {
//             category: "transportation_department",
//             job: "transportation captain: additional photography",
//           },
//         ],
//         summary: {
//           category: "transportation_department",
//           displayYear: "2018",
//         },
//         id: "/title/tt1259528/",
//         title: "Den of Thieves",
//         titleType: "movie",
//         year: 2018,
//       },
//       {
//         crew: [
//           {
//             category: "transportation_department",
//             job: "transportation coordinator: Los Angeles",
//           },
//         ],
//         summary: {
//           category: "transportation_department",
//           displayYear: "2020",
//         },
//         id: "/title/tt7737786/",
//         title: "Greenland",
//         titleType: "movie",
//         year: 2020,
//       },
//       {
//         crew: [
//           {
//             category: "transportation_department",
//             job: "transportation",
//           },
//         ],
//         summary: {
//           category: "transportation_department",
//           displayYear: "2016",
//         },
//         id: "/title/tt1628841/",
//         title: "Independence Day: Resurgence",
//         titleType: "movie",
//         year: 2016,
//       },
//     ],
//   },
//   {
//     id: "/title/tt3285224/",
//     image: {
//       height: 500,
//       id: "/title/tt3285224/images/rm3495940608",
//       url: "https://m.media-amazon.com/images/M/MV5BMjI1OTAwMTE5OV5BMl5BanBnXkFtZTgwMjk0ODA2MDE@._V1_.jpg",
//       width: 375,
//     },
//     runningTimeInMinutes: 72,
//     title: "Shrek Stories",
//     titleType: "video",
//     year: 2013,
//   },
//   {
//     id: "/title/tt21797660/",
//     image: {
//       height: 606,
//       id: "/title/tt21797660/images/rm2035944961",
//       url: "https://m.media-amazon.com/images/M/MV5BMzFkMmI1OTItMzljZS00NmRiLWEyMWEtNGE5ZmE1ZTVlNjMzXkEyXkFqcGdeQXVyODAxMTA0NjA@._V1_.jpg",
//       width: 1101,
//     },
//     runningTimeInMinutes: 3,
//     title: "Chris Farley as Shrek",
//     titleType: "short",
//     year: 1997,
//     principals: [
//       {
//         disambiguation: "I",
//         id: "/name/nm0000394/",
//         legacyNameText: "Farley, Chris (I)",
//         name: "Chris Farley",
//         attr: ["voice"],
//         billing: 1,
//         category: "actor",
//         characters: ["Shrek"],
//         roles: [
//           {
//             character: "Shrek",
//           },
//         ],
//       },
//     ],
//   },
//   {
//     id: "/title/tt2051999/",
//     image: {
//       height: 1500,
//       id: "/title/tt2051999/images/rm2183147264",
//       url: "https://m.media-amazon.com/images/M/MV5BMDFhOGVlY2MtMGVlYS00OTdjLThkNzYtOTMwMDExMTA0YjQ3XkEyXkFqcGdeQXVyNDgyODgxNjE@._V1_.jpg",
//       width: 1000,
//     },
//     runningTimeInMinutes: 6,
//     title: "Shrek: Thriller Night",
//     titleType: "short",
//     year: 2011,
//     principals: [
//       {
//         disambiguation: "II",
//         id: "/name/nm0299855/",
//         legacyNameText: "Gough, Michael (II)",
//         name: "Michael Gough",
//         attr: ["voice"],
//         billing: 1,
//         category: "actor",
//         characters: ["Shrek"],
//         roles: [
//           {
//             character: "Shrek",
//             characterId: "/character/ch0002004/",
//           },
//         ],
//       },
//       {
//         disambiguation: "I",
//         id: "/name/nm0249931/",
//         legacyNameText: "Edwards, Dean (I)",
//         name: "Dean Edwards",
//         attr: ["voice"],
//         billing: 2,
//         category: "actor",
//         characters: ["Donkey"],
//         roles: [
//           {
//             character: "Donkey",
//             characterId: "/character/ch0002002/",
//           },
//         ],
//       },
//       {
//         disambiguation: "I",
//         id: "/name/nm0276253/",
//         legacyNameText: "Fields, Holly (I)",
//         name: "Holly Fields",
//         attr: ["voice"],
//         billing: 3,
//         category: "actress",
//         characters: ["Princess Fiona"],
//         roles: [
//           {
//             character: "Princess Fiona",
//             characterId: "/character/ch0002001/",
//           },
//         ],
//       },
//     ],
//   },
//   {
//     id: "/title/tt21968060/",
//     image: {
//       height: 1920,
//       id: "/title/tt21968060/images/rm102632449",
//       url: "https://m.media-amazon.com/images/M/MV5BNzE0MjJhMjktNjBiMi00ZjFjLWFmNzYtNzc0NmFlYjIzOGQyXkEyXkFqcGdeQXVyMTQ2MzMyMTIz._V1_.jpg",
//       width: 1440,
//     },
//     runningTimeInMinutes: 94,
//     title: "Shrek Remake",
//     titleType: "video",
//     year: 2001,
//     principals: [
//       {
//         disambiguation: "I",
//         id: "/name/nm13183845/",
//         legacyNameText: "Western, Chris (I)",
//         name: "Chris Western",
//         attr: ["voice"],
//         billing: 1,
//         category: "actor",
//         characters: ["Ogre Hunter", "Geppetto"],
//         roles: [
//           {
//             character: "Ogre Hunter",
//           },
//           {
//             character: "Geppetto",
//           },
//         ],
//       },
//       {
//         id: "/name/nm0360648/",
//         legacyNameText: "Hansen, Allen",
//         name: "Allen Hansen",
//         attr: ["voice"],
//         billing: 2,
//         category: "actor",
//         characters: ["Captain Of Guards", "Blind Mice"],
//         roles: [
//           {
//             character: "Captain Of Guards",
//           },
//           {
//             character: "Blind Mice",
//           },
//         ],
//       },
//       {
//         disambiguation: "I",
//         id: "/name/nm0328514/",
//         legacyNameText: "González, Víctor (I)",
//         name: "Víctor González",
//         attr: ["voice"],
//         billing: 3,
//         category: "actor",
//         characters: ["Merry Men"],
//         roles: [
//           {
//             character: "Merry Men",
//           },
//         ],
//       },
//     ],
//   },
// ];
