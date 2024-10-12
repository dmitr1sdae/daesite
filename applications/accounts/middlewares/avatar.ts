import {PublicUser} from "@daesite/shared";
import {defineMiddleware} from "@redae/nextjs-combine-middleware";
import axios from "axios";
import {NextRequest, NextResponse} from "next/server";

export const avatar = defineMiddleware({
  matcher: ["/**.png"],
  handler: async (req: NextRequest) => {
    const username = req.nextUrl.pathname.split("/").pop()?.split(".")[0] || "";

    if (!username) {
      return NextResponse.next();
    }

    const apiBaseUrl = process.env.API_BASE_URL;
    if (!apiBaseUrl) {
      console.error("API_BASE_URL environment variable is not defined.");
      return NextResponse.next();
    }

    try {
      const res = await axios.get<PublicUser>(
        `${apiBaseUrl}/users/${username}`,
      );

      if (res.status === 200 && res.data.avatar) {
        return NextResponse.redirect(res.data.avatar, 302);
      }
    } catch (err) {
      console.error(`Failed to fetch user data for ${username}:`, err);
    }

    return NextResponse.next();
  },
});
