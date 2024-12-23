import { NextRequest, NextResponse } from 'next/server';

const publicRoutes = ['/', '/auth'];
const privateRoutes = ['/chat'];

export default (request: NextRequest) => {
  const pathname = request.nextUrl.pathname;
  const session = request.cookies.get('connect.sid');

  if (!session) {
    if (privateRoutes.includes(pathname))
      return NextResponse.redirect(new URL('/auth', request.nextUrl));
  } else {
    if (publicRoutes.includes(pathname))
      return NextResponse.redirect(new URL('/chat', request.nextUrl));
  }

  return NextResponse.next();
};
