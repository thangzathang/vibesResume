import React, { useEffect, useState } from "react";

const myReviews = () => {
  const [moviesArray, setMoviesArray] = useState([]);
  // console.log("Movies Array:", moviesArray);
  // 1. Fetch User's own Reviews Only. ✅
  // 2. Map the reviews. Card.
  // 3. Add the Edit button.
  // 4. Add the Delete button.
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
          return (
            <div key={item.movie_id} className="max-w-xs bg-blue-900 rounded-lg min-h-4/5 overflow-auto">
              <div className="flex flex-col items-center relative">
                <div className="rounded-lg">
                  <span className="border-blue-600 border-2 hover:cursor-pointer active:text-sm text-xs w-20 absolute font-bold mt-2 p-4 right-4 flex flex-col justify-center items-center bg-blue-800 rounded-2xl">
                    <span className="pb-2">Edit</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                    </svg>
                  </span>
                  <span className="border-red-600 border-2 hover:cursor-pointer active:text-sm text-xs w-20 absolute font-bold mt-2 p-4 right-4 top-20 sm:top-0 sm:left-4 flex flex-col justify-center items-center bg-red-800 rounded-2xl">
                    <span className="pb-2">Delete</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </span>
                  <img src={item.imageurl} alt="Movie poster" className="mt-8 h-72 rounded-lg" />
                </div>
                <div className="flex flex-col p-8 justify-center">
                  <div className="text-xl my-4 bg-blue-500 p-2 rounded-lg">{item.movie_name}</div>
                  <div className="text-sm italic my-2 sm:ml-0 ml-24">{item.movie_year}</div>
                  <div>"{item.movie_description}"</div>
                  <div className="mt-5">You rated it: {item.movie_rating} / 10</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default myReviews;
