import React, { useState } from "react";
import { useRouter } from "next/router";

// Toast
import { toast } from "react-toastify";

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

  // Message
  const [message, setMessage] = useState("");

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const body = { username, password, email };

      const response = await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });

      const parseResponse = await response.json();
      // console.log("Data we get back (register):", parseResponse);

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
    <div>
      <h1>{message}</h1>

      <h1>Register</h1>

      <form style={formStyle} onSubmit={(e) => handleSubmit(e)}>
        <label htmlFor="username"> Username </label>
        <input type="text" name="username" id="username" onChange={(e) => setUsername(e.target.value)} />

        <label htmlFor="email"> Email </label>
        <input type="text" name="email" id="email" onChange={(e) => setEmail(e.target.value)} />

        <label htmlFor="password"> Password </label>
        <input type="text" name="password" id="password" onChange={(e) => setPassword(e.target.value)} />

        <button type="submit" className="bg-green-500 p-8 m-4">
          {" "}
          Register{" "}
        </button>
      </form>
    </div>
  );
};

export default Register;
