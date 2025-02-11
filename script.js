document.addEventListener("DOMContentLoaded", () => {
    const cardContainer = document.getElementById("card-container");
    const openAnotherButton = document.getElementById("open-another");
    const fullscreenContainer = document.getElementById("fullscreen-container");
    const fullscreenCard = document.getElementById("fullscreen-card");
    const closeFullscreen = document.getElementById("close-fullscreen");

    // Initialiser Swiper.js
    const swiper = new Swiper(".mySwiper", {
        effect: "cards",
        grabCursor: true,
        cardsEffect: {
            slideShadows: false, // Désactive les ombres sur les slides
        }
    });

    // Fonction pour vérifier si une carte est spéciale
    async function fetchCardDetails(cardId) {
        try {
            const response = await fetch(`https://api.tcgdex.net/v2/fr/cards/${cardId}`);
            const cardData = await response.json();

            // Liste des raretés spéciales
            const specialRarities = ["LÉGENDE", "Holo Rare V", "Holo Rare VSTAR", "Illustration rare", "Illustration spéciale rare", "Double rare", "Ultra Rare", "Holo Rare VMAX", "Magnifique rare", "Secret Rare", "Full Art"];

            // Vérifie si la carte est spéciale en fonction de la rareté
            const isSpecial = specialRarities.includes(cardData.rarity);

            if (isSpecial) {
                console.log(`🔥 La carte ${cardData.name} (${cardData.rarity}) est spéciale !`);
                return true;
            } else {
                console.log(`✔️ La carte ${cardData.name} (${cardData.rarity}) est normale.`);
                return false;
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des détails de la carte :", error);
            return false;
        }
    }

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
                    // Récupérer les détails de la carte pour vérifier la rareté
                    const isSpecial = await fetchCardDetails(randomCard.id);

                    selectedCards.push({
                        imageUrl: `${randomCard.image}/high.png`,
                        isSpecial: isSpecial,
                    });
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

        cards.forEach((card) => {
            const cardWrapper = document.createElement("div");
            cardWrapper.classList.add("card-wrapper");

            const cardElement = document.createElement("div");
            cardElement.classList.add("card");

            // Ajouter un effet spécial si la carte est rare
            if (card.isSpecial) {
                cardElement.classList.add("special-card");
            }

            const cardBack = document.createElement("img");
            cardBack.src = "images/back-card-pokemon.png";
            cardBack.classList.add("card-back");

            const cardFront = document.createElement("img");
            cardFront.src = card.imageUrl;
            cardFront.classList.add("card-front");

            let isFlipped = false;

            cardElement.addEventListener("click", () => {
                if (!isFlipped) {
                    cardElement.classList.add("flipped");

                    // Appliquer l'effet seulement si c'est une carte spéciale
                    if (card.isSpecial) {
                        applySpecialCardEffect(cardElement);
                    }

                    isFlipped = true;
                } else {
                    fullscreenCard.src = card.imageUrl;
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

// EFFET ANIMATIONS CARTES SPECIALES
function applySpecialCardEffect(cardElement) {
    cardElement.classList.add("special-card-animated");
    setTimeout(() => {
        cardElement.classList.remove("special-card-animated");
    }, 1500);
}





