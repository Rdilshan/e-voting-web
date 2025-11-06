import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type {NextAuthConfig} from "next-auth";

export const config = {
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: {label: "Email", type: "email"},
				password: {label: "Password", type: "password"},
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) {
					return null;
				}

				// Get admin credentials from environment variables
				const adminEmail = process.env.ADMIN_EMAIL;
				const adminPassword = process.env.ADMIN_PASSWORD;

				if (!adminEmail || !adminPassword) {
					console.error(
						"Admin credentials not configured in environment variables"
					);
					return null;
				}

				// Validate credentials
				if (
					credentials.email === adminEmail &&
					credentials.password === adminPassword
				) {
					return {
						id: "admin",
						email: credentials.email,
						name: "Admin",
						role: "admin",
					};
				}

				return null;
			},
		}),
	],
	pages: {
		signIn: "/admin/login",
	},
	callbacks: {
		async jwt({token, user}) {
			if (user) {
				token.role = user.role;
				token.id = user.id;
			}
			return token;
		},
		async session({session, token}) {
			if (token && session.user) {
				session.user.id = token.id as string;
				session.user.role = token.role as string;
			}
			return session;
		},
	},
	session: {
		strategy: "jwt",
	},
	secret: process.env.NEXTAUTH_SECRET || "your-secret-key-change-in-production",
} satisfies NextAuthConfig;

export const {handlers, auth, signIn, signOut} = NextAuth(config);
