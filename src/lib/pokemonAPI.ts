//helper function it makes it easier for us to use

const POKEMON_API = "https://pokeapi.co/api/v2/";

//getPokemonList - get all 151 pokemons

export async function getPokemonList() {
    const response = await fetch(POKEMON_API + "pokemon?limit=151&offset=0")
    const data = await response.json();
    return data.results; // [ {name: "pikachu" ...}]
}

//getPokemon -> string, get info
export async function getPokemon(name: string) {
    const response = await fetch(POKEMON_API + "pokemon/" + name);
    const data = await response.json();
    return data;
}

//getPokemon -> { }