import { planetData } from "./data.js";

// Get the planet name from the URL query parameters
const params = new URLSearchParams(window.location.search);
const planetKey = params.get("planet");

// Function to populate the planet information page after the user clicks on a planet
const initPlanetPage = () => {
    // Find the correct planet data using the key
    const data = planetData[planetKey];

    if (!data) {
        console.error("Planet data not found for key:", planetKey);
        return;
    }

    // Populate the page with the planet data
    document.querySelector("#planet-header").innerText = data.name;
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

const updateNavbar = (currentPlanet) => {
    const navbarLinks = document.querySelectorAll(".navbar-link");

    navbarLinks.forEach((link) => {
        // Get data for each planet from their URL objects
        const url = new URL(link.href, window.location.origin);
        const planetParam = url.searchParams.get("planet");

        // Apply or remove the nav-inactive class to the navbar links based on the current planet the user is viewing
        if (planetParam === currentPlanet) {
            link.classList.add("nav-inactive");
        } else {
            link.classList.remove("nav-inactive");
        }
    });
};

// Call the function
initPlanetPage();
updateNavbar(planetKey);
