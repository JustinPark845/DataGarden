var xrSupport = async function(scene, env, ground) {
	// Initialize XR experience with default experience helper.
	const xrHelper = await scene.createDefaultXRExperienceAsync({  
		requiredFeatures: ["local-floor"],
      	optionalFeatures: ["bounded-floor"],
		floorMeshes: [ground],
		disableTeleportation: true,
		//teleportationEnabled:true,
		inputOptions : {
			forceInputProfile: 'oculus-touch-v2',
			//disableControllerAnimation: true,
			//doNotLoadControllerMeshes : true,
			//maxPointerDistance: 1,
		}                
	}); 
	return xrHelper;
};

export { xrSupport };