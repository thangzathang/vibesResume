import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "../styles/Home.module.css";

const inter = Inter({ subsets: ["latin"] });

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
