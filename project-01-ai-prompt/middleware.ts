// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher([
  '/user-profile(.*)',
  // 添加其他你需要保护的路由...
]);

export default clerkMiddleware((auth, request) => {
  // 尝试直接调用 auth.protect
  if (isProtectedRoute(request)) {
    auth.protect(); // 移除了括号 `()`
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};