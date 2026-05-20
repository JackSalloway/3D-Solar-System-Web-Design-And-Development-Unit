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
    const mercury = createMercury(scene);

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

// Function to create and add mercury to the scene - Will create a function that handles all planets, just testing this for now
const createMercury = (scene) => {
    const textureLoader = new THREE.TextureLoader();
    const mercuryTexture = textureLoader.load("../images/mercury_texture.jpg");

    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const material = new THREE.MeshStandardMaterial({
        map: mercuryTexture,
        roughness: 0.7,
    });
    const mercury = new THREE.Mesh(geometry, material);

    mercury.position.set(0, 0, 20);

    scene.add(mercury);
    return mercury;
};

// Call the function to initialize the solar system view
initSolarSystemView();
