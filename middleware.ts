import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// This part is correct: define which routes are public
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

export default clerkMiddleware((auth, req) => {
  // This part is also correct: protect routes that are not public
  if (!isPublicRoute(req)) {
    auth.protect();
  }
});

export const config = {
  // --- THIS IS THE DEFINITIVE FIX ---
  // This is a more robust matcher. It tells the middleware to run on EVERYTHING...
  matcher: [
    "/((?!.+\\.[\\w]+$|_next).*)", // ...except for static files (like images, css) and internal Next.js files.
    "/",
    "/(api|trpc)(.*)", // This explicitly includes API routes, which is crucial.
  ],
};