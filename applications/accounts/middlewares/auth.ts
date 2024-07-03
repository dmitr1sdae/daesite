import {NextRequest, NextResponse} from "next/server";
import {defineMiddleware} from "@redae/nextjs-combine-middleware";

export const auth = defineMiddleware({
  matcher: ["/@me", "/", "/signin", "/signup"],
  handler: (req: NextRequest) => {
    const token = req.cookies.get("token")?.value;

    const {pathname} = req.nextUrl;

    if ((pathname === "/@me" || pathname === "/") && !token) {
      return NextResponse.redirect(new URL("/signin", req.url));
    }

    if (
      (pathname === "/signin" || pathname === "/signup" || pathname === "/") &&
      token
    ) {
      return NextResponse.redirect(new URL("/@me", req.url));
    }

    return NextResponse.next();
  },
});
