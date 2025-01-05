import { NextRequest, NextResponse } from 'next/server';

const publicRoutes = ['/', '/auth'];
const privateRoutes = ['/chat'];

export default (request: NextRequest) => {
  const pathname = request.nextUrl.pathname;
  const session = request.cookies.get('connect.sid');

  console.log(session, pathname, request.cookies, publicRoutes, privateRoutes);
  console.log(privateRoutes.includes(pathname));
  console.log(publicRoutes.includes(pathname));

  if (!session) {
    if (privateRoutes.includes(pathname)) {
      console.log('here1');
      return NextResponse.redirect(new URL('/auth', request.nextUrl));
    }
  } else {
    if (publicRoutes.includes(pathname)) {
      console.log('here2');
      return NextResponse.redirect(new URL('/chat', request.nextUrl));
    }
  }

  return NextResponse.next();
};
