import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside

export async function middleware(request) {
  const cookie = request.cookies.get("token")?.value;
  // console.log("Token Cookie:", cookie);

  // if (request.url.includes("/moviesPage") && !cookie) {
  //   const url = request.nextUrl.clone();
  //   url.pathname = "/auth/login";
  //   return NextResponse.rewrite(url);
  // }

  if (!cookie) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.rewrite(url);
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/", "/moviesPage"],
};
