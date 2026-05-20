import * as THREE from "three";

// Export the function so it can be imported and used in system-view.js
export const initRaycastInteraction = (camera, renderer, clickableMeshes) => {
    const raycaster = new THREE.Raycaster(); // Create a new raycaster object to handle raycasting for mouse interactions
    const mouse = new THREE.Vector2(); // Create a 2D vector to store the normalized mouse coordinates

    // Add an event listener for mouse clicks on the renderer's DOM element
    window.addEventListener("click", (event) => {
        // Get the canvas boundaries
        const rect = renderer.domElement.getBoundingClientRect();

        // Calculate normalised mouse coordinates (range of -1 to 1) based on the mouse position relative to the canvas
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        // Update the raycaster with the camera and mouse position
        raycaster.setFromCamera(mouse, camera);

        // Check for intersections between the ray and any clickable meshes
        const intersects = raycaster.intersectObjects(clickableMeshes);

        // Check if a mesh was clicked
        if (intersects.length > 0) {
            console.log(
                `Mesh clicked: ${intersects[0].object.name}`,
                intersects[0].object,
            );
        } else {
            console.log("No mesh clicked");
        }
    });
};
