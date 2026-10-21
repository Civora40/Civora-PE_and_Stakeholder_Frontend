import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function getSessionUser(request: NextRequest) {
  const sessionCookie = request.cookies.get('civora_session');
  if (!sessionCookie?.value) return null;

  try {
    const decoded = Buffer.from(sessionCookie.value, 'base64').toString('utf-8');
    const session = JSON.parse(decoded);
    if (!session || !session.user || (session.expiresAt && Date.now() > session.expiresAt)) {
      return null;
    }
    return session.user;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const user = getSessionUser(request);
  const isAuthenticated = !!user;

  // Protect all /dashboard routes
  if (pathname.startsWith('/dashboard')) {
    if (!isAuthenticated) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Authenticated users with incomplete onboarding must complete /onboarding first
    if (!user.onboardingCompletedAt) {
      return NextResponse.redirect(new URL('/onboarding', request.url));
    }
  }

  // Guard /onboarding route
  if (pathname === '/onboarding') {
    if (!isAuthenticated) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', '/onboarding');
      return NextResponse.redirect(loginUrl);
    }

    // If onboarding is already completed, route directly to the authorized dashboard
    if (user.onboardingCompletedAt) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/onboarding'],
};

