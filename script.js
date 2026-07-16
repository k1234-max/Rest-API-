// URL der PokéAPI
const apiUrl = "https://pokeapi.co/api/v2/pokemon/";

// Pokémon suchen
async function searchPokemon() {

    // Eingabe lesen
    const pokemonName = document
        .getElementById("pokemonName")
        .value
        .trim()
        .toLowerCase();

    // Prüfen, ob etwas eingegeben wurde
    if (pokemonName === "") {

        alert("Bitte gib einen Pokémon-Namen ein.");

        return;
    }

    try {

        // Daten laden
        const response = await fetch(apiUrl + pokemonName);

        // Existiert das Pokémon?
        if (!response.ok) {

            throw new Error("Pokémon nicht gefunden");

        }

        // JSON umwandeln
        const data = await response.json();

        // Typen sammeln
        const typen = data.types
            .map(type => type.type.name)
            .join(", ");

        // Fähigkeiten sammeln
        const faehigkeiten = data.abilities
            .map(ability => ability.ability.name)
            .join(", ");

        // Karte erstellen
        document.getElementById("pokemonInfo").innerHTML = `

            <div class="card">

                <img src="${data.sprites.other["official-artwork"].front_default}"
                     alt="${data.name}">

                <h2>${data.name.toUpperCase()}</h2>

                <div class="info">

                    <p><strong>Pokédex Nummer:</strong> ${data.id}</p>

                    <p><strong>Größe:</strong> ${data.height}</p>

                    <p><strong>Gewicht:</strong> ${data.weight}</p>

                    <p><strong>Typ:</strong> ${typen}</p>

                    <p><strong>Fähigkeiten:</strong> ${faehigkeiten}</p>

                    <p><strong>Basis-Erfahrung:</strong> ${data.base_experience}</p>

                </div>

            </div>

        `;

    }

    catch (error) {

        document.getElementById("pokemonInfo").innerHTML = `

            <div class="card">

                <h2>❌ Pokémon nicht gefunden</h2>

                <p>

                    Bitte überprüfe die Schreibweise
                    und versuche es erneut.

                </p>

            </div>

        `;

    }

}

// Enter-Taste unterstützt die Suche
document
    .getElementById("pokemonName")
    .addEventListener("keypress", function(event){

        if(event.key === "Enter"){

            searchPokemon();

        }

    });