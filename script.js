alert("JavaScript ist verbunden!");

const apiUrl = "https://pokeapi.co/api/v2/pokemon/";
let allPokemon = [];
let isLoading = false; 


async function loadPokemon(){
    if (isLoading) return;
    isLoading = true;

    // Lade-Anzeige für den Nutzer aktivieren
    const container = document.getElementById("pokemonList");
    if (container) {
        container.innerHTML = "<p style='grid-column: 1/-1; text-align: center; font-size: 18px;'>⏳ Pokémon werden geladen...</p>";
    }

    try {
        const response = await fetch(apiUrl + "?limit=50");
        const data = await response.json();

        // Alle Detail-Anfragen gleichzeitig im Hintergrund starten
        const detailPromises = data.results.map(async (pokemon) => {
            const details = await fetch(pokemon.url);
            return details.json();
        });

        // Warten, bis alle 50 Pokémon fertig geladen sind (dauert unter einer Sekunde!)
        allPokemon = await Promise.all(detailPromises);

        console.log("Erfolgreich geladen:", allPokemon);
        displayPokemon(allPokemon);

    } catch (error) {
        console.error("Fehler beim Laden der Pokémon:", error);
        if (container) {
            container.innerHTML = "<p style='grid-column: 1/-1; text-align: center; color: #d62828;'>Fehler beim Laden der Pokémon. Bitte lade die Seite neu.</p>";
        }
    } finally {
        isLoading = false;
    }
}


function displayPokemon(pokemonArray){
    const container = document.getElementById("pokemonList");
    container.innerHTML = "";

    if (pokemonArray.length === 0) {
        container.innerHTML = "<p style='grid-column: 1/-1; text-align: center;'>Keine Pokémon gefunden...</p>";
        return;
    }

    pokemonArray.forEach(pokemon => {
        let types = pokemon.types
            .map(type => type.type.name)
            .join(", ");

        container.innerHTML += `
        <div class="pokemon-card">
            <img src="${pokemon.sprites.other["official-artwork"].front_default}" alt="${pokemon.name}">
            <h2>${pokemon.name}</h2>
            <p>Typ: ${types}</p>
            <button onclick="showEvolution('${pokemon.name}')">🌱 Evolution anzeigen</button>
            <div class="evolution" id="evo-${pokemon.name}"></div>
        </div>
        `;
    });
}

// ==========================
// Filter nach Typ (Dropdown)
// ==========================
document.getElementById("typeFilter").addEventListener("change", function(){
    let selectedType = this.value;

    if(selectedType === "all"){
        displayPokemon(allPokemon);
        return;
    }

    let filtered = allPokemon.filter(pokemon => {
        return pokemon.types.some(type => 
            type.type.name === selectedType
        );
    });

    displayPokemon(filtered);
});

// ==========================
// Reset / Alle Pokémon anzeigen
// ==========================
function resetFilter(){
    // Dropdown wieder auf "Alle Typen" zurücksetzen
    document.getElementById("typeFilter").value = "all";
    
    // Falls die Liste leer sein sollte, laden wir sie neu, ansonsten zeigen wir alle an
    if (allPokemon.length === 0) {
        loadPokemon();
    } else {
        displayPokemon(allPokemon);
    }
}

// ==========================
// Evolutionskette anzeigen
// ==========================
async function showEvolution(name){
    const evoContainer = document.getElementById("evo-" + name);
    if (evoContainer) {
        evoContainer.innerHTML = "⏳ Lade...";
    }

    try {
        const species = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${name}`).then(res => res.json());
        const evolution = await fetch(species.evolution_chain.url).then(res => res.json());

        let chain = evolution.chain;
        let text = chain.species.name;

        if(chain.evolves_to.length > 0){
            text += " → " + chain.evolves_to[0].species.name;
        }

        if(chain.evolves_to.length > 0 && chain.evolves_to[0].evolves_to.length > 0){
            text += " → " + chain.evolves_to[0].evolves_to[0].species.name;
        }

        if (evoContainer) {
            evoContainer.innerHTML = text;
        }
    } catch (e) {
        console.error("Fehler beim Laden der Evolution für " + name, e);
        if (evoContainer) {
            evoContainer.innerHTML = "Keine Evolutionsdaten";
        }
    }
}

// ==========================
// Ein einzelnes Pokémon suchen
// ==========================
async function searchPokemon(){
    let name = document.getElementById("pokemonName").value.toLowerCase().trim();
    if (!name) return;

    try {
        const response = await fetch(apiUrl + name);

        if(!response.ok){
            alert("Pokémon nicht gefunden");
            return;
        }

        const pokemon = await response.json();

        document.getElementById("pokemonInfo").innerHTML = `
        <div class="card">
            <img src="${pokemon.sprites.other["official-artwork"].front_default}" alt="${pokemon.name}">
            <h2>${pokemon.name}</h2>
            <p>Typ: ${pokemon.types.map(t=>t.type.name).join(", ")}</p>
        </div>
        `;
    } catch (error) {
        console.error("Fehler bei der Suche:", error);
    }
}

// ==========================
// Script-Start (Nur ein Aufruf)
// ==========================
loadPokemon();
console.log("Script gestartet");