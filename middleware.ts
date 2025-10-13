import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Paths that require authentication
const protectedPaths = ['/dashboard', '/dashboard'];

// Paths that should redirect to dashboard if already authenticated
const authPaths = ['/auth/sms'];

export function middleware(request: NextRequest) {
  // Temporarily disabled middleware - just pass through all requests
  return NextResponse.next();
  
  /*
  const token = request.cookies.get('authToken')?.value || 
                request.headers.get('authorization')?.replace('Bearer ', '');
  
  const { pathname } = request.nextUrl;

  // Check if user is trying to access protected routes without token
  if (protectedPaths.some(path => pathname.startsWith(path))) {
    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = '/auth/sms';
      return NextResponse.redirect(url);
    }
  }

  // If user has token and tries to access auth pages, redirect to dashboard
  if (authPaths.some(path => pathname.startsWith(path))) {
    if (token) {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
  }

  // Redirect root to dashboard if authenticated, otherwise to auth
  if (pathname === '/') {
    const url = request.nextUrl.clone();
    url.pathname = token ? '/dashboard' : '/auth/sms';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
  */
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)',
  ],
};