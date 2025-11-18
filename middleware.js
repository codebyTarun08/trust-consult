// import { NextResponse } from "next/server";
// import { jwtVerify } from "jose";

// export async function middleware(request) {
  
//   const token = request.cookies.get("token")?.value;

//   if (!token) {
//     return NextResponse.redirect(new URL("/auth/login", request.url));
//   }

//   try {
//     const secret = new TextEncoder().encode(process.env.JWT_SECRET);
//     const { payload } = await jwtVerify(token, secret);

//     const { role, id } = payload;

//     // Clone headers and attach user info
//     const requestHeaders = new Headers(request.headers);
//     requestHeaders.set("x-user-id", id);
//     requestHeaders.set("x-user-role", role);

//     // 🔒 Check for admin-only routes
//     const pathname = request.nextUrl.pathname;

//     const adminOnlyRoutes = [
//       "/dashboard/category",
//     ];

//     if (adminOnlyRoutes.some((route) => pathname.startsWith(route))) {
//       if (role !== "Admin") {
//         return NextResponse.redirect(new URL("/auth/login", request.url)); // custom Forbidden page
//       }
//     }

//     // Forward request with headers
//     return NextResponse.next({
//       request: {
//         headers: requestHeaders,
//       },
//     });
//   } catch (error) {
//     console.error("Middleware JWT Error:", error);
//     return NextResponse.redirect(new URL("/auth/login", request.url));
//   }
// }

// export const config = {
//   matcher: [
//     "/dashboard/:path*",
//     "/api/users/uploadProfile",
//     "/api/users/updateProfile",
//     "/api/consultant/:path*",
//     "/api/admin/:path*",       // protect admin APIs
//     "/bookings",
//     "/chat/:path*",
//   ],
// };
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request) {
  const response = NextResponse.next();

  // ✅ Add CORS headers to the response
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  // ✅ Handle preflight request (OPTIONS)
  if (request.method === "OPTIONS") {
    return response;
  }

  // ⭐ JWT Auth Logic --------------------------
  const token = request.cookies.get("token")?.value;

  // Match only protected routes
  const pathname = request.nextUrl.pathname;

  const protectedRoutes = [
    "/dashboard",
    "/api/users/uploadProfile",
    "/api/users/updateProfile",
    "/api/consultant",
    "/api/admin",
    "/bookings",
    "/chat",
  ];

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (!isProtected) {
    return response; // No auth required → return response with CORS headers
  }

  // Redirect if no token
  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    const { role, id } = payload;

    // Add user info to headers
    response.headers.set("x-user-id", id);
    response.headers.set("x-user-role", role);

    // ⭐ Admin-only routes
    const adminOnlyRoutes = ["/dashboard/category", "/api/admin"];

    if (
      adminOnlyRoutes.some((route) => pathname.startsWith(route)) &&
      role !== "Admin"
    ) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    return response;
  } catch (err) {
    console.error("Middleware JWT Error:", err);
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/:path*", // Apply CORS+auth to all API routes
    "/bookings",
    "/chat/:path*",
  ],
};
