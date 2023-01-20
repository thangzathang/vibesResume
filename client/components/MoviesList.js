import React from "react";

// Next js Image
import Image from "next/image";

const MoviesList = ({ moviesArray = ["Item"] }) => {
  // console.log("Movies array: ", moviesArray);
  return (
    <div className="text-white">
      <div className="py-8 bg-green-600 flex flex-wrap justify-center items-center space-x-0 md:space-x-4 space-y-4 md:space-y-0 px-4 md:px-0">
        {moviesArray
          .slice(0)
          .reverse()
          .map((item, index) => {
            return (
              <div key={index} className="rounded-lg bg-blue-900 w-full lg:w-3/12 min-h-full p-4">
                <div className="flex flex-col items-center justify-center">
                  <div className="text-xl italic pb-2"> Name: {item.movie_name}</div>
                  <div className="text-lg pb-4">{item.movie_year}</div>
                  <div>
                    {" "}
                    {item?.imageurl ? (
                      //
                      <Image
                        //
                        className="rounded-lg"
                        height={50}
                        width={100}
                        src={item.imageurl ? item.imageurl : ""}
                        alt={"Movie poster"}
                      />
                    ) : (
                      <div className="my-20 bg-red-900">No Image</div>
                    )}
                  </div>
                </div>
                <div className="mt-8">{`${item.user_name.toUpperCase()} rated it ${item.movie_rating} / 10`}</div>
                <div className="mt-4 font-bold">Review Comment:</div>
                <div className="mt-4 mb-4 italic text-md px-4">"{item.movie_description}"</div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default MoviesList;
