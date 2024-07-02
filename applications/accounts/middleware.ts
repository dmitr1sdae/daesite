import {NextRequest, NextResponse} from "next/server";

export const middleware = (request: NextRequest) => {
  const token = request.cookies.get("token")?.value;
  const {pathname} = request.nextUrl;

  // Redirect to signin if trying to access /@me without a token
  if (pathname === "/@me" && !token) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  // Redirect to /@me if trying to access signin/signup with a token
  if ((pathname === "/signin" || pathname === "/signup") && token) {
    return NextResponse.redirect(new URL("/@me", request.url));
  }

  // Allow the request to proceed
  return NextResponse.next();
};

export const config = {
  matcher: ["/signin", "/signup", "/@me"],
};
