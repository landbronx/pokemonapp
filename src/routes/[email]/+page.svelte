<!-- localhost:5173/alexander@climateworks.se -->
<script lang="ts">
	import { page } from '$app/stores';
	import { getPokemonList } from '$lib/pokemonAPI';
	import { getPokemon } from '$lib/pokemonAPI';
	export let data;

	let { supabase, session } = data;
	$: ({ supabase, session } = data);

	$: ({ email } = $page.params);

	let pokemonList: any = [];
	let pokemonData: any = [];
	let profile: any = {
		description:
			'This is your description, feel free to write about yourself or your favorite Pokemon.',
		pokemon_ids: [1, 2, 3]
	};
	let isModalOpen = false;
    let searchInput = "";

	//profiles in supabase which has cols for desciråp ,. id ,. email
	//from this page we can use supabase obj

	async function refreshPokemonData() {
		pokemonData = [];

		// Fetch data for each Pokemon and update the array
		const promises = profile.pokemon_ids.map(async (id: number) => {
			const data = await getPokemon(id.toString());
			return data;
		});

		// Wait for all promises to resolve
		pokemonData = await Promise.all(promises);
	}

	async function saveProfile() {
		const { data: profileData, error: profileError } = await supabase
			.from('profiles')
			.select('*')
			.eq('email', email);

		if (profileData?.length === 0) {
			//create new row
			const { data, error } = await supabase
				.from('profiles')
				.insert({ ...profile, user_id: session?.user?.id, email: session?.user?.email });
		} else {
			//update
			const { data, error } = await supabase
				.from('profiles')
				.update(profile)
				.eq('user_id', session?.user?.id);
		}
	}

	// Load initial data when the page changes
	page.subscribe(async () => {
		pokemonList = await getPokemonList();

		const { data: profileData, error: profileError } = await supabase
			.from('profiles')
			.select('description, pokemon_ids')
			.eq('email', email);

		console.log(email);
		console.log(session?.user?.email);
		console.log(profileData);

		if (profileData?.length == 0 && email == session?.user?.email) {
			console.log('SAVE PROFILE');
			await saveProfile();
		} else if (profileData != null && profileData.length > 0) {
			profile = profileData[0];
		} else {
			console.log('NO PROFILE');
			profile = {
				description: 'This user does not have a profile yet!',
				pokemon_ids: []
			};
		}

		await refreshPokemonData();
	});

	async function savePageEdits() {
		await saveProfile();
		await refreshPokemonData();
		isModalOpen = false;
	}

	async function togglePokemon(id: number) {
		let pokemonIDs = profile.pokemon_ids;

		if (pokemonIDs.length >= 3 && !pokemonIDs.includes(id)) {
			alert('you can only have 3 pokemons!');
			return;
		}
		if (pokemonIDs.includes(id)) {
			let index = pokemonIDs.indexOf(id);
			pokemonIDs.splice(index, 1);
		} else {
			pokemonIDs.push(id);
		}
		profile.pokemon_ids = [...pokemonIDs];
	}
</script>

<div class="hero min-h-screen bg-base-300">
	<div class="hero-content">
		<div class="max-w-5l text-center">
			<h1 class="text-4xl font-bold text-white">{email}'s Page</h1>
			<p class="mx-auto max-w-md py-3">{profile.description}</p>
			<div class="grid grid-cols-3 gap-4">
				{#if pokemonData === undefined}
					<p>Loading...</p>
				{:else}
					{#each pokemonData as pokemon}
						<div class="card m-4 bg-slate-700 shadow-lg shadow-blue-900">
							<div class="card-body">
								<div class="text-center">
									<img
										src={pokemon.sprites.front_default}
										alt={pokemon.name}
										class="mx-auto h-32 w-32 object-contain"
									/>
									<h2 class="mt-4 text-center text-2xl font-bold text-white">{pokemon.name}</h2>
									<p class="text-info">{pokemon.types[0].type.name}</p>
								</div>
							</div>
						</div>
					{/each}
				{/if}
			</div>
			{#if email == session?.user?.email}
				<button class="btn btn-info" on:click={() => (isModalOpen = true)}>Edit Page</button>
				<dialog class="min-w-lg modal" class:modal-open={isModalOpen}>
					<div class="modal-box">
						<h3>Edit Your PokePage</h3>
						<p>Here you can make edits to your page, such as description or Pokemon selected.</p>
						<p class="p-2 text-white">Edit your description</p>
						<textarea
							bind:value={profile.description}
							class="textarea textarea-bordered textarea-lg h-[300px] w-full max-w-md"
						>
						</textarea>

						<p class="p-2 text-white">Select your Pokemon</p>

						<div class="m-3 grid max-h-[600px] grid-cols-3 overflow-y-scroll">
                        <div class="col-span-3">
                            <input 
                            type="text"
                            class="input input-bordered w-full"
                            placeholder="Search for Pokemon!"
                            bind:value={searchInput}
                            />
                        </div>
							{#each pokemonList as pokemon, index}
                            <!-- char -> charmander -->
                            {#if pokemon.name.includes(searchInput)}
								<button
									class={'card m-1 h-12 items-center justify-center bg-slate-700 p-1 ' +
										(profile.pokemon_ids.includes(index + 1) ? 'border-2 border-blue-600' : '')}
									on:click={() => togglePokemon(index + 1)}
								>
									<div class="text-center">
										<h2 class="text-x1 text-white">{pokemon.name}</h2>
									</div>
								</button>
                                {/if}
							{/each}
						</div>
						<button class="btn btn-success" on:click={() => savePageEdits()}>Save Edits</button>
					</div>
				</dialog>
			{/if}
		</div>
	</div>
</div>
