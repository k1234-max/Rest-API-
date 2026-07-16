// Verbindung zur PokéAPI

const apiUrl = "https://pokeapi.co/api/v2/pokemon/";


// Hier werden alle Pokémon gespeichert

let allPokemon = [];




// ==================================
// ALLE POKÉMON LADEN
// ==================================

async function loadPokemon(){


    allPokemon = [];


    for(let i = 1; i <= 100; i++){


        const response = await fetch(apiUrl + i);


        const pokemon = await response.json();


        allPokemon.push(pokemon);


    }



    console.log("Pokémon geladen:", allPokemon.length);



    displayPokemon(allPokemon);


}








// ==================================
// POKÉMON KARTEN ANZEIGEN
// ==================================

function displayPokemon(pokemonArray){



    const container = document.getElementById("pokemonList");


    container.innerHTML = "";



    if(pokemonArray.length === 0){


        container.innerHTML = 
        "<h2>Keine Pokémon gefunden</h2>";


        return;

    }






    pokemonArray.forEach(pokemon => {



        let types = pokemon.types
        .map(type => type.type.name)
        .join(", ");





        container.innerHTML += `



        <div class="pokemon-card">


            <img 
            src="${pokemon.sprites.other["official-artwork"].front_default}"
            >



            <h2>
            ${pokemon.name}
            </h2>



            <p>
            Typ: ${types}
            </p>





            <button onclick="showEvolution('${pokemon.name}')">

                🌱 Evolution anzeigen

            </button>




            <div 
            class="evolution"
            id="evo-${pokemon.name}">

            </div>



        </div>



        `;



    });



}









// ==================================
// TYP FILTER
// ==================================


document
.getElementById("typeFilter")
.addEventListener("change", function(){



    let selectedType = this.value;



    console.log("Filter:", selectedType);



    if(selectedType === "all"){



        displayPokemon(allPokemon);


        return;

    }





    let filteredPokemon = allPokemon.filter(function(pokemon){



        return pokemon.types.some(function(type){


            return type.type.name === selectedType;


        });



    });





    console.log("Gefiltert:", filteredPokemon);



    displayPokemon(filteredPokemon);



});









// ==================================
// FILTER RESET
// ==================================


function resetFilter(){


    document
    .getElementById("typeFilter")
    .value = "all";



    displayPokemon(allPokemon);


}









// ==================================
// EVOLUTION BUTTON
// ==================================


async function showEvolution(name){



    const speciesResponse = await fetch(

        `https://pokeapi.co/api/v2/pokemon-species/${name}`

    );



    const speciesData = await speciesResponse.json();





    const evolutionResponse = await fetch(

        speciesData.evolution_chain.url

    );



    const evolutionData = await evolutionResponse.json();





    let chain = evolutionData.chain;



    let evolutionText = chain.species.name;





    if(chain.evolves_to.length > 0){


        evolutionText += 
        " → " +
        chain.evolves_to[0].species.name;


    }






    if(
        chain.evolves_to.length > 0 &&
        chain.evolves_to[0].evolves_to.length > 0
    ){


        evolutionText +=
        " → " +
        chain.evolves_to[0]
        .evolves_to[0]
        .species.name;


    }






    document
    .getElementById("evo-" + name)
    .innerHTML = 
    "Evolution: " + evolutionText;



}









// ==================================
// POKÉMON SUCHEN
// ==================================


async function searchPokemon(){



    let name = document
    .getElementById("pokemonName")
    .value
    .toLowerCase()
    .trim();





    if(name === ""){


        alert("Bitte Pokémon Namen eingeben");


        return;

    }






    try{


        const response = await fetch(
            apiUrl + name
        );



        if(!response.ok){


            throw new Error();


        }





        const pokemon = await response.json();





        let types = pokemon.types
        .map(type => type.type.name)
        .join(", ");







        document
        .getElementById("pokemonInfo")
        .innerHTML = `



        <div class="card">


        <img 
        src="${pokemon.sprites.other["official-artwork"].front_default}"
        >



        <h2>
        ${pokemon.name}
        </h2>



        <p>
        Typ: ${types}
        </p>



        </div>



        `;



    }


    catch{


        document
        .getElementById("pokemonInfo")
        .innerHTML = 
        "<h2>Pokémon nicht gefunden</h2>";

    }



}









// ==================================
// START
// ==================================


window.onload = function(){


    loadPokemon();


};