"use server";

import {signOut} from "@/auth";

export async function logoutAction() {
	try {
		await signOut({
			redirect: false,
		});
		return {success: true};
	} catch (error) {
		console.error("Error during logout:", error);
		throw new Error("Failed to logout");
	}
}
