import * as THREE from "three";
import { initCameraControls } from "./camera-controls.js";
import { initRaycastInteraction } from "./raycast-interaction.js";
import { planetData } from "./data.js";

const planets = []; // Array of objects to store all planets and their corresponding orbit anchors for easy access in the animation loop
const baseRotationSpeed = 0.005; // Base speed for Earth's rotation, used to calculate the speeds of the other planets based on their rotation  periods
const baseOrbitalSpeed = 0.002; // Base speed for Earth's orbit, used to calculate the speeds of the other planets based on their orbital periods
const baseDistanceFromSun = 100; // Base distance from the sun for Earth, used to calculate the distances of the other planets based on their actual distances from the sun, 100 units = 149.6 million km
const basePlanetRadius = 2; // Base radius for Earth, used to calculate the radii of the other planets based on their actual diameters, 1 unit = 6371 km (Earth's diameter / 2)
const clickableMeshes = []; // Array to store all meshes that should be clickable, allowing for enhanced camera controls relating to the clicked mesh.
let selectedMesh = null; // Variable to store the mesh that has been clicked on by the user
const selectedMeshPreviousPosition = new THREE.Vector3(); // Vector to store the previous position of the selected mesh before it is moved to the camera target position for focused viewing

// Create the 3D canvas
const container = document.getElementById("site-main"); // Variable to store the container element for the Three.js canvas (users monitor width x 90% users monitor height)
const renderer = new THREE.WebGLRenderer({ antialias: true }); // Variable to store the Three.js WebGL renderer
renderer.setSize(container.clientWidth, container.clientHeight); // Set the size of the renderer to match the size of the container element
container.appendChild(renderer.domElement); // Append the renderer as a child of the container reference

// Create the camera
const camera = new THREE.PerspectiveCamera(
    75,
    container.clientWidth / container.clientHeight,
    0.1,
    10000,
);

// Create the camera controls
const controls = initCameraControls(camera, renderer); // Initialize camera controls to allow the user to explore the solar system

// Function to initialize the solar system view
const initSolarSystemView = () => {
    // Create the scene
    const scene = new THREE.Scene();

    // Create the renderer

    // Camera beginning position and orientation is set to be above the sun, looking down at it
    camera.position.set(0, 75, 0);
    camera.lookAt(0, 0, 0);

    // Create a cube texture loader to load the space background
    const cubeTextureLoader = new THREE.CubeTextureLoader();

    // Load the 6 space images that make up the skybox
    const skyboxTexture = cubeTextureLoader.load([
        "../images/star_skybox_1.png", // Right
        "../images/star_skybox_2.png", // Left
        "../images/star_skybox_3.png", // Top
        "../images/star_skybox_4.png", // Bottom
        "../images/star_skybox_5.png", // Front
        "../images/star_skybox_6.png", // Back
    ]);

    // Set the scene background to the loaded skybox texture
    scene.background = skyboxTexture;

    // Store a reference to the jump to section wrapper (used to assign click events to buttons when meshes are created)
    const jumpToWrapper = document.getElementById("jump-to-buttons-wrapper");

    // Render the sun and add it to the clickableMeshes array
    const sun = createSun(scene);

    // Update the jump to buttons functionality for the sun
    setJumpToButtonFunctionality(
        document.getElementById("jump-to-sun-button"),
        sun,
    );

    // Set the userData values of the sun mesh. As there is no data for the sun in data.js (only planets) I will add the relevant information here
    sun.userData.name = "The Sun";
    sun.userData.classification = "G-type main-sequence star";
    sun.userData.image = "./images/sun.jpg";
    clickableMeshes.push(sun);

    // Use the planetData object to add all the planets and their orbit lines to the scene
    // Distance from the sun is calculated based on the actual distance of each planet from the sun, with earth's distance of 1AU set to 100 Three.js units
    // Rotation speeds are based on the actual rotation periods of the planets, with earth's rotation set to 0.005 as a 24 hour rotation period
    // Orbit speeds are based on the actual orbital periods of the planets, with earth's orbit speed set to 0.002 as a 365 day orbital period
    Object.values(planetData).forEach((planet) => {
        // Create the mesh and store it in a variable
        const currentPlanet = createPlanet(
            scene,
            planet.name,
            planet.texture,
            (planet.radius.value / planetData.earth.radius.value) *
                basePlanetRadius,
            (planet.distanceFromSun.value /
                planetData.earth.distanceFromSun.value) *
                baseDistanceFromSun,
            (planetData.earth.rotationSpeed.value /
                planet.rotationSpeed.value) *
                baseRotationSpeed,
            (planetData.earth.orbitalPeriod.value /
                planet.orbitalPeriod.value) *
                baseOrbitalSpeed,
        );

        // Add the current planet to the planets array for animations
        planets.push(currentPlanet);

        // Update the mesh name value and add the mesh to the clickableMeshes array for interactivity
        currentPlanet.mesh.name = planet.name;
        clickableMeshes.push(currentPlanet.mesh);

        // add orbit line to the scene for the current planet
        createOrbitLine(scene, currentPlanet.distanceFromSun);

        // Add functionality to the jump to buttons in the sidebar
        // Update the jump to buttons functionality for the sun
        setJumpToButtonFunctionality(
            document.getElementById(
                `jump-to-${planet.name.toLowerCase()}-button`,
            ),
            currentPlanet.mesh,
        );
    });

    // Initialize raycast interaction for mouse clicks on the sun and planets, allowing for enhanced camera controls relating to the clicked mesh.
    initRaycastInteraction(camera, renderer, clickableMeshes, handleMeshSelect);

    // Animation loop to render the scene
    const animate = () => {
        requestAnimationFrame(animate);

        // Check if a mesh is selected, if so make the camera follow it as moves
        if (selectedMesh) {
            // Prevent the user from panning with the right mouse button (sends the camera flying into space otherwise)
            controls.enablePan = false;

            // Get the selected mesh position for the current frame and store it in a variable
            const selectedMeshCurrentPosition = new THREE.Vector3();
            selectedMesh.getWorldPosition(selectedMeshCurrentPosition);

            // Calculate the distance the mesh moved since the last frame
            const delta = new THREE.Vector3().subVectors(
                selectedMeshCurrentPosition,
                selectedMeshPreviousPosition,
            );

            // Move the camera by the distance the selected mesh moved
            camera.position.add(delta);

            // Update the orbit controls to look at the new position of the mesh
            controls.target.copy(selectedMeshCurrentPosition);

            // Update the value of the selectedMeshPreviousPosition variable ready for next frame
            selectedMeshPreviousPosition.copy(selectedMeshCurrentPosition);
        } else {
            // Enable panning again as there is no current selected mesh
            controls.enablePan = true;
        }

        controls.update(); // Update camera controls for smoother movement as damping is enabled

        // Rotate the sun on its axis
        sun.rotation.y += 0.00018; // ~27 day rotation period

        // Loop through planets array to rotate each planet on its axis and rotate its orbit anchor to make it orbit the sun
        planets.forEach((planet) => {
            planet.mesh.rotation.y += planet.rotationSpeed;
            planet.anchor.rotation.y += planet.orbitSpeed;
        });

        renderer.render(scene, camera);
    };

    animate();
};

// Function to create and add the sun to the scene
const createSun = (scene) => {
    const textureLoader = new THREE.TextureLoader();
    const sunTexture = textureLoader.load("../images/sun_texture.jpg");

    // Create the sun material with emissive properties to make it glow
    const sunMaterial = new THREE.MeshStandardMaterial({
        map: sunTexture,
        emissive: 0xffcc33,
        emissiveMap: sunTexture,
        emissiveIntensity: 1.5,
    });

    // Create the sun geometry and mesh
    const sunGeometry = new THREE.SphereGeometry(20, 64, 64);
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    sun.position.set(0, 0, 0);
    scene.add(sun);

    // Add a point light at the sun's position to illuminate the scene
    const sunLight = new THREE.PointLight(0xffffff, 10000, 5000, 1.7);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);

    return sun;
};

const createOrbitLine = (scene, radius) => {
    // Define and store the curve in a variable
    const curve = new THREE.EllipseCurve(0, 0, radius, radius, 0, 2 * Math.PI);

    // Get points from the curve to create geometry
    const points = curve.getPoints(128); // Divided into 128 points for a smoother curve
    const geometry = new THREE.BufferGeometry().setFromPoints(points);

    // Apply a basic material to the geometry
    const material = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.2,
    });

    // Create the line
    const orbitLine = new THREE.Line(geometry, material);

    // Rotate the line to lie in the XZ plane
    orbitLine.rotation.x = Math.PI / 2;

    scene.add(orbitLine);
    return orbitLine;
};

// Function to create and add a planet to the scene
const createPlanet = (
    scene,
    name,
    texturePath,
    radius,
    distanceFromSun,
    rotationSpeed,
    orbitSpeed,
) => {
    // Create an anchor at the centre of the scene (the sun, centre of the scene is the default value) to allow the planet to orbit it
    const orbitAnchor = new THREE.Object3D();
    scene.add(orbitAnchor);

    // Create the planet texture
    const textureLoader = new THREE.TextureLoader();
    const planetTexture = textureLoader.load(texturePath);

    // Create the planet geometry and material
    const geometry = new THREE.SphereGeometry(radius, 32, 32);
    const material = new THREE.MeshStandardMaterial({
        map: planetTexture,
        roughness: 0.7,
    });
    const planet = new THREE.Mesh(geometry, material);

    planet.position.set(0, 0, distanceFromSun);

    // Add the planet as a child of the orbit anchor, so that when the anchor is rotated in the animation loop, the planet will orbit around the sun
    orbitAnchor.add(planet);

    // Assign the data for the current planet to a variable
    const currentPlanetData = planetData[name.toLowerCase()];

    // Update the mesh.userData value for use later
    planet.userData = {
        name: currentPlanetData.name,
        classification: currentPlanetData.classification,
        image: currentPlanetData.image,
    };

    // Return a planet object to be stored in the planets array
    return {
        anchor: orbitAnchor,
        mesh: planet,
        rotationSpeed: rotationSpeed,
        orbitSpeed: orbitSpeed,
        name: name,
        distanceFromSun: distanceFromSun,
    };
};

// Function to handle toggling the advanced controls sidebar on and off
const sidebarToggle = () => {
    // Get the required elements and store them in variables
    const toggleButton = document.getElementById("sidebar-toggle");
    const wrapper = document.getElementById("expandable-wrapper");

    // Toggle the classes that cause the sidebar to expand
    wrapper.classList.toggle("is-open");

    // Update the text for the button based on the current state of the sidebar
    if (wrapper.classList.contains("is-open")) {
        toggleButton.textContent = "▲ Advanced Controls";
    } else {
        toggleButton.textContent = "▼ Advanced Controls";
    }
};

// Function to tie each jump to button in the sidebar to the handleMeshSelect function for the relevant mesh
const setJumpToButtonFunctionality = (button, mesh) => {
    button.addEventListener("click", () => {
        handleMeshSelect(mesh);
    });
};

// Function to populate the selected celestial body section in the sidebar when the user selects one
const updateSidebarSelectedMesh = (mesh) => {
    const div = document.getElementById("selected-mesh-section");

    // The mesh parameter can be null if the user deselects a mesh
    if (!mesh) {
        div.innerHTML = `
            <h3>Selected Celesital Body</h3>
            <p>Double-Click a celestial body to select one!</p>
        `;
        return;
    }

    // There is a mesh selected, update the contents of the section
    // If the selected mesh is the sun, the more information button will not render
    div.innerHTML = `
        <h3>Selected Celesital Body</h3>
        <h4>${mesh.userData.name}</h4>
        <p>Classification: ${mesh.userData.classification}</p>
        <img src=${mesh.userData.image} alt='An image of the planet ${mesh.userData.name}.'/>
        ${mesh.userData.name === "The Sun" ? "" : "<button id='more-info-button'>More information</button>"} 
    `;

    // Make the button redirect the user to the planets information page when clicked
    if (mesh.userData.name !== "The Sun") {
        const infoButton = document.getElementById("more-info-button");

        infoButton.addEventListener("click", () => {
            window.location.href = `planet-page.html?planet=${mesh.userData.name.toLowerCase()}`;
        });
    }
};

// Function to handle when a mesh is double clicked. Passed as a callback function to the initRaycastInteraction function
const handleMeshSelect = (mesh) => {
    // Set the value of selectedMesh to the mesh argument. Could either be a mesh object or null
    selectedMesh = mesh;

    // Check if a mesh was selected
    if (mesh) {
        // Get the X,Y,Z coordinates of the selected mesh and store them in the selectedMeshPreviousPosition
        mesh.getWorldPosition(selectedMeshPreviousPosition);

        // Snap the orbit controls target to the selected mesh
        controls.target.copy(selectedMeshPreviousPosition);

        // Get the radius of the mesh and calculate an offset for the camera position (so it doesn't get sent to the centre of the mesh)
        const meshRadius = mesh.geometry.boundingSphere.radius;
        const cameraOffset = meshRadius * 2;

        // Move the camera to a position that is close to the selected mesh based off of its radius
        camera.position.set(
            selectedMeshPreviousPosition.x + cameraOffset,
            selectedMeshPreviousPosition.y + cameraOffset,
            selectedMeshPreviousPosition.z + cameraOffset,
        );
    }

    // Update the sidebar to reflect the currently selected mesh
    updateSidebarSelectedMesh(mesh);
};

// Add a click event listener to the advanced controls button that expands/collapses the sidebar
document
    .getElementById("sidebar-toggle")
    .addEventListener("click", sidebarToggle);

// Call the function to initialize the solar system view
initSolarSystemView();
