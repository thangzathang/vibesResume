import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request) {
  const cookie = request.cookies.get("token")?.value;
  console.log("Token Cookie:", cookie); // => [{ name: 'nextjs', value: 'fast' }]

  // console.log("We are movies page:", hey);
  // if (nextUrl.pathname === "/moviesPage") {
  //   console.log("We are movies page:");
  //   // if (req.cookies.authToken) {
  //   //   return NextResponse.rewrite("/auth/dashboard");
  //   // } else {
  //   //   return NextResponse.rewrite("/public/dashboard");
  //   // }
  // }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/moviesPage/"],
};
