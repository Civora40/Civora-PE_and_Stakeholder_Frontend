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

  // Protect all /dashboard and /engineer routes (Project Engineer space)
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/engineer')) {
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

    // Role isolation: Stakeholder redirected to dedicated /stakeholder space
    if (user.role === 'read_only_stakeholder') {
      if (pathname.startsWith('/dashboard/projects')) {
        return NextResponse.redirect(new URL('/stakeholder/projects', request.url));
      }
      if (pathname.startsWith('/dashboard/reports') || pathname.startsWith('/engineer/reports')) {
        return NextResponse.redirect(new URL('/stakeholder/reports', request.url));
      }
      if (pathname.startsWith('/dashboard/notifications')) {
        return NextResponse.redirect(new URL('/stakeholder/notifications', request.url));
      }
      if (pathname.startsWith('/dashboard/profile') || pathname.startsWith('/dashboard/settings')) {
        return NextResponse.redirect(new URL('/stakeholder/profile', request.url));
      }
      if (
        pathname.startsWith('/dashboard/reviews') ||
        pathname.startsWith('/dashboard/projects/new') ||
        pathname.startsWith('/dashboard/submissions') ||
        pathname.startsWith('/dashboard/personnel') ||
        pathname.startsWith('/dashboard/reporting-policies') ||
        pathname.startsWith('/engineer')
      ) {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
      return NextResponse.redirect(new URL('/stakeholder', request.url));
    }
  }


  // Protect all /stakeholder routes (Stakeholder space)
  if (pathname.startsWith('/stakeholder')) {
    if (!isAuthenticated) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Incomplete onboarding gate for stakeholder
    if (!user.onboardingCompletedAt && !pathname.startsWith('/stakeholder/onboarding')) {
      return NextResponse.redirect(new URL('/stakeholder/onboarding', request.url));
    }

    // Role isolation: Engineers redirected to their /dashboard space
    if (user.role === 'project_engineer') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // Guard /onboarding route: must be authenticated
  if (pathname === '/onboarding') {
    if (!isAuthenticated) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', '/onboarding');
      return NextResponse.redirect(loginUrl);
    }
    if (user.role === 'read_only_stakeholder') {
      return NextResponse.redirect(new URL('/stakeholder/onboarding', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/stakeholder/:path*', '/onboarding'],
};

