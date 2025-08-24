import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

// Routes that don't require authentication
const publicRoutes = ['/login', '/register', '/api/auth/login', '/api/auth/register', '/api/auth/verify'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // TEMPORARILY DISABLE AUTH FOR DEBUGGING
  console.log('Middleware called for:', pathname);
  return NextResponse.next();
  
  // Check if the route is public
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Check for authentication on protected routes
  if (pathname.startsWith('/api/')) {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    try {
      jwt.verify(token, JWT_SECRET);
      return NextResponse.next();
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
  }

  // For non-API routes, redirect to login if no token in localStorage
  // This will be handled by the client-side ProtectedRoute component
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
