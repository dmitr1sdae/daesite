import {NextRequest, NextResponse} from "next/server";

export const middleware = (request: NextRequest) => {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/@me", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/signin", "/signup"],
};
