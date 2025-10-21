import { clerkMiddleware } from '@clerk/nextjs/server';
export default clerkMiddleware({
  publicRoutes: ['/', '/api/generate'], // 首页和API接口对未登录用户开放
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};