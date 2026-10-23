"use strict";

// ==========================================
// NAIJA LIFE SIMULATOR
// Version 0.1.0
// ==========================================

const SAVE_KEY = "naijaLifeSimulatorSave_v1";

const STARTING_PLAYER = {
    name: "New Citizen",
    location: "chose by player",
    occupation: "Unemployed",
    day: 1,
    money: 5000,
    health: 100,
    energy: 100,
    reputation: 0,
    careerXP: 0,
    meals: 0
};

let player = loadGame() || { ...STARTING_PLAYER };

function loadGame() {
    try {
        const savedData = localStorage.getItem(SAVE_KEY);

        if (!savedData) {
            return null;
        }

        const parsedData = JSON.parse(savedData);

        if (
            !parsedData ||
            typeof parsedData !== "object" ||
            !Number.isFinite(parsedData.money) ||
            !Number.isFinite(parsedData.health) ||
            !Number.isFinite(parsedData.energy) ||
            !Number.isFinite(parsedData.day)
        ) {
            return null;
        }

        return {
            ...STARTING_PLAYER,
            ...parsedData
        };
    } catch (error) {
        console.error("Could not load saved game:", error);
        return null;
    }
}

function saveGame(showMessage = true) {
    try {
        localStorage.setItem(SAVE_KEY, JSON.stringify(player));

        if (showMessage) {
            updateNotification("Your progress has been saved on this device.");
            document.getElementById("save-status").textContent =
                "Progress saved successfully!";
        }

        return true;
    } catch (error) {
        console.error("Could not save game:", error);

        document.getElementById("save-status").textContent =
            "Saving failed. Your browser storage may be unavailable.";

        updateNotification("We could not save your progress. Please check your browser.");

        return false;
    }
}

function formatMoney(amount) {
    return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        maximumFractionDigits: 0
    }).format(amount);
}

function updateNotification(message) {
    document.getElementById("notification").textContent = message;
}

function renderGame() {
    document.getElementById("player-name").textContent = player.name;
    document.getElementById("occupation").textContent = player.occupation;
    document.getElementById("location").textContent = player.location;

    document.getElementById("day").textContent = player.day;
    document.getElementById("money").textContent = formatMoney(player.money);

    document.getElementById("health").textContent =
        `${player.health} / 100`;

    document.getElementById("energy").textContent =
        `${player.energy} / 100`;

    document.getElementById("reputation").textContent = player.reputation;

    document.getElementById("health-bar").style.width =
        `${player.health}%`;

    document.getElementById("energy-bar").style.width =
        `${player.energy}%`;

    document.getElementById("career-level").textContent =
        `Level ${Math.floor(player.careerXP / 5) + 1}`;

    let stage = "Getting Started";

    if (player.money >= 100000) {
        stage = "Building Wealth";
    } else if (player.money >= 25000) {
        stage = "Finding Your Feet";
    }

    document.getElementById("life-stage").textContent = stage;

    document.getElementById("work-btn").disabled =
        player.energy < 25 || player.health <= 0;

    document.getElementById("food-btn").disabled =
        player.money < 500 || player.health <= 0;

    document.getElementById("rest-btn").disabled =
        player.energy >= 100 || player.health <= 0;

    document.getElementById("sleep-btn").disabled =
        player.health <= 0;
}

function performWork() {
    if (player.health <= 0) {
        updateNotification("Your health is too low. Rest and recover first.");
        return;
    }

    if (player.energy < 25) {
        updateNotification("You're too tired to work. Rest or sleep first.");
        return;
    }

    player.money += 1500;
    player.energy -= 25;
    player.careerXP += 1;

    updateNotification(
        "You completed a day's job and earned ₦1,500. Keep building your future!"
    );

    saveGame(false);
    renderGame();
}

function buyFood() {
    if (player.health <= 0) {
        updateNotification("Your health is too low. Recover before continuing.");
        return;
    }

    if (player.money < 500) {
        updateNotification("You don't have enough money to buy food.");
        return;
    }

    player.money -= 500;
    player.health = Math.min(100, player.health + 10);
    player.energy = Math.min(100, player.energy + 5);
    player.meals += 1;

    updateNotification(
        "You bought a meal for ₦500. Your health and energy improved."
    );

    saveGame(false);
    renderGame();
}

function rest() {
    if (player.health <= 0) {
        updateNotification("Your health is too low. Sleep to recover.");
        return;
    }

    if (player.energy >= 100) {
        updateNotification("You're already fully rested.");
        return;
    }

    player.energy = Math.min(100, player.energy + 50);

    updateNotification("You took a break and recovered energy.");

    saveGame(false);
    renderGame();
}

function sleep() {
    player.day += 1;

    player.energy = 100;

    if (player.health > 0) {
        player.health = Math.min(100, player.health + 10);
    }

    updateNotification(
        `A new day begins! It is now Day ${player.day}. What will you do next?`
    );

    saveGame(false);
    renderGame();
}

function changePlayerName() {
    const newName = prompt("What should your character be called?");

    if (newName === null) {
        return;
    }

    const cleanedName = newName.trim();

    if (!cleanedName) {
        updateNotification("Your character's name cannot be empty.");
        return;
    }

    player.name = cleanedName.slice(0, 30);

    updateNotification(`Welcome to your new chapter, ${player.name}!`);

    saveGame(false);
    renderGame();
}

function resetGame() {
    const confirmed = confirm(
        "Are you sure you want to reset your game? Your saved progress on this browser will be lost."
    );

    if (!confirmed) {
        return;
    }

    player = { ...STARTING_PLAYER };

    try {
        localStorage.removeItem(SAVE_KEY);
    } catch (error) {
        console.error("Could not clear saved game:", error);
    }

    updateNotification("A new journey begins! Welcome, citizen.");
    document.getElementById("save-status").textContent =
        "New game started.";

    renderGame();
    saveGame(false);
}

// Connect the buttons to their actions.

document.getElementById("work-btn").addEventListener("click", performWork);
document.getElementById("food-btn").addEventListener("click", buyFood);
document.getElementById("rest-btn").addEventListener("click", rest);
document.getElementById("sleep-btn").addEventListener("click", sleep);

document.getElementById("change-name-btn").addEventListener(
    "click",
    changePlayerName
);

document.getElementById("save-btn").addEventListener(
    "click",
    () => saveGame(true)
);

document.getElementById("reset-btn").addEventListener("click", resetGame);

// Start the game.

renderGame();
