import "../styles/globals.css";
import { useState } from "react";

// Component
import NavbarComponent from "../components/NavbarComponent";

// Toastify
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App({ Component, pageProps }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <>
      <NavbarComponent />

      <ToastContainer />

      <Component {...pageProps} />
    </>
  );
}
