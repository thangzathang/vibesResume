import React, { useEffect, useState } from "react";

import UserMoviesList from "../../components/UserMoviesList";

const myReviews = () => {
  const [moviesArray, setMoviesArray] = useState([]);
  // console.log("Movies Array:", moviesArray);
  // 1. Fetch User's own Reviews Only. ✅
  // 2. Map the reviews. Card.  ✅
  // 3. Add the Edit button.  ✅
  // 4. Add the Delete button.  ✅
  // 5. Edit modal UI build.
  // 6. Edit fetch to backend, see edit changes.
  // 7. Delete modal UI build.
  // 8. Delete fetch to backend, see edit changes.

  async function getMyReviews() {
    try {
      const response = await fetch("http://localhost:5000/user/myMovies", {
        method: "GET",
        credentials: "include",
      });

      const moviesList = await response.json();

      setMoviesArray([...moviesList]);
    } catch (error) {
      console.log("Error at fetching myReviews", error);
    }
  }

  useEffect(() => {
    getMyReviews();
  }, []);

  return (
    <div className="bg-gray-900 min-h-screen text-white px-8 py-5">
      <div className="flex flex-wrap sm:space-x-4 space-y-4 sm:space-y-0 ">
        {moviesArray.map((item) => {
          return <UserMoviesList key={item.movie_id} item={item} />;
        })}
      </div>
    </div>
  );
};

export default myReviews;
