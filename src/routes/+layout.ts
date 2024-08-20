import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from "$env/static/public";
import type { LayoutLoad } from "./$types";
import { createBrowserClient, isBrowser, parse } from "@supabase/ssr";

export const ssr = false;

export const load: LayoutLoad = async ({ fetch, data, depends }) => {
    depends('supabase:auth');

    const supabase = createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
        global: {
            fetch
        },
        cookies: {
            get(key) {
                if (!isBrowser()) {
                    // Server-side: return the session data
                    return JSON.stringify(data.session);
                }
                // Client-side: retrieve cookie by key
                const cookies = parse(document.cookie);
                return cookies[key];
            },
            set(key, value, options) {
                if (isBrowser()) {
                    // Client-side: set a cookie
                    document.cookie = `${key}=${value}; path=/; SameSite=Lax; ${options?.expires ? `expires=${options.expires.toUTCString()};` : ''}`;
                }
            },
            remove(key) {
                if (isBrowser()) {
                    // Client-side: remove a cookie
                    document.cookie = `${key}=; Max-Age=0; path=/;`;
                }
            }
        }
    });

    try {
        const { data: { session } } = await supabase.auth.getSession();
        return { supabase, session };
    } catch (error) {
        console.error("Error fetching session:", error);
        return { supabase, session: null };
    }
};
