import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { logger } from '@/lib/logger';
import { getPlatformUserByEmail } from '@/core/platform';

function addSecurityHeaders(response: NextResponse): void {
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), interest-cohort=()');
  response.headers.set('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data:; connect-src 'self' https:;");
}

const publicRoutes = [
  '/auth/login',
  '/auth/recuperar-senha',
  '/auth/atualizar-senha',
  '/auth/callback',
] as const;

export async function proxy(request: NextRequest) {
  const requestId = crypto.randomUUID();
  logger.setRequestId(requestId);
  const { pathname } = request.nextUrl;
  const response = NextResponse.next({ request });
  addSecurityHeaders(response);
  response.headers.set('x-request-id', requestId);

  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }

  if (publicRoutes.some((route) => pathname.startsWith(route))) return response;
  if (pathname.startsWith('/_next') || pathname.startsWith('/favicon') || pathname.startsWith('/api')) return response;

  let supabaseResponse = response;
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          addSecurityHeaders(supabaseResponse);
          supabaseResponse.headers.set('x-request-id', requestId);
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options));
        },
      },
    },
  );

  const { data: { user } } = await supabase.auth.getUser();

  const isPlatformRoute = pathname.startsWith('/platform');
  const isAppRoute = pathname.startsWith('/app');

  if (!user) {
    if (isAppRoute || isPlatformRoute) {
      const url = request.nextUrl.clone();
      url.pathname = '/auth/login';
      return NextResponse.redirect(url);
    }
    return supabaseResponse;
  }

  let userType = user.user_metadata?.type as string | undefined;

  if (!userType) {
    const email = user.email;
    userType = (email && getPlatformUserByEmail(email)) ? 'platform' : 'company';
  }

  if (user && pathname.startsWith('/auth/login')) {
    const url = request.nextUrl.clone();
    url.pathname = userType === 'platform' ? '/platform' : '/app';
    return NextResponse.redirect(url);
  }

  if (userType === 'platform' && isAppRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/platform';
    return NextResponse.redirect(url);
  }

  if (userType === 'company' && isPlatformRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/app';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/health|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
