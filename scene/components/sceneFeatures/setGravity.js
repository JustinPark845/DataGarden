export function setGravity(camera, xr, toggle) {
    camera.applyGravity = toggle;
    camera._needMoveForGravity = toggle;
    xr.baseExperience.camera.applyGravity = toggle;
    xr.baseExperience.camera._needMoveForGravity = toggle;
}