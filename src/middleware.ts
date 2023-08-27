import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export default authMiddleware({
  publicRoutes: ["/sign-in", "/sign-up", "/"],
  afterAuth(auth, req) {
    const isPublicRoute = auth.isPublicRoute;
    const userId = auth.userId;

    if (isPublicRoute) {
      return NextResponse.next();
    }

    const url = new URL(req.nextUrl.origin);
    const parts = req.nextUrl.pathname.split("/").filter(Boolean);

    if (!userId) {
      // User is not signed in
      url.pathname = "/sign-in";
      return NextResponse.redirect(url);
    }

    if (req.nextUrl.pathname === "/dashboard") {
      // /dashboard should redirect to the user's dashboard
      // use their current workspace, i.e. /:userId
      url.pathname = `/${userId}`;
      return NextResponse.redirect(url);
    }

    const workspaceId = parts[0];

    const isUser = workspaceId?.startsWith("user_");
    if (isUser && userId !== workspaceId) {
      // User is accessing a user that's not them
      url.pathname = `/`;
      console.log("User is accessing a user that's not them");

      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  },
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
