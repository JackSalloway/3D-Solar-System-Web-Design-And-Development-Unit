import * as THREE from "three";
import { initCameraControls } from "./camera-controls.js";
import { planetData } from "./data.js";

// Get the planet name from the URL query parameters
const params = new URLSearchParams(window.location.search);
const planetKey = params.get("planet");

let is3DViewActive = false; // Variable to toggle between the image and 3D model
let sceneInitialised = false; // Variable to track if the 3D scene has been set up or not, once true will prevent the need to set up another 3D scene when toggling between the image and 3D model
const toggleButton = document.getElementById("toggle-planet-media-button"); // Reference to the button that switches between the planet image and 3D model

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
    document.querySelector("#classification").innerText = data.classification;
    document.querySelector("#orbital-period").innerText =
        data.orbitalPeriod.string;
    document.querySelector("#rotation-period").innerText =
        data.rotationSpeed.string;
    document.querySelector("#radius").innerText = data.radius.string;
    document.querySelector("#distance-from-sun").innerText =
        data.distanceFromSun.string;
    document.querySelector("#surface-gravity").innerText = data.gravity;
    document.querySelector("#mass").innerText = data.mass;
    document.querySelector("#number-of-moons").innerText = data.numberOfMoons;
    document.querySelector("#surface-temperature").innerText =
        data.surfaceTemperature;
    document.querySelector("#escape-velocity").innerText = data.escapeVelocity;
    document.querySelector("#description").innerText = data.description;

    // Set the planet image
    const planetImage = document.querySelector(".planet-page-planet-image");
    planetImage.src = data.image;
    planetImage.alt = "An image of the planet " + data.name;

    // Add click event listener to the toggle media button
    toggleButton.addEventListener("click", toggleMedia);

    // Set the page title to the planet name
    document.title = data.name + " - Solar System Explorer";
};

// Function to toggle the media between an image and a 3D model
const toggleMedia = () => {
    // Toggle the value of is3DViewActive
    is3DViewActive = !is3DViewActive;

    const planetImage = document.getElementById("planet-image");
    const planetCanvasContainer = document.getElementById("planet-3d-canvas");

    if (is3DViewActive) {
        // Render the 3D model
        // Update classes to only render the current selected view
        hideElement(planetImage, true);
        hideElement(planetCanvasContainer, false);

        // Update button text and aria attribute values for next click
        toggleButton.textContent = "Switch to image";
        toggleButton.setAttribute("aria-pressed", "true");

        // Check if the scene is yet to be initialised
        if (!sceneInitialised) {
            initSinglePlanetView(planetCanvasContainer); // Initialise the scene
            sceneInitialised = true; // Set sceneInitialised to true, prevents the need to create new 3D scenes when further toggling between the image and 3D model
        }
    } else {
        // Render the image
        // Update classes to only render the current selected view
        hideElement(planetImage, false);
        hideElement(planetCanvasContainer, true);

        // Update button text and aria attribute values for next click
        toggleButton.textContent = "Switch to 3D model";
        toggleButton.setAttribute("aria-pressed", "false");
    }
};

// Function to update the class and ARIA states of media elements
const hideElement = (element, shouldHide) => {
    if (shouldHide) {
        element.classList.add("hidden");
        element.setAttribute("aria-hidden", "true");
    } else {
        element.classList.remove("hidden");
        element.setAttribute("aria-hidden", "false");
    }
};

// Function to set up a Three.js canvas with the current planet in it's centre
const initSinglePlanetView = (container) => {
    // Create the scene
    const scene = new THREE.Scene();

    // Create the camera
    const camera = new THREE.PerspectiveCamera(
        75,
        container.clientWidth / container.clientHeight,
        0.1,
        100,
    );

    // Create the renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Create and add lighting to the scene
    // Faint, ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    // Stronger, directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);

    // Create the planet mesh
    const textureLoader = new THREE.TextureLoader();
    const geometry = new THREE.SphereGeometry(8, 128, 128);
    const material = new THREE.MeshStandardMaterial({
        map: textureLoader.load(planetData[planetKey].texture),
    });
    const planetMesh = new THREE.Mesh(geometry, material);
    scene.add(planetMesh);

    // Move the camera to a position where it can see the planet
    camera.position.z = 10;

    // Create the camera controls
    const controls = initCameraControls(camera, renderer);

    // Prevent the user from zooming or panning
    controls.enableZoom = false;
    controls.enablePan = false;

    // Add a slight amount of damping so movement doesn't end so abruptly
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    const animate = () => {
        requestAnimationFrame(animate);

        planetMesh.rotation.y += 0.002;

        controls.update();

        renderer.render(scene, camera);
    };

    animate();
};

// Function to update the navbar links based on the current planet being viewed
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

// Call the functions to initialize the page and update the navbar
initPlanetPage();
updateNavbar(planetKey);
