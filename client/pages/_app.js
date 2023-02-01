import "../styles/globals.css";
import { useState, useEffect } from "react";

// User Context
import { UserContext } from "../context/UserContext";

// Component
import NavbarComponent from "../components/NavbarComponent";

// Toastify
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App({ Component, pageProps }) {
  // Get user from local storage if it exists.
  useEffect(() => {
    const getUser = localStorage.getItem("userInfo");
    if (getUser) {
      setUser(JSON.parse(getUser));
    }
  }, []);

  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  async function checkAuth() {
    try {
      let localHost = process.env.NEXT_PUBLIC_LOCALHOST;
      const response = await fetch(`${localHost}/auth/verify`, {
        method: "GET",
        credentials: "include",
      });

      const parseResponse = await response.json();
      console.log("User is validated?:", parseResponse);

      if (parseResponse.verified === false) {
        // 1. Clear the old user from local storage
        localStorage.removeItem("userInfo");
      }
      if (parseResponse.verified !== false) {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.log("Check auth error:", error);
    }
  }

  // Check if user authenticated
  useEffect(() => {
    // verify json token
    checkAuth();
  }, [user]);

  return (
    <>
      <UserContext.Provider value={{ user, setUser }}>
        <NavbarComponent isAuthenticated={isAuthenticated} />
        <ToastContainer />
        <Component {...pageProps} />
      </UserContext.Provider>
    </>
  );
}
