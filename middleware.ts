import {auth} from "@/auth";
import {NextResponse} from "next/server";

export default auth((req) => {
	const {pathname} = req.nextUrl;
	const isLoggedIn = !!req.auth;

	// Allow access to login page - redirect to dashboard if already logged in
	if (pathname === "/admin/login") {
		if (isLoggedIn) {
			return NextResponse.redirect(new URL("/admin/dashboard", req.url));
		}
		return NextResponse.next();
	}

	// Protect all other admin routes
	if (pathname.startsWith("/admin") && !isLoggedIn) {
		const loginUrl = new URL("/admin/login", req.url);
		// Only set callbackUrl if it's not already the login page
		if (pathname !== "/admin/login") {
			loginUrl.searchParams.set("callbackUrl", pathname);
		}
		return NextResponse.redirect(loginUrl);
	}

	return NextResponse.next();
});

export const config = {
	matcher: ["/admin/:path*"],
};
