import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside

export async function middleware(request) {
  const token = await request.cookies.get("token")?.value;

  // console.log("Token is 0:", token === 0);
  // console.log("Token is false:", token === false);
  // console.log("Token is undefined:", token === undefined);
  // console.log("Token is length:", token.length);
  // console.log("Token is length 0:", token.length === 0);

  // const { pathname } = request.nextUrl;

  // if (request.url.includes("/moviesPage")) {
  //   if (token.length === 0) {
  //     const url = request.nextUrl.clone();
  //     url.pathname = "/auth/login";
  //     return NextResponse.rewrite(url);
  //   }

  //   try {
  //     return NextResponse.next();
  //   } catch (error) {
  //     return NextResponse.redirect("/auth/login");
  //   }
  // }

  // return NextResponse.next();

  // My attempt 1
  if (request.url.includes("/auth/login")) {
    return NextResponse.next();
  }

  if (request.url.includes("/moviesPage" && token !== 0)) {
    return NextResponse.next();
  }

  if (request.url.includes("/moviesPage") && token.length === 0) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.rewrite(url);
  }

  // Infinite loop - dont use
  // if (!token) {
  //   const url = request.nextUrl.clone();
  //   url.pathname = "/auth/login";
  //   return NextResponse.rewrite(url);
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
