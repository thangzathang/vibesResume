import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";

export default function Home() {
  let show = process.env.NEXT_PUBLIC_PRODUCTION;
  return (
    <div className="bg-gray-900 min-h-screen">
      <small>
        You are running this application in <b>{show}</b> mode.
      </small>
    </div>
  );
}
