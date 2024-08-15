let map, watchId;
let gst = 0; // Example initial GST
let gmt = 0; // Example initial GMT
let score = 0; // Example initial Score
let level = 1; // Example initial Level
let startTime, distance = 0;

// Initialize map
function initMap() {
    map = L.map('map').setView([0, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
}

// Join a challenge
function joinChallenge(challengeName) {
    webApp.showAlert(`You joined the ${challengeName} challenge!`);
    startTrackingChallenge(challengeName);
}

// Claim rewards
function claimReward(requiredPoints) {
    if (score >= requiredPoints) {
        score -= requiredPoints;
        const tonAmount = requiredPoints / 100;
        webApp.showAlert(`Congratulations! You claimed ${tonAmount} TON!`);
        document.getElementById('rewardScore').textContent = score;
    } else {
        webApp.showAlert("You don't have enough points to claim this reward.");
    }
}

// Level up logic
function updateLevelUpInfo() {
    document.getElementById('currentLevel').textContent = level;
    const gstRequired = (level + 1) * 10;
    const gmtRequired = Math.floor((level + 1) / 2) * 5;
    document.getElementById('gstRequired').textContent = gstRequired;
    document.getElementById('gmtRequired').textContent = gmtRequired;
}

function performLevelUp() {
    const gstRequired = (level + 1) * 10;
    const gmtRequired = Math.floor((level + 1) / 2) * 5;
    if (gst >= gstRequired && gmt >= gmtRequired) {
        gst -= gstRequired;
        gmt -= gmtRequired;
        level++;
        webApp.showAlert(`Congratulations! You reached level ${level}!`);
        updateLevelUpInfo();
    } else {
        webApp.showAlert("You don't have enough GST or GMT to level up.");
    }
}

// Shop purchases
function buyItem(itemName) {
    let cost;
    switch (itemName) {
        case 'Sneaker Box':
            cost = 300;
            break;
        case 'Gem':
            cost = 100;
            break;
        default:
            webApp.showAlert("Unknown item.");
            return;
    }

    if (gst >= cost) {
        gst -= cost;
        webApp.showAlert(`You bought a ${itemName} for ${cost} GST!`);
        document.getElementById('availableGST').textContent = gst.toFixed(2);
    } else {
        webApp.showAlert("You don't have enough GST to buy this item.");
    }
}

// Start tracking challenge
function startTrackingChallenge(challengeName) {
    startTime = new Date();
    distance = 0;

    watchId = navigator.geolocation.watchPosition((position) => {
        updateLocation(position);
        updateChallengeProgress(challengeName);
    }, (error) => {
        console.error("Error getting location: " + error.message);
        webApp.showAlert("Error getting location: " + error.message);
    }, {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 30000
    });
}

// Update challenge progress
function updateChallengeProgress(challengeName) {
    const duration = (new Date() - startTime) / 1000 / 60; // duration in minutes
    const progressPercentage = (distance / 1000) * 10; // Placeholder for challenge distance

    document.querySelector('.progress-bar-fill').style.width = progressPercentage + '%';
    document.querySelector('.progress-bar-text').textContent = Math.round(progressPercentage) + '%';

    const challengeComplete = checkChallengeCompletion(challengeName, distance, duration);

    if (challengeComplete) {
        completeChallenge(challengeName);
    }
}

function checkChallengeCompletion(challengeName, distance, duration) {
    switch (challengeName) {
        case '5km Walk':
            return distance >= 5000;
        case '10km Run':
            return distance >= 10000;
        case 'Burn 500 Calories':
            // Placeholder: Implement actual calorie calculation logic here
            return (distance * 0.04) >= 500; // Simplified estimate: 20 calories per km
        default:
            return false;
    }
}

function completeChallenge(challengeName) {
    webApp.showAlert(`Challenge ${challengeName} completed!`);
    navigator.geolocation.clearWatch(watchId);
    // Implement reward calculation and user score update here
    calculateRewards();
    showHome();
}

// Function to update location
function updateLocation(position) {
    const { latitude, longitude } = position.coords;
    L.marker([latitude, longitude]).addTo(map)
        .bindPopup(`Lat: ${latitude.toFixed(5)}, Lng: ${longitude.toFixed(5)}`).openPopup();
    map.setView([latitude, longitude], 13);

    // Calculate distance using Haversine formula or similar
}

function calculateRewards() {
    // Placeholder: Implement actual reward calculation logic
}

function showHome() {
    // Placeholder: Implement navigation logic to home screen
}

// Initialize map on load
window.onload = initMap;
