import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware()


// export default clerkMiddleware({
//     publicRoutes: ["/","/clerk/sign-in", "/clerk/create-org", "/clerk/sign-up", "/api/stripe-webhook", "/api/clerk-webhook"],
//     debug: false
// });
 
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
  
};

// "/api/create-company(.*)"