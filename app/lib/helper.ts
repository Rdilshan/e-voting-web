"use server";

// Retry function with exponential backoff
export async function retryWithBackoff<T>(
	fn: () => Promise<T>,
	maxRetries: number = 3,
	baseDelay: number = 1000
): Promise<T> {
	for (let i = 0; i < maxRetries; i++) {
		try {
			return await fn();
		} catch (error: unknown) {
			// Type guard to check if error is an Error instance
			const errorMessage =
				error instanceof Error ? error.message : String(error);
			const errorCode =
				error && typeof error === "object" && "code" in error
					? error.code
					: undefined;

			// Check if it's a rate limit error
			if (
				errorMessage.includes("Too Many Requests") ||
				errorCode === "BAD_DATA"
			) {
				if (i === maxRetries - 1) throw error;

				const delay = baseDelay * Math.pow(2, i);
				console.log(
					`Rate limited, retrying in ${delay}ms... (attempt ${
						i + 1
					}/${maxRetries})`
				);
				await new Promise((resolve) => setTimeout(resolve, delay));
				continue;
			}
			throw error;
		}
	}
	throw new Error("Max retries exceeded");
}
