import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define public (non-auth) routes
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

export default clerkMiddleware((auth, req) => {
  // If the route is not public, require authentication
  if (!isPublicRoute(req)) {
    auth.protect(); // ✅ correct syntax for Clerk v5+
  }
});

export const config = {
  matcher: [
    // Protect everything except _next/static files and assets
    "/((?!_next|.*\\..*).*)",
    "/", 
    "/dashboard(.*)", // ✅ ensures /dashboard/goals and other dashboard pages are protected
  ],
};
