import React from "react";

import { Navbar } from "flowbite-react";
import { useRouter } from "next/router";

const NavbarComponent = ({ isAuthenticated }) => {
  const router = useRouter();
  // console.log("isAuthenticated:", isAuthenticated);

  async function logout() {
    // 1. Set cookies to false
    try {
      const response = await fetch("http://localhost:5000/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      const parseResponse = await response.json();
      console.log("Logout status:", parseResponse);

      // Redirect to auth.login?
      router.reload(window.location.pathname);
    } catch (error) {
      console.log("logout error (front end):", error);
    }

    // 2. Remove item from local storage
    localStorage.removeItem("userInfo");
  }

  return (
    <Navbar fluid={true} rounded={true}>
      <Navbar.Brand href="/">Vibes.resume</Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse>
        <Navbar.Link href="/" active={false}>
          Home
        </Navbar.Link>
        <Navbar.Link href="/moviesPage">Movie List</Navbar.Link>

        {/* User Access Only */}
        {isAuthenticated && <Navbar.Link href="/user/myReviews">My Reviews</Navbar.Link>}

        {isAuthenticated && <Navbar.Link href="/user/myAccount">My Account</Navbar.Link>}

        {isAuthenticated && <Navbar.Link onClick={() => logout()}>Logout</Navbar.Link>}
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavbarComponent;
