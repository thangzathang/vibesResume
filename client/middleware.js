import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside

export async function middleware(request) {
  const token = await request.cookies.get("token")?.value;
  console.log("Token:", token);
  const { pathname } = request.nextUrl;

  if (request.url.includes("/auth/login")) {
    return NextResponse.next();
  }

  if (request.url.includes("/moviesPage" && token)) {
    return NextResponse.next();
  }

  // if (request.url.includes("/moviesPage") && !token) {
  //   const url = request.nextUrl.clone();
  //   url.pathname = "/auth/login";
  //   return NextResponse.rewrite(url);
  // }

  if (!token) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.rewrite(url);
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    //
    // "/",
    "/((?!_next/static|favicon.ico|login|).*)",
    "/moviesPage",
    "/auth/login",
    "/auth/register",
    "/user/myReviews",
    "/user/myMovies",
  ],
};
