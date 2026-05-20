import * as THREE from "three";

// Function to initialize the solar system view - Currently just a basic implementation to test Three.js is working
const initSolarSystemView = () => {
    const container = document.getElementById("site-main");

    // Create the scene
    const scene = new THREE.Scene();

    // Create the camera
    const camera = new THREE.PerspectiveCamera(
        75,
        container.clientWidth / container.clientHeight,
        0.1,
        1000,
    );

    // Create the renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Camera beginning position and orientation is set to be above the sun, looking down at it
    camera.position.set(0, 75, 0);
    camera.lookAt(0, 0, 0);

    // Render celestial bodies and store them in variables
    const sun = createSun(scene);
    const mercury = createPlanet(scene, "../images/mercury_texture.jpg", 1, 20);
    const venus = createPlanet(scene, "../images/venus_texture.jpg", 1.5, 30);
    const earth = createPlanet(scene, "../images/earth_texture.jpg", 2, 40);
    const mars = createPlanet(scene, "../images/mars_texture.jpg", 1.2, 50);
    const jupiter = createPlanet(scene, "../images/jupiter_texture.jpg", 4, 70);
    const saturn = createPlanet(scene, "../images/saturn_texture.jpg", 3.5, 90);
    const uranus = createPlanet(scene, "../images/uranus_texture.jpg", 3, 110);
    const neptune = createPlanet(
        scene,
        "../images/neptune_texture.jpg",
        2.5,
        130,
    );

    // Render orbit lines to show the paths of the planets and store them in variables
    const mercuryOrbit = createOrbitLine(scene, 20); // Mercury's orbit
    const venusOrbit = createOrbitLine(scene, 30); // Venus's orbit
    const earthOrbit = createOrbitLine(scene, 40); // Earth's orbit
    const marsOrbit = createOrbitLine(scene, 50); // Mars's orbit
    const jupiterOrbit = createOrbitLine(scene, 70); // Jupiter's orbit
    const saturnOrbit = createOrbitLine(scene, 90); // Saturn's orbit
    const uranusOrbit = createOrbitLine(scene, 110); // Uranus's orbit
    const neptuneOrbit = createOrbitLine(scene, 130); // Neptune's orbit

    // Animation loop to render the scene
    const animate = () => {
        requestAnimationFrame(animate);

        // Rotations
        sun.rotation.y += 0.001;
        mercury.rotation.y += 0.02;

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
    const sunGeometry = new THREE.SphereGeometry(5, 64, 64);
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    sun.position.set(0, 0, 0);
    scene.add(sun);

    // Add a point light at the sun's position to illuminate the scene
    const sunLight = new THREE.PointLight(0xffffff, 2000, 500, 1.7);
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
const createPlanet = (scene, texturePath, radius, distanceFromSun) => {
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

    scene.add(planet);
    return planet;
};

// Call the function to initialize the solar system view
initSolarSystemView();
