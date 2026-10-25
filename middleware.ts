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

    // Authenticated users with incomplete onboarding must complete onboarding first
    if (!user.onboardingCompletedAt) {
      const onboardingPath =
        user.role === 'read_only_stakeholder' ? '/stakeholder/onboarding' : '/onboarding';
      return NextResponse.redirect(new URL(onboardingPath, request.url));
    }

    // Legacy route redirect: /dashboard/stakeholder -> /dashboard
    if (user.role === 'read_only_stakeholder' && pathname.startsWith('/dashboard/stakeholder')) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Role isolation: Stakeholder cannot access engineering internal workflows
    if (
      user.role === 'read_only_stakeholder' &&
      (pathname.startsWith('/dashboard/reviews') ||
        pathname.startsWith('/dashboard/projects/new') ||
        pathname.startsWith('/dashboard/submissions') ||
        pathname.startsWith('/dashboard/personnel') ||
        pathname.startsWith('/dashboard/reporting-policies'))
    ) {
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

