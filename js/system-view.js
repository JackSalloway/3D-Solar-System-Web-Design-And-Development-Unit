import * as THREE from "three";

const planets = []; // Array of objects to store all planets and their corresponding orbit anchors for easy access in the animation loop
const baseRotationSpeed = 0.005; // Base speed for Earth's rotation, used to calculate the speeds of the other planets based on their rotation  periods
const baseOrbitalSpeed = 0.002; // Base speed for Earth's orbit, used to calculate the speeds of the other planets based on their orbital periods

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

    // Rotation speeds are based on the actual rotation periods of the planets, with earth's rotation set to 0.005 as a 24 hour rotation period
    // Orbit speeds are based on the actual orbital periods of the planets, with earth's orbit speed set to 0.002 as a 365 day orbital period
    const mercury = createPlanet(
        scene,
        "../images/mercury_texture.jpg",
        1,
        20,
        (24 / 648) * baseRotationSpeed, // Rotation perioud of ~58 days
        (365.25 / 88) * baseOrbitalSpeed, // Orbital period of ~88 days
    );
    planets.push(mercury);

    const venus = createPlanet(
        scene,
        "../images/venus_texture.jpg",
        1.5,
        30,
        (24 / 5832) * baseRotationSpeed * -1, // Retrograde rotation period of ~243 days
        (365.25 / 225) * baseOrbitalSpeed, // Orbital period of ~225 days
    );
    planets.push(venus);

    const earth = createPlanet(
        scene,
        "../images/earth_texture.jpg",
        2,
        40,
        (24 / 24) * baseRotationSpeed, // Rotation period of ~24 hours
        (365.25 / 365.25) * baseOrbitalSpeed, // Orbital period of ~365.25 days
    );
    planets.push(earth);

    const mars = createPlanet(
        scene,
        "../images/mars_texture.jpg",
        1.2,
        50,
        (24 / 24.6) * baseRotationSpeed, // Rotation period of ~24.6 hours
        (365.25 / 687) * baseOrbitalSpeed, // Orbital period of ~687 days
    );
    planets.push(mars);

    const jupiter = createPlanet(
        scene,
        "../images/jupiter_texture.jpg",
        4,
        70,
        (24 / 9.9) * baseRotationSpeed, // Rotation period of ~9.9 hours
        (365.25 / 4333) * baseOrbitalSpeed, // Orbital period of ~4333 days (11.86 years)
    );
    planets.push(jupiter);

    const saturn = createPlanet(
        scene,
        "../images/saturn_texture.jpg",
        3.5,
        90,
        (24 / 10.7) * baseRotationSpeed, // Rotation period of ~10.7 hours
        (365.25 / 10759) * baseOrbitalSpeed, // Orbital period of ~10759 days (29.46 years)
    );
    planets.push(saturn);

    const uranus = createPlanet(
        scene,
        "../images/uranus_texture.jpg",
        3,
        110,
        (24 / 17) * baseRotationSpeed * -1, // Retrograde rotation period of ~17 hours
        (365.25 / 30688) * baseOrbitalSpeed, // Orbital period of ~30688 days (84.01 years)
    );
    planets.push(uranus);

    const neptune = createPlanet(
        scene,
        "../images/neptune_texture.jpg",
        2.5,
        130,
        (24 / 16) * baseRotationSpeed, // Rotation period of ~16 hours
        (365.25 / 60182) * baseOrbitalSpeed, // Orbital period of ~60182 days (164.82 years)
    );
    planets.push(neptune);

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
const createPlanet = (
    scene,
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
    };
};

// Call the function to initialize the solar system view
initSolarSystemView();
