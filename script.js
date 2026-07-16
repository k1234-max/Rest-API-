// URL der PokéAPI
const apiUrl = "https://pokeapi.co/api/v2/pokemon/";

// Funktion zum Suchen eines Pokémon
async function searchPokemon() {

    // Eingabe aus dem Suchfeld lesen
    const pokemonName = document.getElementById("pokemonName").value.toLowerCase();

    // Prüfen, ob etwas eingegeben wurde
    if (pokemonName === "") {
        alert("Bitte gib einen Pokémon-Namen ein.");
        return;
    }

    try {

        // Daten von der API holen
        const response = await fetch(apiUrl + pokemonName);

        // Prüfen, ob das Pokémon existiert
        if (!response.ok) {
            throw new Error("Pokémon nicht gefunden");
        }

        // JSON-Daten umwandeln
        const data = await response.json();

        // Name
        const name = data.name;

        // Pokédex-Nummer
        const id = data.id;

        // Größe
        const height = data.height;

        // Gewicht
        const weight = data.weight;

        // Bild
        const image = data.sprites.front_default;

        // Typen
        const types = data.types
            .map(type => type.type.name)
            .join(", ");

        // Fähigkeiten
        const abilities = data.abilities
            .map(ability => ability.ability.name)
            .join(", ");

        // Ausgabe auf der Webseite
        document.getElementById("pokemonInfo").innerHTML = `
            <h2>${name.toUpperCase()}</h2>

            <img src="${image}" alt="${name}">

            <p><strong>Pokédex Nummer:</strong> ${id}</p>

            <p><strong>Größe:</strong> ${height}</p>

            <p><strong>Gewicht:</strong> ${weight}</p>

            <p><strong>Typ:</strong> ${types}</p>

            <p><strong>Fähigkeiten:</strong> ${abilities}</p>
        `;

    } catch (error) {

        // Fehlermeldung
        document.getElementById("pokemonInfo").innerHTML = `
            <h2>❌ Pokémon wurde nicht gefunden.</h2>
        `;
    }
}

