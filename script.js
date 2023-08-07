const cohortName = "2306-fsa-et-web-ft-sf";
const API_URL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}`;

const fetchAllPlayers = async () => {
  try {
    const response = await fetch(`${API_URL}/players`);
    const data = await response.json();
    return data.data.players;
  } catch (err) {
    console.error("Problem fetching players!", err);
  }
};

const fetchSinglePlayer = async (playerId) => {
  try {
    const response = await fetch(`${API_URL}/players/${playerId}`);
    const data = await response.json();
    return data.data;
  } catch (err) {
    console.error(`Problem fetching player #${playerId}!`, err);
  }
};

const addNewPlayer = async (playerObj) => {
  try {
    const response = await fetch(`${API_URL}/players`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(playerObj),
    });
    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error adding new player!", err);
  }
};

const removePlayer = async (playerId) => {
  try {
    await fetch(`${API_URL}/players/${playerId}`, {
      method: "DELETE",
    });
  } catch (err) {
    console.error(`Problem removing player #${playerId} from the list!`, err);
  }
};

const renderAllPlayers = async () => {
  try {
    const playerList = await fetchAllPlayers();
    const mainElement = document.querySelector("main");
    mainElement.innerHTML = "";
    mainElement.classList.remove('single-view');

    if (!Array.isArray(playerList) || playerList.length === 0) {
      const messageElement = document.createElement("p");
      messageElement.textContent = "No players found.";
      mainElement.appendChild(messageElement);
    } else {
      playerList.forEach((player) => {
        const playerCard = createPlayerCard(player);
        mainElement.appendChild(playerCard);
      });
    }
  } catch (err) {
    console.error("Trouble rendering players!", err);
  }
};

const renderSinglePlayer = async (playerId, imageUrl) => {
  try {
    const data = await fetchSinglePlayer(playerId);
    const player = data.player;
    player.imageUrl = imageUrl;

    const mainElement = document.querySelector("main");
    mainElement.innerHTML = "";
    mainElement.classList.add('single-view');

    const playerCard = createSinglePlayerCard(player);
    const backButton = document.createElement("button");
    backButton.textContent = "Back";
    backButton.classList.add('back-button');
    backButton.addEventListener("click", renderAllPlayers);

    playerCard.appendChild(backButton);
    mainElement.appendChild(playerCard);
  } catch (err) {
    console.error(`Issue rendering player #${playerId}!`, err);
  }
};

const createPlayerCard = (player) => {
  const playerCard = document.createElement("div");
  playerCard.classList.add("player-card");

  const nameElement = document.createElement("h2");
  nameElement.textContent = player.name || "Name not available";

  const idElement = document.createElement("p");
  idElement.textContent = `ID: ${player.id}`;

  const breedElement = document.createElement("p");
  breedElement.textContent = `Breed: ${player.breed}`;

  const imageElement = document.createElement("img");
  imageElement.src = player.imageUrl;
  imageElement.classList.add("player-image");
  imageElement.alt = player.name || "Player Image";

  const seeDetailsButton = document.createElement("button");
  seeDetailsButton.textContent = "See details";
  seeDetailsButton.classList.add(`see-details`);
  seeDetailsButton.addEventListener("click", () =>
    renderSinglePlayer(player.id, player.imageUrl)
  );

  playerCard.appendChild(nameElement);
  playerCard.appendChild(idElement);
  playerCard.appendChild(breedElement);
  playerCard.appendChild(imageElement);
  playerCard.appendChild(seeDetailsButton);
  return playerCard;
};

const createSinglePlayerCard = (player) => {
  const playerCard = document.createElement("div");
  playerCard.classList.add("player-card");

  const nameElement = document.createElement("h2");
  nameElement.textContent = player.name || "Name not available";

  const idElement = document.createElement("p");
  idElement.textContent = `ID: ${player.id}`;

  const breedElement = document.createElement("p");
  breedElement.textContent = `Breed: ${player.breed}`;

  const imageElement = document.createElement("img");
  imageElement.src = player.imageUrl;
  imageElement.classList.add("player-image");
  imageElement.alt = player.name || "Player Image";

  const removeButton = document.createElement("button");
  removeButton.textContent = "Remove Player";
  removeButton.classList.add(`remove-button`);
  removeButton.addEventListener("click", async () => {
    await removePlayer(player.id);
    await renderAllPlayers();
  });

  playerCard.appendChild(nameElement);
  playerCard.appendChild(idElement);
  playerCard.appendChild(breedElement);
  playerCard.appendChild(imageElement);
  playerCard.appendChild(removeButton);
  return playerCard;
};

document.getElementById('new-player-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const playerObj = Object.fromEntries(formData.entries());
  await addNewPlayer(playerObj);
  await renderAllPlayers();
});

const init = async () => {
  await renderAllPlayers();
};

init();
