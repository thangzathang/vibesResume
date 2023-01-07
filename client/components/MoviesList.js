import React from "react";

// Next js Image
import Image from "next/image";

const MoviesList = ({ moviesArray = ["Item"] }) => {
  console.log("Movies array: ", moviesArray);
  return (
    <div className="text-white">
      <div>
        {moviesArray.map((item, index) => {
          return (
            <div key={index}>
              <div className="text-lg "> Name: {item.movie_name}</div>
              <div>
                {" "}
                <Image height={50} width={50} src={item.imageurl ? item.imageurl : ""} alt={"Movie poster"} />
              </div>
              <div> {item.movie_year}</div>
              <div> {item.movie_description}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MoviesList;
