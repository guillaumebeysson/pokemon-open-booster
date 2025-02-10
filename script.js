document.addEventListener("DOMContentLoaded", () => {
    const cardContainer = document.getElementById("card-container");
    const openAnotherButton = document.getElementById("open-another");

    // Élément pour l'affichage en plein écran
    const fullscreenContainer = document.getElementById("fullscreen-container");
    const fullscreenCard = document.getElementById("fullscreen-card");
    const closeFullscreen = document.getElementById("close-fullscreen");

    // Initialiser Swiper.js
    const swiper = new Swiper(".mySwiper", {
        effect: "cards", // Active l'effet "cards"
        grabCursor: true,
        cardsEffect: {
            slideShadows: false, // Désactive les ombres sur les slides
        }
    });


    async function fetchPokemonCards() {
        try {
            const response = await fetch("https://api.tcgdex.net/v2/fr/cards");
            const data = await response.json();

            if (data.length === 0) {
                console.error("Aucune carte trouvée !");
                return;
            }

            let selectedCards = [];
            let attempts = 0;

            while (selectedCards.length < 10 && attempts < 50) {
                const randomIndex = Math.floor(Math.random() * data.length);
                const randomCard = data[randomIndex];

                if (randomCard?.image) {
                    selectedCards.push(`${randomCard.image}/high.png`);
                }
                attempts++;
            }

            displayCards(selectedCards);
        } catch (error) {
            console.error("Erreur lors de la récupération des cartes :", error);
        }
    }

    function displayCards(cards) {
        cardContainer.innerHTML = "";
        cardContainer.classList.remove("hidden");

        cards.forEach((cardUrl, index) => {
            const cardWrapper = document.createElement("div");
            cardWrapper.classList.add("card-wrapper");

            const cardElement = document.createElement("div");
            cardElement.classList.add("card");

            const cardBack = document.createElement("img");
            cardBack.src = "images/back-card-pokemon.png";
            cardBack.classList.add("card-back");

            const cardFront = document.createElement("img");
            cardFront.src = cardUrl;
            cardFront.classList.add("card-front");

            let isFlipped = false;

            cardElement.addEventListener("click", () => {
                if (!isFlipped) {
                    cardElement.classList.add("flipped");
                    isFlipped = true;
                } else {
                    fullscreenCard.src = cardUrl;
                    fullscreenContainer.classList.add("show");
                }
            });

            cardElement.appendChild(cardBack);
            cardElement.appendChild(cardFront);
            cardWrapper.appendChild(cardElement);
            cardContainer.appendChild(cardWrapper);
        });

        openAnotherButton.classList.remove("hidden");
    }

    // Ajouter un événement de clic sur chaque booster
    document.querySelectorAll(".swiper-slide img.booster").forEach(booster => {
        booster.addEventListener("click", () => {
            document.querySelector(".booster-carousel-container").classList.add("hidden"); // Cacher le carousel
            fetchPokemonCards(); // Charger les cartes Pokémon
        });
    });

    // Réouvrir un autre booster
    openAnotherButton.addEventListener("click", () => {
        document.querySelector(".booster-carousel-container").classList.remove("hidden");
        cardContainer.classList.add("hidden");
        cardContainer.innerHTML = "";
        openAnotherButton.classList.add("hidden");
    });

    // Fermer l'agrandissement de la carte
    closeFullscreen.addEventListener("click", () => {
        fullscreenContainer.classList.remove("show");
    });

    fullscreenContainer.addEventListener("click", (e) => {
        if (e.target === fullscreenContainer) {
            fullscreenContainer.classList.remove("show");
        }
    });
});

