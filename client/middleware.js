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

  if (request.url.includes("/moviesPage") && !token) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  // const url = req.nextUrl;
  // let changed = false;
  // if (
  //   pathname.startsWith("/_next") || // exclude Next.js internals
  //   pathname.startsWith("/api") || //  exclude all API routes
  //   pathname.startsWith("/static") // exclude static files
  // ) {
  //   return NextResponse.next();
  // }

  // const token = req.cookies.get("token")?.value;

  // if (token) {
  //   console.log("Changed token:", token);
  //   changed = true;
  // }

  // // Avoid infinite loop by only redirecting if the query params were changed
  // if (changed) {
  //   return NextResponse.redirect(url);
  // } else {
  //   const url = request.nextUrl.clone();
  //   url.pathname = "/auth/login";
  //   return NextResponse.redirect(url);
  // }

  // console.log("Token Cookie length:", cookie.length);
  // Old 2
  // const { pathname } = request.nextUrl;
  // const cookie = await request.cookies.get("token")?.value;
  // if (
  //   pathname.startsWith("/_next") || // exclude Next.js internals
  //   pathname.startsWith("/api") || //  exclude all API routes
  //   pathname.startsWith("/static") // exclude static files
  // )
  //   return NextResponse.next();
  // if (cookie) {
  //   return NextResponse.next();
  // }
  // // Not authenticated - no cookie
  // if (!cookie) {
  //   const loginUrl = new URL("/auth/login", request.url);
  //   if (!pathname.startsWith("/auth")) {
  //     return NextResponse.redirect(loginUrl);
  //   } else {
  //     return NextResponse.next();
  //   }
  // }
  // return NextResponse.next();

  // Old
  // if (request.url.includes("/moviesPage") && !cookie) {
  //   const url = request.nextUrl.clone();
  //   url.pathname = "/auth/login";
  //   return NextResponse.rewrite(url);
  // }
  // if (!cookie && !request.url.includes("/auth/register")) {
  //   console.log("No Cookie so redirecting to /auth/register");
  //   // 2. Redirect to Login
  //   const url = request.nextUrl.clone();
  //   url.pathname = "/auth/login";
  //   return NextResponse.rewrite(url);
  // }
  // Login and register will not be available to authenticated users. They will have to log out first.
  // if (request.url.includes("/auth/login") && cookie) {
  //   console.log("Redirecting to MoviePage - already logged in!");
  //   const url = request.nextUrl.clone();
  //   url.pathname = "/moviesPage";
  //   return NextResponse.redirect(url);
  // }
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
    "/((?!_next/static|favicon.ico|login|).*)",
    "/moviesPage",
    "/auth/login",
    "/auth/register",
    "/user/myReviews",
    "/user/myMovies",
  ],
};
