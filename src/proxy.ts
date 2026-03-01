import { createProxyMiddleware } from "better-auth/next-js";
import { isProtectedRoute } from "@/lib/session";

export default createProxyMiddleware({
  redirectTo: "/",
  condition: (request) => isProtectedRoute(new URL(request.url).pathname),
});

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*"],
};
