import React, { useState, useContext } from "react";
import { useRouter } from "next/router";
import { Checkbox, Spinner } from "flowbite-react";

// Toast
import { toast } from "react-toastify";

// User Context
import { UserContext } from "../../context/UserContext";

const formStyle = {
  display: "flex",
  flexDirection: "column",
  maxWidth: "560px",
};

const Login = () => {
  // Router
  const router = useRouter();

  // User Context
  const user = useContext(UserContext);

  // State
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState("password");
  const [email, setEmail] = useState("");
  // Loading State
  const [loading, setLoading] = useState(false);

  // Handle Submit
  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      const body = { password, email };
      let localHost = process.env.NEXT_PUBLIC_API;
      console.log("Calling:", `${localHost}/auth/login`);
      const response = await fetch(`${localHost}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });

      const parseResponse = await response.json();
      console.log("User is:", parseResponse.user);
      user.setUser(parseResponse.user);

      if (parseResponse.token) {
        // Don't need to use Local Storage - already set in browser cookie.;
        // Save user info to local state - not token, just information.
        localStorage.setItem("userInfo", JSON.stringify(parseResponse.user));
        toast("Successfully Logged In!");
        setLoading(false);
        router.push("/moviesPage");
        return;
      } else {
        toast(parseResponse.message);
      }
    } catch (error) {
      console.log("Error at Logging in: login.js", error);
    }
  };

  {
    /* Loading Spinner */
  }
  {
    loading && <Spinner aria-label="Default status example" />;
  }

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <div className="mx-8">
        <h1 className="py-8 text-2xl">Login</h1>
        <form style={formStyle} onSubmit={(e) => handleSubmit(e)}>
          <label htmlFor="email">Email</label>
          <input required={true} className="text-black" type="text" name="email" id="email" onChange={(e) => setEmail(e.target.value)} />

          <label htmlFor="password" className="mt-8">
            Password
          </label>
          <input required={true} className="text-black" type={`${showPassword}`} name="password" id="password" onChange={(e) => setPassword(e.target.value)} />

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

          <button className="font-bold" type="submit">
            <div className="active:text-lg rounded-lg p-4 bg-green-500 mt-8 flex justify-center items-center">Login</div>
          </button>
        </form>
        <div className="mt-9">
          <div className="mb-4">Don't have an account?</div>
          <button onClick={() => router.push("/auth/register")} className="underline" type="submit">
            Register here
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
