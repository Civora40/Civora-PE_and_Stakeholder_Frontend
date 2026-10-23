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

    // Role isolation: Project Engineer cannot access Stakeholder section
    if (user.role === 'project_engineer' && pathname.startsWith('/dashboard/stakeholder')) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    // Role isolation: Stakeholder cannot access Project Engineer / Reviews section
    if (user.role === 'read_only_stakeholder' && pathname.startsWith('/dashboard/reviews')) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  // Guard /onboarding route: must be authenticated
  if (pathname === '/onboarding') {
    if (!isAuthenticated) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', '/onboarding');
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/onboarding'],
};

