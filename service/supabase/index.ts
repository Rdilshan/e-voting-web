import "server-only";

import {SupabaseClient, createClient} from "@supabase/supabase-js";

export const getServiceRoleClient = (): SupabaseClient => {
	const url = process.env.SUPABASE_URL;
	const supabaseKey = process.env.SUPABASE_KEY;

	if (!url || !supabaseKey) {
		throw new Error("Missing Supabase environment variables");
	}
	return createClient(url, supabaseKey);
};
