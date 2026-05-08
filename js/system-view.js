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

    // Create a generic shape to test Three.js is working
    const geometry = new THREE.BoxGeometry(5, 5, 5);
    const material = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        wireframe: true,
    });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Move the camera and cube so the cube is visible in the scene
    camera.position.set(0, 0, 10);
    cube.position.set(0, 0, 0);
    camera.lookAt(cube.position);

    // Animation loop to render the scene
    const animate = () => {
        requestAnimationFrame(animate);

        // Slowly rotate the cube for a simple animation effect
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;

        renderer.render(scene, camera);
    };

    animate();
};

// Call the function to initialize the solar system view
initSolarSystemView();
