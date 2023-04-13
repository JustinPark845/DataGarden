import { initializeBabylon, createEnvironment } from './components/environment/config';
import { fetchData } from './components/data/spreadsheet';
import { initializePlant, arrangePlant, setGround } from './components/entities/plant/plantHelper';
import { createWind } from './components/entities/wind/wind';
import { createMenu } from './components/menu/menu';
import { createVRMenu } from './components/menu/vrMenu';

var createScene = async function(canvas) {
	// Fetch Spreadsheet Data
	const json = await fetchData();

	// Initialize Scene
	let [scene, engine, camera, lights, shadowGenerator] = initializeBabylon(canvas);

	// Process Plant Data
	let [maxPlantDimensions, numEntries, variableData] = await initializePlant(scene, shadowGenerator, json);

	// Create Environment
	let [env, ground, xr, maxMapSize] = await createEnvironment(scene, lights, camera, maxPlantDimensions, numEntries, variableData);
	setGround(ground);
	ground.width = 100;

	// console.log("here")
	// Arrange
	// arrangePlant(Math.max(maxPlantDimensions.x, maxPlantDimensions.z)*numEntries, maxPlantDimensions, "school", 1);



	// Populate Entities
	// Populate Plant
	// Populate Wind
	createWind(scene, engine);
	// create Menu
	// createMenu(camera, xr, maxPlantDimensions, numEntries);
	createVRMenu(camera, xr, maxMapSize, maxPlantDimensions, scene);









	

}

export { createScene };