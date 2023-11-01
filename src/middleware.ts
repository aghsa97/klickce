import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@clerk/nextjs/server";

const before = (req: NextRequest) => {
  const url = req.nextUrl.clone();

  if (url.pathname.includes("api/trpc")) {
    return NextResponse.next();
  }

  return NextResponse.next();
};

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
  beforeAuth: before,
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
