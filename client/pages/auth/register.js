import React, { useState } from "react";
import { useRouter } from "next/router";

// Toast
import { toast } from "react-toastify";

// Flowbite
import { Checkbox } from "flowbite-react";

const formStyle = {
  display: "flex",
  flexDirection: "column",
  maxWidth: "560px",
};

const Register = () => {
  // Router
  const router = useRouter();

  // State
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState("password");

  // Message
  const [message, setMessage] = useState("");

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const body = { username, password, email };

      const response = await fetch(`/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });

      const parseResponse = await response.json();

      /* If User Exists */
      if (parseResponse.user) {
        // 1. Set to User Context
        user.setUser(parseResponse.user);
        // 2. Set User to local storage
        localStorage.setItem("userInfo", JSON.stringify(parseResponse.user));
      }

      if (parseResponse.token) {
        // Don't need to use Local Storage - already set in browser cookie.
        // localStorage.setItem("token", parseResponse.token);

        toast("User created!");
        router.push("/moviesPage");
        return;
      } else {
        // setMessage(parseResponse.message);
        toast(parseResponse.message);
      }
    } catch (error) {
      console.log("Error at Register: register.js", error);
    }
  };

  return (
    <div className="text-white bg-gray-900 min-h-screen pb-10">
      <h1 className="pl-8 py-8 text-2xl">Register</h1>
      <div className="flex flex-col items-center">
        <form style={formStyle} onSubmit={(e) => handleSubmit(e)} className="w-full px-8">
          <div className="flex flex-col my-4">
            <label htmlFor="username" className="my-2">
              {" "}
              Username{" "}
            </label>
            <input required={true} className="text-black" type="text" name="username" id="username" onChange={(e) => setUsername(e.target.value)} />
          </div>

          <div className="flex flex-col my-4">
            <label htmlFor="email" className="my-2">
              {" "}
              Email{" "}
            </label>
            <input required={true} className="text-black" type="text" name="email" id="email" onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="flex flex-col my-4">
            <label htmlFor="password" className="my-2">
              {" "}
              Password{" "}
            </label>
            <input required={true} className="text-black" type={`${showPassword}`} name="password" id="password" onChange={(e) => setPassword(e.target.value)} />
          </div>

          <div className="mt-5 flex items-center justify-start">
            <Checkbox
              onClick={() =>
                setShowPassword((prev) => {
                  console.log("Prev", prev);
                  if (prev === "password") {
                    return (prev = "text");
                  } else {
                    return (prev = "password");
                  }
                })
              }
              name="passwordCheckbox"
              id="passwordCheckbox"
              className="mr-2 "
            />
            <label htmlFor="passwordCheckbox" className="text-white">
              Show Password
            </label>
          </div>

          <button type="submit" className="font-bold active:text-lg rounded-lg p-4 bg-green-500 mt-8 flex justify-center items-center">
            {" "}
            Register{" "}
          </button>
        </form>
      </div>

      <div className="mt-16 mb-10 px-8">
        <div className="mb-4">Already have an account?</div>
        <button onClick={() => router.push("/auth/login")} className="underline" type="submit">
          Login here
        </button>
      </div>
    </div>
  );
};

export default Register;
