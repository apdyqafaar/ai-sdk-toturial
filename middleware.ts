import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
	const sessionCookie = getSessionCookie(request);
	const {nextUrl}=request

	if (!sessionCookie) {
		return NextResponse.redirect(new URL("/signin", request.url));
	}

	const isSignin=nextUrl.pathname===("/signin")
	const isSignUp=nextUrl.pathname===("/signup")
	if(isSignUp || isSignin && sessionCookie){
		return NextResponse.redirect(new URL("/", request.url));

	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/dash"], 
};


