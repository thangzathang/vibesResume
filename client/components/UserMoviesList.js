import React, { useEffect, useState } from "react";

// Flowbite react
import { Modal, Label, TextInput, Checkbox, Button, Textarea, Select, Spinner } from "flowbite-react";

// Toast
import { toast } from "react-toastify";

const UserMoviesList = ({ item, setMoviesArray }) => {
  const [itemCopy, setItemCopy] = useState(item);
  // Modal State - Edit and Delete
  const [openEditModal, setEditModal] = useState(false);
  const [openDeleteModal, setDeleteModal] = useState(false);

  // Loading State
  const [loading, setLoading] = useState(false);

  // Edit Modal
  const EditModal = ({ data }) => {
    const [newMovieDescription, setNewMovieDescription] = useState(data.movie_description);
    const [movieRating, setMovieRating] = useState(data.movie_rating);

    // Submit handler
    async function handleEditSubmit(e) {
      e.preventDefault();

      const dataBody = {
        movie_description: newMovieDescription,
        movie_rating: movieRating,
      };

      // Update the View
      setItemCopy((prev) => {
        return {
          ...prev,
          movie_description: newMovieDescription,
          movie_rating: movieRating,
        };
      });

      try {
        let proxy = process.env.NEXT_PUBLIC_PRODUCTION === "production" ? process.env.NEXT_PUBLIC_PRODUCTION : "http://localhost:5000";
        const response = await fetch(`/user/movies/${data.movie_id}`, {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataBody),
        });

        if (response) {
          setEditModal(false);
          toast("Movie updated!");
        }
      } catch (error) {
        toast.error("Error with updating movie!");
        console.log("Error at updating past user media", error);
      }
    }

    return (
      <Modal
        show={openEditModal}
        size="md"
        popup={true}
        onClose={() => {
          setEditModal(false);
        }}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6 px-6 pb-4 sm:pb-6 lg:px-8 xl:pb-8">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">{data.movie_name}</h3>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="email" value="Movie description" />
              </div>
              <Textarea
                id="description"
                rows={data.movie_description?.length > 0 ? data.movie_description.length / 10 : 2}
                type="text"
                className="bg-blue-4900"
                required={false}
                value={newMovieDescription}
                onChange={(e) => {
                  setNewMovieDescription(e.target.value);
                }}
              />
            </div>
            <div>
              <div id="select">
                <div className="mb-2 block">
                  <Label htmlFor="rating" value={`You rated this movie: ${data.movie_rating} / 10.`} />
                </div>
                <Select
                  id="rating"
                  required={true}
                  value={movieRating ? movieRating : 1}
                  onChange={(e) => {
                    setMovieRating(e.target.value);
                    console.log("We chose:", e.target.value);
                  }}
                >
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                  <option>5</option>
                  <option>6</option>
                  <option>7</option>
                  <option>8</option>
                  <option>9</option>
                  <option>10</option>
                </Select>
              </div>
            </div>

            <div className="w-full flex justify-end">
              <Button className="mr-2 bg-gray-500" onClick={() => setEditModal(false)}>
                Back
              </Button>

              <Button className="" onClick={handleEditSubmit}>
                Save
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    );
  };

  // Delete Modal
  const DeleteModal = ({ data }) => {
    async function handleDeleteSubmit(e) {
      e.preventDefault();

      try {
        let proxy = process.env.NEXT_PUBLIC_PRODUCTION === "production" ? process.env.NEXT_PUBLIC_PRODUCTION : "http://localhost:5000";
        const response = await fetch(`/user/movies/${data.movie_id}`, {
          method: "DELETE",
          credentials: "include",
        });

        // Update the View
        setMoviesArray((prev) => {
          const copy = [...prev];
          console.log("All movies:", copy);
          const newMoviesArray = copy.filter((item) => item.movie_id !== data.movie_id);
          console.log("newMoviesArray:", newMoviesArray);
          return [...newMoviesArray];
        });

        if (response) {
          toast("Movie deleted");
          setDeleteModal(false);
        }
      } catch (error) {
        toast.error("Error with deleting the movie.");
        console.log("Error at updating past user media", error);
      }
    }

    return (
      <Modal show={openDeleteModal} size="md" popup={true} onClose={() => setDeleteModal(false)}>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6 px-6 pb-4 sm:pb-6 lg:px-8 xl:pb-8">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Confirm you want to <span className="font-bold text-red-600 underline">delete</span> {data.movie_name}.
            </h3>
            <div>
              <div className="mb-2 block">
                <Label className="block pb-2 text-lg" htmlFor="description" value={"Movie description:"} />
                <Label htmlFor="description" value={data.movie_description} />
              </div>
            </div>
            <div>
              <div className="mb-2 block">
                <Label className="block pb-2 text-lg" htmlFor="rating" value={"You rated the movie: "} />
                <Label htmlFor="rating" value={`${data.movie_rating} / 10`} />
              </div>
            </div>
            <div className="w-full flex justify-end">
              <Button className="mr-2 bg-gray-500" onClick={() => setDeleteModal(false)}>
                Cancel
              </Button>

              <Button className="bg-red-600" onClick={handleDeleteSubmit}>
                Confirm
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    );
  };

  {
    /* Loading Spinner */
  }
  {
    // loading && <Spinner aria-label="Default status example" />;
  }

  return (
    <div key={itemCopy.movie_id} className="w-full sm:w-4/12  min-h-4/5 overflow-auto bg-blue-900 rounded-lg">
      <div className="flex flex-col items-center relative">
        <div className="rounded-lg">
          <span onClick={() => setEditModal(true)} className="border-blue-600 border-2 hover:cursor-pointer active:text-sm text-xs w-20 absolute font-bold mt-2 p-4 right-4 flex flex-col justify-center items-center bg-blue-800 rounded-2xl">
            <span className="pb-2">Edit</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
          </span>
          <span onClick={() => setDeleteModal(true)} className="border-red-600 border-2 hover:cursor-pointer active:text-sm text-xs w-20 absolute font-bold mt-2 p-4 right-4 top-24 sm:top-0 sm:left-4 flex flex-col justify-center items-center bg-red-800 rounded-2xl">
            <span className="pb-2">Delete</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
          </span>
          <img src={itemCopy.imageurl} alt="Movie poster" className="mt-8 h-72 rounded-lg" />
        </div>
        <div className="flex flex-col p-8 justify-center">
          <div className="text-xl my-4 bg-blue-500 p-2 rounded-lg">{itemCopy.movie_name}</div>
          <div className="text-sm italic my-2 sm:ml-0 ml-24">{itemCopy.movie_year}</div>
          <div>"{itemCopy.movie_description}"</div>
          <div className="mt-5">You rated it: {itemCopy.movie_rating} / 10</div>
        </div>
      </div>
      <EditModal data={itemCopy} />
      <DeleteModal data={itemCopy} />
    </div>
  );
};

export default UserMoviesList;
