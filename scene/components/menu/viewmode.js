import { maximumHeight } from "../sceneFeatures/maximumHeight";
import { swappedHandednessConfiguration } from "../sceneFeatures/swapHandednessConfiguration";

export function createViewMode(camera, xr, option, isDefault, maxMapSize, scene) {
    // TopView
    var endPositionTop = new BABYLON.Vector3(1.0000038016087502, maxMapSize/4 + 5, 0.000999394200753492);
    var endRotationTop = new BABYLON.Vector3(1.570796, -1.570966904238245, 0);
    // SideView
    var endPositionSide = new BABYLON.Vector3(104.76387393221098, 23.430375376453668, -2.014918226254785);
    var endRotationSide = new BABYLON.Vector3(0.125504169908319184, -1.5779310920865637, 0);
    // Default
    var endPositionDefault = new BABYLON.Vector3(0, maximumHeight + 1, 0.001);
    var endRotationDefault = new BABYLON.Vector3(0, -1.5717963264615635, 0);
    // Move Camera
    function setCamera(position, rotation, movementSpeed) {
        const featureManager = xr.baseExperience.featuresManager;
        const movementFeature = featureManager.enableFeature(BABYLON.WebXRFeatureName.MOVEMENT, 'latest', {
            xrInput: xr.input,
            movementSpeed: movementSpeed,
            rotationSpeed: 0.2,
            customRegistrationConfigurations: swappedHandednessConfiguration,
            movementOrientationFollowsViewerPose: true, // default true
        });
        camera.speed = movementSpeed * 2.5;
        // if (movementSpeed) {
        //     // Disable movement
        //     const movementFeature = featureManager.enableFeature(BABYLON.WebXRFeatureName.MOVEMENT, 'latest', {
        //         xrInput: xr.input,
        //         movementSpeed: 0.0,
        //         rotationSpeed: 0.2,
        //         customRegistrationConfigurations: swappedHandednessConfiguration,
        //         movementOrientationFollowsViewerPose: true, // default true
        //     });
        //     camera.inputs.attached.keyboard.detachControl();
        // } else {
        //     // Enable movement
        //     const movementFeature = featureManager.enableFeature(BABYLON.WebXRFeatureName.MOVEMENT, 'latest', {
        //         xrInput: xr.input,
        //         movementSpeed: 0.1,
        //         rotationSpeed: 0.2,
        //         customRegistrationConfigurations: swappedHandednessConfiguration,
        //         movementOrientationFollowsViewerPose: true, // default true
        //     });
        //     camera.inputs.attachInput(camera.inputs.attached.keyboard);
        // }
        // web
        BABYLON.Animation.CreateAndStartAnimation("transition", camera, "position", 45, 30, camera.position, position,  BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
        BABYLON.Animation.CreateAndStartAnimation("transition", camera, "rotation", 45, 30, camera.rotation, rotation, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
        // xr
        xr.baseExperience.camera.position = position;
        xr.baseExperience.camera.rotation = rotation;
    }
    if (option == "top") {
        setCamera(endPositionTop, endRotationTop, 5);
        scene.gravity = new BABYLON.Vector3(0, -10, 0);
    } else if (option == "side") {
        setCamera(endPositionSide, endRotationSide, 5);
        scene.gravity = new BABYLON.Vector3(0, -10, 0);
    } else if (option == "default"){
        setCamera(endPositionDefault, endRotationDefault, 0.1);
        scene.gravity = new BABYLON.Vector3(0, -9.81/15, 0);
    } else {
        if (!isDefault) {
            setCamera(endPositionDefault, endRotationDefault, false);
        }
    }
}