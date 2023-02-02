import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside

export async function middleware(request) {
  const cookie = request.cookies.get("token")?.value;
  console.log("Token Cookie:", cookie?.length);

  // if (request.url.includes("/moviesPage") && !cookie) {
  //   const url = request.nextUrl.clone();
  //   url.pathname = "/auth/login";
  //   return NextResponse.rewrite(url);
  // }

  if (!cookie && !request.url.includes("/auth/register")) {
    console.log("No Cookie so redirecting to /auth/register");
    // 2. Redirect to Login
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.rewrite(url);
  }

  // Login and register will not be available to authenticated users. They will have to log out first.
  if (request.url.includes("/auth/login") && cookie) {
    console.log("Redirecting to MoviePage - already logged in!");
    const url = request.nextUrl.clone();
    url.pathname = "/moviesPage";
    return NextResponse.redirect(url);
  }

  // if (request.url.includes("/auth/register") && cookie) {
  //   const url = request.nextUrl.clone();
  //   url.pathname = "/moviesPage";
  //   return NextResponse.redirect(url);
  // }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    //
    // "/",
    "/moviesPage",
    "/auth/login",
    "/auth/register",
    "/user/myReviews",
    "/user/myMovies",
  ],
};
