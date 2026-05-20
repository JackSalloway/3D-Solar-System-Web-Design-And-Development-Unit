import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// Function to initialize the camera controls for the solar system view, exported to be used in system-view.js
export const initCameraControls = (camera, renderer) => {
    const controls = new OrbitControls(camera, renderer.domElement);

    // Set controls
    controls.enableRotate = true; // Allow rotation which is handled by clicking the left mouse button and dragging the mouse by default
    controls.enablePan = true; // Allow panning which is handled by clicking the right mouse button and dragging the mouse by default
    controls.enableZoom = true; // Allow zooming which is handled by the mouse wheel by default

    // Set limits for zooming to prevent the user from zooming too far in or out
    controls.minDistance = 15; // Minimum distance from the center of the solar system
    controls.maxDistance = 5000; // Maximum distance from the center of the solar system

    // Add damping to the controls for smoother movement, which also requires calling controls.update() in the animation loop
    controls.enableDamping = true;
    controls.dampingFactor = 0.05; // Higher the number, the more damping (slower, but smoother movement)

    return controls;
};
