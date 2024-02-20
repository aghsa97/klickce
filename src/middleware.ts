import { redirectToSignIn } from "@clerk/nextjs";
import { authMiddleware } from "@clerk/nextjs/server";

import { NextRequest, NextResponse } from "next/server";

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
    if (!auth.userId && !auth.isPublicRoute) {
      return redirectToSignIn({ returnBackUrl: req.url });
    }

    return NextResponse.next();
  },
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
