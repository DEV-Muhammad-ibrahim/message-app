import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
export async function middleware(request: NextRequest) {
  const secret = process.env.NEXTAUTH_SECRET || 'default_secret'  // Ensure 'secret' is always a string
  const salt = process.env.NEXTAUTH_SALT || 'default_salt'        // Ensure 'salt' is always a string

  const token = await getToken({ req: request, secret, salt })    // Include 'secret' and 'salt' parameters
  const url = request.nextUrl

  if (token && (
      url.pathname.startsWith('/sign-in') ||
      url.pathname.startsWith('/sign-up') ||
      url.pathname.startsWith('/verify') ||
      url.pathname === '/'
  )) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  if (!token && url.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }


}

export const config = {
  matcher:[
    '/sign-in',
    '/sign-up',
    '/verify',
  ],
}
