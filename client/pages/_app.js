import "../styles/globals.css";
import { useState, useEffect } from "react";

// Component
import NavbarComponent from "../components/NavbarComponent";

// Toastify
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App({ Component, pageProps }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  async function checkAuth() {
    try {
      const response = await fetch("http://localhost:5000/auth/verify", {
        method: "GET",
        headers: { token: localStorage.token },
      });

      const parseResponse = await response.json();
      console.log("Auth Server says:", parseResponse);
    } catch (error) {
      console.log("Check auth error:", error);
    }
  }

  // Check if user authenticated
  useEffect(() => {
    // verify json token
    checkAuth();
  }, []);

  return (
    <>
      <NavbarComponent />

      <ToastContainer />

      <Component {...pageProps} />
    </>
  );
}
