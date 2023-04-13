import { maximumHeight } from "../sceneFeatures/maximumHeight";
import { setGravity } from "../sceneFeatures/setGravity";
import { createMapBoundary } from "./boundary";
import { xrSupport } from '../sceneFeatures/xrSupport';
import { swappedHandednessConfiguration } from "../sceneFeatures/swapHandednessConfiguration";
import { initializePlant, arrangePlant, setGround } from '../entities/plant/plantHelper';

function initializeBabylon(canvas, maxPlantDimensions) {
	// Associate a Babylon Engine to it.
	const engine = new BABYLON.Engine(canvas);

	// Create our first scene.
	const scene = new BABYLON.Scene(engine);
	scene.maxSimultaneousLights = 1;

	// Create a camera
	var camera = new BABYLON.UniversalCamera("camera1", new BABYLON.Vector3(1, maximumHeight + 2.5, 0), scene);
    camera.attachControl(canvas, true);
	camera.orthoLeft = 1;
	camera.orthoRight = 1;
	camera.orthoTop = 1;
	camera.orthoBottom = 1; 
	camera.speed = 1;
	camera.minZ = 0.01;

	// Create lighting and lighting-related settings
	let lights = {
		"directional": new BABYLON.DirectionalLight("directionalLight", new BABYLON.Vector3(-100, -200, -100), scene),
		"hemispheric": new BABYLON.HemisphericLight("hemisphericLight", new BABYLON.Vector3(1, 1, 1), scene),
	}
	lights["directional"].intensity = 0.15;
	lights["directional"].specular = new BABYLON.Color3.Black();
	lights["hemispheric"].intensity = 0.25;
	lights["hemispheric"].specular = new BABYLON.Color3.Black();

	// Generate Shadows
	var shadowGenerator = new BABYLON.ShadowGenerator(1024*4, lights["directional"]);

	return [scene, engine, camera, lights, shadowGenerator];
}

async function createEnvironment(scene, lights, camera, maxPlantDimensions, numEntries, variableData) {
	let maxVariableData = 1;
	for (const [key, value] of Object.entries(variableData)){maxVariableData=Math.max(maxVariableData,value.v)}
    let row = Math.floor(Math.sqrt(maxVariableData));
    let col = (maxVariableData%row > 0) ? row + 1 : row;
    while (row*col < maxVariableData) {col++;}
	// maxMapSize is calculated with...
	// (largest plant dimension side * 2 for offset)
	// (sqrt of max number of entries because entries are sorted in a square)
	// (maximum number of side divisions decided by category)
	// (100 for margin of 50 on each side)
	let maxMapSize = (Math.max(maxPlantDimensions.x, maxPlantDimensions.z)*2*Math.sqrt(numEntries)*col) + 100;
	// console.log(maxMapSize);
	// Import Grass Texture
	var grassMaterial = new BABYLON.StandardMaterial("grassMat", scene);
	var grassTexture = new BABYLON.GrassProceduralTexture("grassTex", 2000, scene);
	grassMaterial.ambientTexture = grassTexture;
	// Create uneven ground from height map
	const ground = BABYLON.MeshBuilder.CreateGroundFromHeightMap("ground", "../assets/textures/heightMap.png", {
		width: maxMapSize, height: maxMapSize, subdivisions: 50, maxHeight: maximumHeight, minHeight: 0,
		onReady: (m) => {
			m.convertToFlatShadedMesh();
			// Change Arrangement (to be changed)
			arrangePlant(maxMapSize, maxPlantDimensions, null, 0);
		}
	});	
	ground.position.y = 0;
	// ground.material = grassMaterial;
	ground.material = new BABYLON.StandardMaterial("groundMat");
	ground.material.diffuseColor = new BABYLON.Color3(0, 1.5, 0.05);
	ground.enablePointerMoveEvents = true;
	ground.receiveShadows = true;
	// Create top ground
	const topGround = BABYLON.MeshBuilder.CreateGround("ground", {width: maxMapSize, height: maxMapSize}, scene);
	topGround.position.y = maxMapSize/4;
	topGround.isVisible = false;

	// Create Map Boundary
	createMapBoundary(maxMapSize, scene);

	// Sky material
	var skyboxMaterial = new BABYLON.SkyMaterial("skyMaterial", scene);
	skyboxMaterial.backFaceCulling = false;


	// Sky mesh (box)
	var skybox = BABYLON.Mesh.CreateBox("skyBox", 1000, scene);
	skybox.material = skyboxMaterial;
	skybox.position = scene.activeCamera.position;
	var setSkyConfig = function (property, from, to) {
		var keys = [
            { frame: 0, value: from },
			{ frame: 100, value: to }
        ];
		
		var animation = new BABYLON.Animation("animation", property, 100, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
		animation.setKeys(keys);
		
		scene.stopAnimation(skybox);
		scene.beginDirectAnimation(skybox, [animation], 0, 100, false, 1);
	};
	setSkyConfig("material.inclination", skyboxMaterial.inclination, 0);
	// Skyfloor
	const skyfloor = BABYLON.MeshBuilder.CreateGround("skyfloor", {width:maxMapSize, height:maxMapSize}, scene); 
	skyfloor.position.y = -1000;

	// Create Environment
    const env = scene.createDefaultEnvironment();

	// here we add XR support
	var xr = await xrSupport(scene, env, ground);

	// Set Starting Position
	xr.baseExperience.sessionManager.onXRFrameObservable.addOnce(() => {
		xr.baseExperience.camera.position = new BABYLON.Vector3(0, maximumHeight + 2.5, 0.001);
	})

	// Enable Movement
	const featureManager = xr.baseExperience.featuresManager;
    const movementFeature = featureManager.enableFeature(BABYLON.WebXRFeatureName.MOVEMENT, 'latest', {
        xrInput: xr.input,
		movementSpeed: 0.1,
		rotationSpeed: 0.2,
		customRegistrationConfigurations: swappedHandednessConfiguration,
        movementOrientationFollowsViewerPose: true, // default true
    });

	// Enable Gravity
	setGravity(camera, xr, true);

	const assumedFramesPerSecond = 15;
	const earthGravity = -9.81;
	scene.gravity = new BABYLON.Vector3(0, earthGravity / assumedFramesPerSecond, 0);

	// Enable Collisions
	scene.collisionsEnabled = true;

	camera.checkCollisions = true;
	xr.baseExperience.camera.checkCollisions = true;

	// Remove Sliding
	camera.ellipsoid = new BABYLON.Vector3(0.01, 1, 0.01);
	xr.baseExperience.camera.ellipsoid = new BABYLON.Vector3(0.01, 1, 0.01);

	// Allow Collision with ground
	ground.checkCollisions = true;
	topGround.checkCollisions = true;

	// Navigation
	var navigationTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
	var text = new BABYLON.GUI.TextBlock();
	let location = "";
	scene.registerBeforeRender(function () {
		if ((camera.position.x < -5 && camera.position.z < 0) || (xr.baseExperience.camera.position.x < 0 && xr.baseExperience.camera.position.z < -5))  {
			location = "MCAS";
		} else if ((camera.position.x < -5 && camera.position.z > 0) || (xr.baseExperience.camera.position.x < 0 && xr.baseExperience.camera.position.z > 5)) {
			location = "CSOM";
		} else if ((camera.position.x > 5 && camera.position.z < 0) || (xr.baseExperience.camera.position.x > 0 && xr.baseExperience.camera.position.z < -5)) {
			location = "LSOE";
		} else if ((camera.position.x > 5 && camera.position.z > 0) || (xr.baseExperience.camera.position.x > 0 && xr.baseExperience.camera.position.z > 5)) {
			location = "CSON"
		} else {
			location = "";
		}
		// text.text = "You are currently in: " + location;
	  });
	text.color = "black";
    text.fontSize = 24;
	text.paddingBottom = "350px";
    navigationTexture.addControl(text);

	// // viewmode location markers
	// const planeMcas = BABYLON.MeshBuilder.CreatePlane("plane", {height:3, width: 10});
	// planeMcas.position.y = 50;
	// planeMcas.position.x = -30;
	// planeMcas.position.z = -30;
	// const planeCsom = BABYLON.MeshBuilder.CreatePlane("plane", {height:3, width: 10});
	// planeCsom.position.y = 50;
	// planeCsom.position.x = -30;
	// planeCsom.position.z = 30;
	// const planeLsoe = BABYLON.MeshBuilder.CreatePlane("plane", {height:3, width: 10});
	// planeLsoe.position.y = 50;
	// planeLsoe.position.x = 30;
	// planeLsoe.position.z = -30;
	// const planeCson = BABYLON.MeshBuilder.CreatePlane("plane", {height:3, width: 10});
	// planeCson.position.y = 50;
	// planeCson.position.x = 30;
	// planeCson.position.z = 30;
	// planeMcas.billboardMode = 7;
	// planeCsom.billboardMode = 7;
	// planeLsoe.billboardMode = 7;
	// planeCson.billboardMode = 7;

	// // billboardlights
	// let billboardlights = {
	// 	"billboardlight1": new BABYLON.HemisphericLight("hemisphericLight", new BABYLON.Vector3(100, 50, 100), scene),
	// 	"billboardlight2": new BABYLON.HemisphericLight("hemisphericLight", new BABYLON.Vector3(-100, 50, -100), scene),
	// 	"billboardlight3": new BABYLON.HemisphericLight("hemisphericLight", new BABYLON.Vector3(-100, 50, 100), scene),
	// 	"billboardlight4": new BABYLON.HemisphericLight("hemisphericLight", new BABYLON.Vector3(100, 50, -100), scene)
	// };
	// billboardlights["billboardlight1"].intensity = 1;
	// billboardlights["billboardlight2"].intensity = 1;
	// billboardlights["billboardlight3"].intensity = 1;
	// billboardlights["billboardlight4"].intensity = 1;

	// // exclude ground for lighting
	// billboardlights["billboardlight1"].excludedMeshes.push(ground);
	// billboardlights["billboardlight2"].excludedMeshes.push(ground);
	// billboardlights["billboardlight3"].excludedMeshes.push(ground);
	// billboardlights["billboardlight4"].excludedMeshes.push(ground);

	// // font
	// var font = "bold 80px monospace";
    // //Create dynamic texture text
	// var textureMcas = new BABYLON.DynamicTexture("dynamic texture", {width:256, height:128}, scene);   
	// var materialMcas = new BABYLON.StandardMaterial("Mcas", scene);    				
	// materialMcas.diffuseTexture = textureMcas;
	// planeMcas.material = materialMcas;
    // textureMcas.drawText("MCAS", 35, 90, font, "black", "white", true, true);
	// var textureCsom = new BABYLON.DynamicTexture("dynamic texture", {width:256, height:128}, scene);   
	// var materialCsom = new BABYLON.StandardMaterial("Csom", scene);    				
	// materialCsom.diffuseTexture = textureCsom;
	// planeCsom.material = materialCsom;
    // textureCsom.drawText("CSOM", 35, 90, font, "black", "white", true, true);
	// var textureLsoe = new BABYLON.DynamicTexture("dynamic texture", {width:256, height:128}, scene);   
	// var materialLsoe = new BABYLON.StandardMaterial("Lsoe", scene);    				
	// materialLsoe.diffuseTexture = textureLsoe;
	// planeLsoe.material = materialLsoe;
    // textureLsoe.drawText("LSOE", 35, 90, font, "black", "white", true, true);
	// var textureCson = new BABYLON.DynamicTexture("dynamic texture", {width:256, height:128}, scene);   
	// var materialCson = new BABYLON.StandardMaterial("Cson", scene);    				
	// materialCson.diffuseTexture = textureCson;
	// planeCson.material = materialCson;
    // textureCson.drawText("CSON", 35, 90, font, "black", "white", true, true);


	// ground.isVisible = false;

	return [env, ground, xr, maxMapSize];
}

export {initializeBabylon, createEnvironment};