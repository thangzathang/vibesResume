import React, { useState } from "react";

import { Label, Checkbox, TextInput, Button } from "flowbite-react";

const index = () => {
  const [movieName, setMovieName] = useState("");
  const [movieComment, setMovieComment] = useState("");
  const [movieScore, setMovieScore] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const body = { movie_name: movieName, movie_description: movieComment, movie_rating: movieScore };
      const response = await fetch("http://localhost:5000/movies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      console.log("Sent: ", response);
    } catch (error) {
      console.log("Error at fetch:", error);
    }
  }

  return (
    <div>
      <main className="">
        <section className=" bg-green-600 pt-8 flex flex-col justify-center items-center">
          {/* Form */}
          <div className="text-2xl font-bold text-white my-4">Fresh Pear 🍐</div>
          <div className="bg-green-600 w-5/6 min-h-screen sm:w-1/2">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <div className="mb-2 block ">
                  <Label className="text-white" htmlFor="movie_name" value={"Movie Name"} />
                </div>
                <TextInput
                  onChange={(e) => {
                    setMovieName(e.target.value);
                  }}
                  id="movie_name"
                  type="text"
                  placeholder="Avatar 2"
                  required={true}
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label className="text-white" htmlFor="comment" value={"Movie Comment"} />
                </div>
                <TextInput
                  onChange={(e) => {
                    setMovieComment(e.target.value);
                  }}
                  id="comment"
                  type="text"
                  required={true}
                  placeholder="Great visuals..."
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label className="text-white" htmlFor="comment" value={"Movie Score"} />
                </div>
                <TextInput
                  onChange={(e) => {
                    setMovieScore(e.target.value);
                  }}
                  id="comment"
                  type="number"
                  required={true}
                  placeholder="Between 1 - 10"
                />
              </div>

              <Button className="my-4 bg-green-800 hover:bg-green-900 hover:text-2xl" type="submit">
                Submit
              </Button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
};

export default index;
