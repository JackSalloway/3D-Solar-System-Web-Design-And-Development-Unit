import * as THREE from "three";
import { initCameraControls } from "./camera-controls.js";
import { initRaycastInteraction } from "./raycast-interaction.js";

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

// Function to initialize the solar system view - Currently just a basic implementation to test Three.js is working
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

    // Render the sun and add it to the clickableMeshes array
    const sun = createSun(scene);
    sun.name = "Sun"; // Set the name of the sun mesh to "Sun" for easier identification in raycast interaction
    clickableMeshes.push(sun);

    // Add the planets to the scene and store them in the planets array, which contains an object for each planets data values
    // Distance from the sun is calculated based on the actual distance of each planet from the sun, with earth's distance set to 100 units
    // Rotation speeds are based on the actual rotation periods of the planets, with earth's rotation set to 0.005 as a 24 hour rotation period
    // Orbit speeds are based on the actual orbital periods of the planets, with earth's orbit speed set to 0.002 as a 365 day orbital period
    const mercury = createPlanet(
        scene,
        "Mercury",
        "../images/mercury_texture.jpg",
        (2439.7 / 6371) * basePlanetRadius, // Diameter of ~4879 km (~0.77 units)
        (57.9 / 149.6) * baseDistanceFromSun, // Distance from the sun ~57.9 million km (~38.7 units)
        (24 / 648) * baseRotationSpeed, // Rotation perioud of ~58 days
        (365.25 / 88) * baseOrbitalSpeed, // Orbital period of ~88 days
    );
    planets.push(mercury);

    const venus = createPlanet(
        scene,
        "Venus",
        "../images/venus_texture.jpg",
        (6051.8 / 6371) * basePlanetRadius, // Diameter of ~12104 km (~1.9 units)
        (108.2 / 149.6) * baseDistanceFromSun, // Distance from the sun ~108.2 million km (~72.3 units)
        (24 / 5832) * baseRotationSpeed * -1, // Retrograde rotation period of ~243 days
        (365.25 / 225) * baseOrbitalSpeed, // Orbital period of ~225 days
    );
    planets.push(venus);

    const earth = createPlanet(
        scene,
        "Earth",
        "../images/earth_texture.jpg",
        basePlanetRadius, // Diameter of ~12756 km (~2 units)
        (149.6 / 149.6) * baseDistanceFromSun, // Distance from the sun ~149.6 million km (100 units)
        (24 / 24) * baseRotationSpeed, // Rotation period of ~24 hours
        (365.25 / 365.25) * baseOrbitalSpeed, // Orbital period of ~365.25 days
    );
    planets.push(earth);

    const mars = createPlanet(
        scene,
        "Mars",
        "../images/mars_texture.jpg",
        (3389.5 / 6371) * basePlanetRadius, // Diameter of ~3389.5 km (~1.06 units)
        (227.9 / 149.6) * baseDistanceFromSun, // Distance from the sun ~227.9 million km (~152.3 units)
        (24 / 24.6) * baseRotationSpeed, // Rotation period of ~24.6 hours
        (365.25 / 687) * baseOrbitalSpeed, // Orbital period of ~687 days
    );
    planets.push(mars);

    const jupiter = createPlanet(
        scene,
        "Jupiter",
        "../images/jupiter_texture.jpg",
        (69911 / 6371) * basePlanetRadius, // Diameter of ~69911 km (~21.95 units)
        (778.5 / 149.6) * baseDistanceFromSun, // Distance from the sun ~778.5 million km (~520.3 units)
        (24 / 9.9) * baseRotationSpeed, // Rotation period of ~9.9 hours
        (365.25 / 4333) * baseOrbitalSpeed, // Orbital period of ~4333 days (11.86 years)
    );
    planets.push(jupiter);

    const saturn = createPlanet(
        scene,
        "Saturn",
        "../images/saturn_texture.jpg",
        (58232 / 6371) * basePlanetRadius, // Diameter of ~58232 km (~18.28 units)
        (1432 / 149.6) * baseDistanceFromSun, // Distance from the sun ~1432 million km (~957.3 units)
        (24 / 10.7) * baseRotationSpeed, // Rotation period of ~10.7 hours
        (365.25 / 10759) * baseOrbitalSpeed, // Orbital period of ~10759 days (29.46 years)
    );
    planets.push(saturn);

    const uranus = createPlanet(
        scene,
        "Uranus",
        "../images/uranus_texture.jpg",
        (25362 / 6371) * basePlanetRadius, // Diameter of ~25362 km (~7.96 units)
        (2871 / 149.6) * baseDistanceFromSun, // Distance from the sun ~2871 million km (~1919.6 units)
        (24 / 17) * baseRotationSpeed * -1, // Retrograde rotation period of ~17 hours
        (365.25 / 30688) * baseOrbitalSpeed, // Orbital period of ~30688 days (84.01 years)
    );
    planets.push(uranus);

    const neptune = createPlanet(
        scene,
        "Neptune",
        "../images/neptune_texture.jpg",
        (24622 / 6371) * basePlanetRadius, // Diameter of ~24622 km (~7.73 units)
        (4495 / 149.6) * baseDistanceFromSun, // Distance from the sun ~4495 million km (~3005.3 units)
        (24 / 16) * baseRotationSpeed, // Rotation period of ~16 hours
        (365.25 / 60182) * baseOrbitalSpeed, // Orbital period of ~60182 days (164.82 years)
    );
    planets.push(neptune);

    // Push each of the planet meshes into the clickableMeshes array
    planets.forEach((planet) => {
        planet.mesh.name = planet.name; // Set the name of the mesh to the planet name for easier identification in raycast interaction
        clickableMeshes.push(planet.mesh);
    });

    // Initialize raycast interaction for mouse clicks on the sun and planets, allowing for enhanced camera controls relating to the clicked mesh.
    initRaycastInteraction(camera, renderer, clickableMeshes, handleMeshSelect);

    // Render orbit lines to show the paths of the planets and store them in variables
    const mercuryOrbit = createOrbitLine(scene, mercury.distanceFromSun); // Mercury's orbit
    const venusOrbit = createOrbitLine(scene, venus.distanceFromSun); // Venus's orbit
    const earthOrbit = createOrbitLine(scene, earth.distanceFromSun); // Earth's orbit
    const marsOrbit = createOrbitLine(scene, mars.distanceFromSun); // Mars's orbit
    const jupiterOrbit = createOrbitLine(scene, jupiter.distanceFromSun); // Jupiter's orbit
    const saturnOrbit = createOrbitLine(scene, saturn.distanceFromSun); // Saturn's orbit
    const uranusOrbit = createOrbitLine(scene, uranus.distanceFromSun); // Uranus's orbit
    const neptuneOrbit = createOrbitLine(scene, neptune.distanceFromSun); // Neptune's orbit

    // Animation loop to render the scene
    const animate = () => {
        requestAnimationFrame(animate);

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
};

// Call the function to initialize the solar system view
initSolarSystemView();
