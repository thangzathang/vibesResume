import React from "react";

import { Navbar } from "flowbite-react";

const NavbarComponent = ({ isAuthenticated }) => {
  // console.log("isAuthenticated:", isAuthenticated);
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
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavbarComponent;
