import { NextResponse } from "next/server";
import { authMiddleware } from "@clerk/nextjs/server";

export default authMiddleware({
  publicRoutes: [
    "/sign-in",
    "/sign-up",
    "/",
    "/(map)(.*)",
    "/(api|trpc)(.*)",
    "api/webhooks/clerk",
    "api/webhooks/stripe",
  ],
  afterAuth(auth, req) {
    const isPublicRoute = auth.isPublicRoute;
    const userId = auth.userId;

    if (isPublicRoute) {
      return NextResponse.next();
    }

    const url = new URL(req.nextUrl.origin);
    if (!userId) {
      // User is not signed in
      url.pathname = "/sign-in";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  },
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
