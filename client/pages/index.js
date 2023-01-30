import Head from "next/head";
import Image from "next/image";

export default function Home() {
  let show = process.env.NEXT_PUBLIC_PRODUCTION;
  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <small>
        You are running this application in <b>{show}</b> mode.
      </small>
    </div>
  );
}
