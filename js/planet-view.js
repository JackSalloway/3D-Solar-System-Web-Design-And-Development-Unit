import { planetData } from "./data.js";

// Function to populate the planet information page after the user clicks on a planet
const initPlanetPage = () => {
    // Get the planet name from the URL query parameters
    const params = new URLSearchParams(window.location.search);
    const planetKey = params.get("planet");

    // Find the correct planet data using the key
    const data = planetData[planetKey];

    // Log data to console for debugging
    console.log("Planet data for key:", planetKey, data);

    if (!data) {
        console.error("Planet data not found for key:", planetKey);
        return;
    }

    // Populate the page with the planet data
    document.querySelector("#orbital-period").innerText = data.orbitalPeriod;
    document.querySelector("#diameter").innerText = data.diameter;
    document.querySelector("#distance-from-sun").innerText =
        data.distanceFromSun;
    document.querySelector("#number-of-moons").innerText = data.numberOfMoons;
    document.querySelector("#surface-temperature").innerText =
        data.surfaceTemperature;
    document.querySelector("#interesting-fact").innerText =
        data.interestingFact;
    document.querySelector("#description").innerText = data.description;

    // Set the planet image
    const planetImage = document.querySelector(".planet-page-planet-image");
    planetImage.src = data.image;
    planetImage.alt = "High resolution image of " + data.name;

    // Set the page title to the planet name
    document.title = data.name + " - Solar System Explorer";
};

// Call the function
initPlanetPage();
