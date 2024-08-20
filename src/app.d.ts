// See https://kit.svelte.dev/docs/types#app

import type { SupabaseClient, Session } from "@supabase/supabase-js";

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		interface PageData {
			supabase: SupabaseClient
			session: Session | null
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
