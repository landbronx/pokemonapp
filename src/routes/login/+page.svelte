<script lang="ts">
    import { Auth } from '@supabase/auth-ui-svelte';
    import { goto } from '$app/navigation';
    export let data;

    let { supabase, session } = data;
    $: ({ supabase, session } = data);

    console.log(supabase);
    console.log(session);

    $: if (session) {
        goto("/")
    }    
</script>

<div class="hero min-h-screen bg-base-300">
    <div class="hero-content w-[800px]">
        <div class="flex flex-col">
            <p>Create an account or login below!</p>
            <!-- Example usage of the Auth component -->
            <Auth 
                supabaseClient={supabase}
                theme="dark"
                appearance={{
                    theme: 'ThemeSupa',
                    style: {
                        input: { width: '400px' }
                    }
                }}
             />
        </div>
    </div>
</div>
