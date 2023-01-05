import "../styles/globals.css";

import NavbarComponent from "../components/NavbarComponent";

export default function App({ Component, pageProps }) {
  return (
    <>
      <NavbarComponent />

      <Component {...pageProps} />
    </>
  );
}
