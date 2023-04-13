import Plant from './plant';

async function initializePlant(scene, shadowGenerator, json) {
    // Initialize static instance variables
    Plant.scene = scene;
	Plant.shadowGenerator = shadowGenerator;

	// category dictionary
	const category = {0:"position", 1:"grade", 2:"school", 3:"major", 4:"double", 5:"mbti", 6:"emoji", 7:"lifestyle", 8:"stress", 9:"relationships", 10:"socialmedia", 11:"plastic", 12:"outlook", 13:"purpose"}
	// Initialize VariableData
	Plant.variableData = {}
	for (const [key, value] of Object.entries(category)) {
		Plant.variableData[value] = json.table.rows[0].c[key]
	}

	// Build plant models
	await Plant.buildModels();

    // Populate Plants
	for(let i = 1; i < json.table.rows.length; i++) {
		let obj = json.table.rows[i];
		// Create a flower
		let position, grade, school, major, double, mbti, emoji, lifestyle, stress, relationships, socialmedia, plastic, outlook, purpose;
		const plant = new Plant(position = obj.c[0].v, grade = obj.c[1].v, school = obj.c[2].v, major = obj.c[3].v, double = obj.c[4].v, mbti = obj.c[5].v, emoji = obj.c[6].v, lifestyle = obj.c[7].v, stress = obj.c[8].v, relationships = obj.c[9].v, socialmedia = obj.c[10].v, plastic = obj.c[11].v, outlook = obj.c[12].v, purpose = obj.c[13].v);
	}
	return [Plant.maxPlantDimensions, json.table.rows.length - 1, Plant.variableData];
}

function arrangePlant(maxMapSize, maxPlantDimensions, category, sortType) {
	return Plant.arrangeBy(maxMapSize, maxPlantDimensions, category, sortType)
}

function setGround(ground) {
	Plant.ground = ground;
}

export {initializePlant, arrangePlant, setGround};