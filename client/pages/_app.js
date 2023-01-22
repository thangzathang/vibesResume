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
      const response = await fetch("http://localhost:5000/auth/verify", {
        method: "GET",
        credentials: "include",
        // headers: { token: localStorage.token },
      });

      const parseResponse = await response.json();
      console.log("Auth Server says:", parseResponse);
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
  }, []);

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
