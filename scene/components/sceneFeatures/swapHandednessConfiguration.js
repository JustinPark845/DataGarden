export const swappedHandednessConfiguration = [
    {
        allowedComponentTypes: [BABYLON.WebXRControllerComponent.THUMBSTICK_TYPE, BABYLON.WebXRControllerComponent.TOUCHPAD_TYPE],
        forceHandedness: "right",
        axisChangedHandler: (axes, movementState, featureContext, xrInput) => {
        movementState.rotateX = Math.abs(axes.x) > featureContext.rotationThreshold ? axes.x : 0;
        movementState.rotateY = Math.abs(axes.y) > featureContext.rotationThreshold ? axes.y : 0;
        },
    },
    {
        allowedComponentTypes: [BABYLON.WebXRControllerComponent.THUMBSTICK_TYPE, BABYLON.WebXRControllerComponent.TOUCHPAD_TYPE],
        forceHandedness: "left",
        axisChangedHandler: (axes, movementState, featureContext, xrInput) => {
        movementState.moveX = Math.abs(axes.x) > featureContext.movementThreshold ? axes.x : 0;
        movementState.moveY = Math.abs(axes.y) > featureContext.movementThreshold ? axes.y : 0;
        },
    },
];