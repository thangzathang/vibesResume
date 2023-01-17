import React, { useState } from "react";
import { useRouter } from "next/router";

// Toast
import { toast } from "react-toastify";

const formStyle = {
  display: "flex",
  flexDirection: "column",
  maxWidth: "560px",
};

const Login = () => {
  // Router
  const router = useRouter();

  // State
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const body = { password, email };

      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });

      const parseResponse = await response.json();
      console.log("Data we get back (Login):", parseResponse);

      if (parseResponse.token) {
        // Don't need to use Local Storage - already set in browser cookie.;
        // localStorage.setItem("token", parseResponse.token)
        toast("Successfully Logged In!");
        router.push("/moviesPage");
        return;
      } else {
        toast(parseResponse.message);
      }
    } catch (error) {
      console.log("Error at Logging in: login.js", error);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form style={formStyle} onSubmit={(e) => handleSubmit(e)}>
        <label htmlFor="email"> Email </label>
        <input type="text" name="email" id="email" onChange={(e) => setEmail(e.target.value)} />

        <label htmlFor="password"> Password </label>
        <input type="text" name="password" id="password" onChange={(e) => setPassword(e.target.value)} />

        <button type="submit"> Login </button>
      </form>
    </div>
  );
};

export default Login;
