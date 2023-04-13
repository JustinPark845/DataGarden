import { CreateToolTip } from './plantFunctions/toolTip';
import { randVal, getRandomArbitrary } from '../../sceneFeatures/randVal';
import { getHeightAtOctreeGroundCoordinates } from '../../sceneFeatures/getHeightAtOctreeGroundCoordinates';
import { partitionSpace } from '../../environment/spacePartition';
import { maximumHeight } from '../../sceneFeatures/maximumHeight';

// Class Component
export default class Plant {
	// Instance variables
	static plantCount = 0;
	static plantDictionary = new Object();
	static clouds = [];
	static scene;
	static shadowGenerator;
	static ground;
	static meshes = {};
	static maxPlantDimensions = {x:0, z:0, y:0};
	static variableData;
	#position;
	#grade;
	#school;
	#major;
	#double;
	#mbti;
	#emoji;
	#lifestyle;
	#stress;
	#relationships;
	#socialmedia;
	#plastic;
	#outlook;
	#purpose;
	#tooltip;
	#x;
	#z;
	#y = maximumHeight/1.5;

	// Constructor
	constructor(position = "", grade = "", school = "", major = "", double = "", mbti = "", emoji = "", lifestyle = "", stress = 0, relationships = 0, socialmedia = 0, plastic = 0, outlook = "", purpose = 0) { 
		this.#position = position.toLowerCase();
		this.#grade = grade.toLowerCase();
		this.#school = school.toLowerCase();
		this.#major = major.toLowerCase();
		this.#double = double.toLowerCase();
		this.#mbti = mbti.toLowerCase();
		this.#emoji = emoji;
		this.#lifestyle = lifestyle.toLowerCase();
		this.#stress = stress;
		this.#relationships = relationships;
		this.#socialmedia = socialmedia;
		this.#plastic = plastic;
		this.#outlook = outlook.toLowerCase();
		this.#purpose = purpose;
		this.initializePlant();
	}

	// Static mesh builders
	static async buildModels() {
		// Imports Meshes
		// Petal 1-4
		// Blue Petal
		let bluePetalModelData = await BABYLON.SceneLoader.ImportMeshAsync("", "./assets/petal/", "flower_blue.glb", Plant.scene);
		let bluePetalMesh = bluePetalModelData.meshes[1]; // index 1 is the petal mesh, index 0 has the root node
		bluePetalMesh.isVisible = false;
		bluePetalMesh.scaling.scaleInPlace(4);
		bluePetalMesh.position.y += 1.55;
		Plant.meshes["bluePetal"] = bluePetalMesh;
		// Green Petal
		let greenPetalModelData = await BABYLON.SceneLoader.ImportMeshAsync("", "./assets/petal/", "flower_green.glb", Plant.scene);
		let greenPetalMesh = greenPetalModelData.meshes[1]; // index 1 is the petal mesh, index 0 has the root node
		greenPetalMesh.isVisible = false;
		greenPetalMesh.scaling.scaleInPlace(4);
		greenPetalMesh.position.y += 1.55;
		Plant.meshes["greenPetal"] = greenPetalMesh;
		// Purple Petal
		let purplePetalModelData = await BABYLON.SceneLoader.ImportMeshAsync("", "./assets/petal/", "flower_purple.glb", Plant.scene);
		let purplePetalMesh = purplePetalModelData.meshes[1]; // index 1 is the petal mesh, index 0 has the root node
		purplePetalMesh.isVisible = false;
		purplePetalMesh.scaling.scaleInPlace(4);
		purplePetalMesh.position.y += 1.55;
		Plant.meshes["purplePetal"] = purplePetalMesh;
		// Yellow Petal
		let yellowPetalModelData = await BABYLON.SceneLoader.ImportMeshAsync("", "./assets/petal/", "flower_yellow.glb", Plant.scene);
		var yellowPetalMesh = yellowPetalModelData.meshes[1]; // index 1 is the petal mesh, index 0 has the root node
		yellowPetalMesh.isVisible = false;
		yellowPetalMesh.scaling.scaleInPlace(4);
		yellowPetalMesh.position.y += 1.55;
		Plant.meshes["yellowPetal"] = yellowPetalMesh;
		// Tree
		// Blue Top Petals
		let blueTreePetalModelData = await BABYLON.SceneLoader.ImportMeshAsync("", "./assets/petal/", "treetopleaves_blue.glb", Plant.scene);
		let blueTreePetalMesh = blueTreePetalModelData.meshes[1]; // index 1 is the petal mesh, index 0 has the root node
		blueTreePetalMesh.isVisible = false;
		blueTreePetalMesh.scaling.scaleInPlace(2);
		blueTreePetalMesh.position.y += 2.05;
		Plant.meshes["blueTreePetal"] = blueTreePetalMesh;
		// Green Top Petals
		let greenTreePetalModelData = await BABYLON.SceneLoader.ImportMeshAsync("", "./assets/petal/", "treetopleaves_green.glb", Plant.scene);
		let greenTreePetalMesh = greenTreePetalModelData.meshes[1]; // index 1 is the petal mesh, index 0 has the root node
		greenTreePetalMesh.isVisible = false;
		greenTreePetalMesh.scaling.scaleInPlace(2);
		greenTreePetalMesh.position.y += 2.05;
		Plant.meshes["greenTreePetal"] = greenTreePetalMesh;
		// Purple Top Petals
		let purpleTreePetalModelData = await BABYLON.SceneLoader.ImportMeshAsync("", "./assets/petal/", "treetopleaves_purple.glb", Plant.scene);
		let purpleTreePetalMesh = purpleTreePetalModelData.meshes[1]; // index 1 is the petal mesh, index 0 has the root node
		purpleTreePetalMesh.isVisible = false;
		purpleTreePetalMesh.scaling.scaleInPlace(2);
		purpleTreePetalMesh.position.y += 2.05;
		Plant.meshes["purpleTreePetal"] = purpleTreePetalMesh;
		// Yellow Top Petals
		let yellowTreePetalModelData = await BABYLON.SceneLoader.ImportMeshAsync("", "./assets/petal/", "treetopleaves_yellow.glb", Plant.scene);
		var yellowTreePetalMesh = yellowTreePetalModelData.meshes[1]; // index 1 is the petal mesh, index 0 has the root node
		yellowTreePetalMesh.isVisible = false;
		yellowTreePetalMesh.scaling.scaleInPlace(2);
		yellowTreePetalMesh.position.y += 2.05;
		Plant.meshes["yellowTreePetal"] = yellowTreePetalMesh;
		// Cloud
		let cloudModelData = await BABYLON.SceneLoader.ImportMeshAsync("", "./assets/cloud/", "cloud2.glb", Plant.scene);
		let cloudMesh = cloudModelData.meshes[1];
		cloudMesh.isVisible = false;
		cloudMesh.scaling.scaleInPlace(0.001);
		Plant.meshes["cloud1"] = cloudMesh;
		let cloud1ModelData = await BABYLON.SceneLoader.ImportMeshAsync("", "./assets/cloud/", "cloud_new.glb", Plant.scene);
		let cloud1Mesh = cloud1ModelData.meshes[1];
		cloud1Mesh.isVisible = false;
		cloud1Mesh.scaling.scaleInPlace(1);
		Plant.meshes["cloud2"] = cloudMesh;
		// Shrub
		let shrubModelData = await BABYLON.SceneLoader.ImportMeshAsync("", "./assets/shrub/", "shrubs.glb", Plant.scene);
		let shrubMesh1 = BABYLON.Mesh.MergeMeshes([shrubModelData.meshes[1]], false, false, null, false, true);
		shrubMesh1.isVisible = false;
		shrubMesh1.scaling.scaleInPlace(0.05);
		shrubMesh1.position.x += 1;
		Plant.meshes["shrub1"] = shrubMesh1;
		let shrubMesh2 = BABYLON.Mesh.MergeMeshes([shrubModelData.meshes[1], shrubModelData.meshes[2]], false, false, null, false, true);
		shrubMesh2.isVisible = false;
		shrubMesh2.scaling.scaleInPlace(0.05);
		shrubMesh2.position.x += 1;
		Plant.meshes["shrub2"] = shrubMesh2;
		let shrubMesh3 = BABYLON.Mesh.MergeMeshes([shrubModelData.meshes[1], shrubModelData.meshes[2], shrubModelData.meshes[3]], false, false, null, false, true);
		shrubMesh3.isVisible = false;
		shrubMesh3.scaling.scaleInPlace(0.05);
		shrubMesh3.position.x += 1;
		Plant.meshes["shrub3"] = shrubMesh3;
		let shrubMesh4 = BABYLON.Mesh.MergeMeshes([shrubModelData.meshes[1], shrubModelData.meshes[2], shrubModelData.meshes[3], shrubModelData.meshes[4]], true, false, null, false, true);
		shrubMesh4.isVisible = false;
		shrubMesh4.scaling.scaleInPlace(0.05);
		shrubMesh4.position.x += 1;
		Plant.meshes["shrub4"] = shrubMesh4;
		// Stem
		let stemModelData = await BABYLON.SceneLoader.ImportMeshAsync("", "./assets/stem/", "stem.glb", Plant.scene);
		let stemMesh = stemModelData.meshes[1];
		stemMesh.isVisible = false;
		stemMesh.scaling.scaleInPlace(4);
		stemMesh.position.y += 1;
		Plant.meshes["stem"] = stemMesh;
		// Trunk
		let trunkModelData = await BABYLON.SceneLoader.ImportMeshAsync("", "./assets/stem/", "tree_nobranch.glb", Plant.scene);
		let trunkMesh = trunkModelData.meshes[1];
		trunkMesh.isVisible = false;
		trunkMesh.scaling.scaleInPlace(2);
		trunkMesh.position.y -= 0.1;
		Plant.meshes["trunk"] = trunkMesh;
		// Leaf
		let leafModelData = await BABYLON.SceneLoader.ImportMeshAsync("", "./assets/leaf/", "leaf.glb", Plant.scene);
		let leafMesh = leafModelData.meshes[1]; // index 1 is the petal mesh, index 0 has the root node
		leafMesh.isVisible = false;
		leafMesh.scaling.scaleInPlace(4);
		leafMesh.position.y += 1.5;
		Plant.meshes["leaf1"] = leafMesh;
		let leaf2ModelData = await BABYLON.SceneLoader.ImportMeshAsync("", "./assets/leaf/", "leaf.glb", Plant.scene);
		let leaf2Mesh = leaf2ModelData.meshes[1]; // index 1 is the petal mesh, index 0 has the root node
		leaf2Mesh.isVisible = false;
		leaf2Mesh.scaling.scaleInPlace(4);
		leaf2Mesh.position.y += 1.3;
		leaf2Mesh.position.x -= 0.05;
		leaf2Mesh.position.z -= 0.4;
		leaf2Mesh.rotate(BABYLON.Axis.Y, Math.PI, BABYLON.Space.WORLD);
		leaf2Mesh.rotate(BABYLON.Axis.X, Math.PI/32, BABYLON.Space.WORLD);
		Plant.meshes["leaf2"] = leaf2Mesh;
		// Branch
		let branchModelData = await BABYLON.SceneLoader.ImportMeshAsync("", "./assets/leaf/", "treebranch_anchored.glb", Plant.scene);
		let branchMesh = branchModelData.meshes[1]; // index 1 is the petal mesh, index 0 has the root node
		branchMesh.isVisible = false;
		branchMesh.scaling.scaleInPlace(3);
		branchMesh.position.y -= 2;
		branchMesh.position.x -= 0.15;
		Plant.meshes["branch1"] = branchMesh;
		let branch2ModelData = await BABYLON.SceneLoader.ImportMeshAsync("", "./assets/leaf/", "treebranch_anchored.glb", Plant.scene);
		let branch2Mesh = branch2ModelData.meshes[1]; // index 1 is the petal mesh, index 0 has the root node
		branch2Mesh.isVisible = false;
		branch2Mesh.scaling.scaleInPlace(3);
		branch2Mesh.position.z += 1.4;
		branch2Mesh.position.x -= 0.15;
		branch2Mesh.rotate(BABYLON.Axis.Y, Math.PI, BABYLON.Space.WORLD);
		branch2Mesh.rotate(BABYLON.Axis.X, Math.PI/32, BABYLON.Space.WORLD);
		Plant.meshes["branch2"] = branch2Mesh;
		// Mushroom 1-2
		let mushroomModelData = await BABYLON.SceneLoader.ImportMeshAsync("", "./assets/mushrooms/", "mushroom_centered.glb", Plant.scene);
		let mushroomMesh = mushroomModelData.meshes[1]; // index 1 is the petal mesh, index 0 has the root node
		mushroomMesh.isVisible = false;
		mushroomMesh.scaling.scaleInPlace(0.02);
		mushroomMesh.position.z -= 0.126;
		mushroomMesh.position.x += 0.004;
		Plant.meshes["mushroom1"] = mushroomMesh;
		let mushroom2ModelData = await BABYLON.SceneLoader.ImportMeshAsync("", "./assets/mushrooms/", "mushroom2_centered.glb", Plant.scene);
		let mushroom2Mesh = mushroom2ModelData.meshes[1]; // index 1 is the petal mesh, index 0 has the root node
		mushroom2Mesh.isVisible = false;
		mushroom2Mesh.scaling.scaleInPlace(0.015);
		mushroom2Mesh.position.z -= 0.1613;
		mushroom2Mesh.position.y -= 0.005;
		mushroom2Mesh.position.x += 0.0023;
		Plant.meshes["mushroom2"] = mushroom2Mesh;
		// Bee
		let beeModelData = await BABYLON.SceneLoader.ImportMeshAsync("", "./assets/bee/", "bee.glb", Plant.scene);
		let beeMesh = BABYLON.Mesh.MergeMeshes([beeModelData.meshes[1], beeModelData.meshes[2], beeModelData.meshes[3]], true, false, null, false, true);
		beeMesh.isVisible = false;
		beeMesh.scaling.scaleInPlace(0.02);
		beeMesh.position.y += 2;
		beeMesh.position.z -= 0.5;
		Plant.meshes["bee1"] = beeMesh;
		let bee2ModelData = await BABYLON.SceneLoader.ImportMeshAsync("", "./assets/bee/", "bee.glb", Plant.scene);
		let bee2Mesh = BABYLON.Mesh.MergeMeshes([bee2ModelData.meshes[1], bee2ModelData.meshes[2], bee2ModelData.meshes[3]], true, false, null, false, true);
		bee2Mesh.isVisible = false;
		bee2Mesh.scaling.scaleInPlace(0.02);
		bee2Mesh.position.y += 2;
		bee2Mesh.position.x -= 0.5;
		bee2Mesh.rotate(BABYLON.Axis.Y, Math.PI, BABYLON.Space.WORLD);
		bee2Mesh.rotate(BABYLON.Axis.X, Math.PI/32, BABYLON.Space.WORLD);
		Plant.meshes["bee2"] = bee2Mesh;
		// for (const [key, value] of Object.entries(Plant.meshes)) {
		// 	Plant.maxPlantDimensions = Plant.findMaxPlantDimensions(Plant.maxPlantDimensions, value);
		// }
	}

	// Public instance Getters
	static getPosition(plant) {
		return Plant.plantDictionary[plant.name].position;
	}
	static getGrade(plant) {
		return Plant.plantDictionary[plant.name].grade;
	}
	static getSchool(plant) {
		return Plant.plantDictionary[plant.name].school;
	}
	static getMajor(plant) {
		return Plant.plantDictionary[plant.name].major;
	}
	static getDouble(plant) {
		return Plant.plantDictionary[plant.name].double;
	}
	static getMbti(plant) {
		return Plant.plantDictionary[plant.name].mbti;
	}
	static getEmoji(plant) {
		return Plant.plantDictionary[plant.name].emoji;
	}
	static getLifestyle(plant) {
		return Plant.plantDictionary[plant.name].lifestyle;
	}
	static getStress(plant) {
		return Plant.plantDictionary[plant.name].stress;
	}
	static getRelationships(plant) {
		return Plant.plantDictionary[plant.name].relationships;
	}
	static getSocialMedia(plant) {
		return Plant.plantDictionary[plant.name].socialmedia;
	}
	static getPlastic(plant) {
		return Plant.plantDictionary[plant.name].plastic;
	}
	static getOutlook(plant) {
		return Plant.plantDictionary[plant.name].outlook;
	}
	static getPurpose(plant) {
		return Plant.plantDictionary[plant.name].purpose;
	}
	static getToolTip(plant) {
		return Plant.plantDictionary[plant.name].tooltip;
	}
	static getX(plant) {
		return Plant.plantDictionary[plant.name].x;
	}
	static getZ(plant) {
		return Plant.plantDictionary[plant.name].z;
	}
	static getY(plant) {
		return Plant.plantDictionary[plant.name].y;
	}

	// Public instance Setters
	static setXYZ(plant, {x, y, z}) {
		Plant.setX(plant, x);
		Plant.setY(plant, y);
		Plant.setZ(plant, z);
	}
	static setX(plant, x) {
		Plant.plantDictionary[plant.name].plant.x = x;
	}
	static setY(plant, y) {
		Plant.plantDictionary[plant.name].plant.y = y;
	}
	static setZ(plant, z) {
		Plant.plantDictionary[plant.name].plant.z = z;
	}

	// Get Plant Count
	static getPlantCount() {
		return Plant.plantCount;
	}

	// Private instance Getters
	getPosition() {
		return this.#position;
	}
	getGrade() {
		return this.#grade;
	}
	getSchool() {
		return this.#school;
	}
	getMajor() {
		return this.#major;
	}
	getDouble() {
		return this.#double;
	}
	getMbti() {
		return this.#mbti;
	}
	getEmoji() {
		return this.#emoji;
	}
	getLifestyle() {
		return this.#lifestyle;
	}
	getStress() {
		return this.#stress;
	}
	getRelationships() {
		return this.#relationships;
	}
	getSocialMedia() {
		return this.#socialmedia;
	}
	getPlastic() {
		return this.#plastic;
	}
	getOutlook() {
		return this.#outlook;
	}
	getPurpose() {
		return this.#purpose;
	}
	getX() {
		return this.#x;
	}
	getZ() {
		return this.#z;
	}
	getY() {
		return this.#y;
	}

	// Private instance Setters
	setPosition(position) {
		this.#position = position;
	}
	setGrade(grade) {
		this.#grade = grade;
	}
	setSchool(school) {
		this.#school = school;
	}
	setMajor(major) {
		this.#major = major;
	}
	setDouble(double) {
		this.#double = double;
	}
	setMbti(mbti) {
		this.#mbti = mbti;
	}
	setEmoji(emoji) {
		this.#emoji = emoji;
	}
	setLifestyle(lifestyle) {
		this.#lifestyle = lifestyle;
	}
	setStress(stress) {
		this.#stress = stress;
	}
	setRelationships(relationships) {
		this.#relationships = relationships;
	}
	setSocialMedia(socialmedia) {
		this.#socialmedia = socialmedia;
	}
	setPlastic(plastic) {
		this.#plastic = plastic;
	}
	setOutlook(outlook) {
		this.#outlook = outlook;
	}
	setPurpose(purpose) {
		this.#purpose = purpose;
	}
	setX(x) {
		this.#x = x;
	}
	setZ(z) {
		this.#z = z;
	}
	setY(y) {
		this.#y = y;
	}

	initializePlant() {
		let plant = this.buildPlant();

		++Plant.plantCount;
		// Find max dimensions
		Plant.maxPlantDimensions = Plant.findMaxPlantDimensions(Plant.maxPlantDimensions, plant);
	}

	// Build plant based on attributes
	buildPlant() {
		let plant;
		// Position - Flower/Tree Shape
		let stem = this.selectStem(this.getPosition());
		// MBTI - Petal Color(hue)
		let petal = this.setPetal(this.getMbti(), this.getPosition());
		// Relationships - Leaves/Branches Quantity
		let [leaf1, leaf2] = this.setLeaves(this.getRelationships(), this.getPosition());
		// Social Media - Bees Count/Quantity
		// let bee1, bee2;
		let [bee1, bee2] = this.setBees(this.getSocialMedia());
		// Plastic - Mushroom Shape
		let [mushroom1, mushroom2] = this.setMushrooms(this.getPlastic(), this.getPosition());
		// Outlook - Cloud Quantity
		let cloud;
		// let cloud = this.setCloud(this.getOutlook());
		// Purpose - Shrub Quantity
		let shrub = this.setShrubs(this.getPurpose());

		plant = BABYLON.Mesh.MergeMeshes([stem, petal, leaf1, leaf2, bee1, bee2, mushroom1, mushroom2, cloud, shrub], false, false, null, false, true);

		// Lifestyle - Shadow Shape
		this.setShadow(this.getLifestyle(), plant);
		// plant.showBoundingBox = true;

		let actionManager = new BABYLON.ActionManager(Plant.scene);
		plant.actionManager = actionManager;

		plant.name = plant.name + Plant.plantCount;
		Plant.plantDictionary[plant.name] = new Object();
		Plant.plantDictionary[plant.name].plant = plant;
		Plant.plantDictionary[plant.name].position = this.getPosition();
		Plant.plantDictionary[plant.name].grade = this.getGrade();
		Plant.plantDictionary[plant.name].school = this.getSchool();
		Plant.plantDictionary[plant.name].major = this.getMajor();
		Plant.plantDictionary[plant.name].double = this.getDouble();
		Plant.plantDictionary[plant.name].mbti = this.getMbti();
		Plant.plantDictionary[plant.name].emoji = this.getEmoji();
		Plant.plantDictionary[plant.name].lifestyle = this.getLifestyle();
		Plant.plantDictionary[plant.name].stress = this.getStress();
		Plant.plantDictionary[plant.name].relationships = this.getRelationships();
		Plant.plantDictionary[plant.name].socialmedia = this.getSocialMedia();
		Plant.plantDictionary[plant.name].plastic = this.getPlastic();
		Plant.plantDictionary[plant.name].outlook = this.getOutlook();
		Plant.plantDictionary[plant.name].purpose = this.getPurpose();
		Plant.plantDictionary[plant.name].x = this.getX();
		Plant.plantDictionary[plant.name].z = this.getZ();
		Plant.plantDictionary[plant.name].y = this.getY();
		Plant.plantDictionary[plant.name].tooltip;
		Plant.plantDictionary[plant.name].lights;

		// ToolTip manager
		// Activate
		plant.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, function(ev){
			[Plant.plantDictionary[plant.name].tooltip, Plant.plantDictionary[plant.name].lights] = CreateToolTip(Plant.plantDictionary[plant.name].x,Plant.plantDictionary[plant.name].z,Plant.plantDictionary[plant.name].y,
				Plant.plantDictionary[plant.name].position,
				{
					// Major, Double, Emoji - ToolTip Text
					"Major": Plant.plantDictionary[plant.name].major,
					"Double": Plant.plantDictionary[plant.name].double,
					"Emoji": Plant.plantDictionary[plant.name].emoji,
				},
				Plant.scene);
			}));
		// Deactivate
		plant.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, function(ev){
			Plant.scene.removeMesh(Plant.plantDictionary[plant.name].tooltip);
			for (let i in Plant.plantDictionary[plant.name].lights) {Plant.plantDictionary[plant.name].lights[i].dispose();}
			}));
		return plant;
	}


	selectStem(position) {
		let stem;
		if (position == "student") {
			stem = Plant.meshes["stem"];
		} else {
			stem = Plant.meshes["trunk"];
		}
		return stem;
	}
	setPetal(mbti, position) {
		let petal;
		if (position == "student") {
			if (["intj","intp","entj","entp"].includes(mbti)) {
				petal = Plant.meshes["purplePetal"];
				// plant = BABYLON.Mesh.MergeMeshes([plant, petal], false, false, null, false, true);
			} else if (["istj","isfj","estj","esfj"].includes(mbti)) {
				petal = Plant.meshes["bluePetal"];
				// plant = BABYLON.Mesh.MergeMeshes([plant, petal], false, false, null, false, true);
			} else if (["istp","isfp","estp","esfp"].includes(mbti)) {
				petal = Plant.meshes["yellowPetal"];
				// plant = BABYLON.Mesh.MergeMeshes([plant, petal], false, false, null, false, true);
			} else if (["infj","infp","enfj","enfp"].includes(mbti)) {
				petal = Plant.meshes["greenPetal"];
				// plant = BABYLON.Mesh.MergeMeshes([plant, petal], false, false, null, false, true);
			} else {
				throw new Error('MBTI for plant #' + Plant.plantCount + 'with mbti' + mbti + ' is not a valid input!');
			}
		} else {
			if (["intj","intp","entj","entp"].includes(mbti)) {
				petal = Plant.meshes["purpleTreePetal"];
				// plant = BABYLON.Mesh.MergeMeshes([plant, petal], false, false, null, false, true);
			} else if (["istj","isfj","estj","esfj"].includes(mbti)) {
				petal = Plant.meshes["blueTreePetal"];
				// plant = BABYLON.Mesh.MergeMeshes([plant, petal], false, false, null, false, true);
			} else if (["istp","isfp","estp","esfp"].includes(mbti)) {
				petal = Plant.meshes["yellowTreePetal"];
				// plant = BABYLON.Mesh.MergeMeshes([plant, petal], false, false, null, false, true);
			} else if (["infj","infp","enfj","enfp"].includes(mbti)) {
				petal = Plant.meshes["greenTreePetal"];
				// plant = BABYLON.Mesh.MergeMeshes([plant, petal], false, false, null, false, true);
			} else {
				throw new Error('MBTI for plant #' + Plant.plantCount + 'with mbti' + mbti + ' is not a valid input!');
			}
		}
		return petal;
	}
	setShadow(lifeStyle, plant) {
		if (lifeStyle == "night owl") {
			// Shadows
			Plant.shadowGenerator.getShadowMap().renderList.push(plant);
			Plant.shadowGenerator.usePercentageCloserFiltering = true;
			// Plant.shadowGenerator.filteringQuality = BABYLON.ShadowGenerator.QUALITY_LOW;
			// Plant.shadowGenerator.useBlurExponentialShadowMap = true;
			// Plant.shadowGenerator.useKernelBlur = true;
			// Plant.shadowGenerator.blurKernel = 16;
		}
	}
	setLeaves(relationships, position) {
		let return1, return2;
		let leaf1 = Plant.meshes["leaf1"];
		let leaf2 = Plant.meshes["leaf2"];
		let branch1 = Plant.meshes["branch1"];
		let branch2 = Plant.meshes["branch2"];
		if (position == "student") {
			if (relationships >= 4) {return1 = leaf1;}
			if (relationships >= 7) {return2 = leaf2;}
		} else {
			if (relationships >= 4) {return1 = branch1;}
			if (relationships >= 7) {return2 = branch2;}
		}
		return [return1, return2];
	}
	setBees(socialMedia) {
		let return1, return2;
		let bee1 = Plant.meshes["bee1"];
		let bee2 = Plant.meshes["bee2"];
		if (socialMedia > 0) {return1 = bee1;}
		if (socialMedia > 3) {return2 = bee2;}
		return [return1, return2];
	}
	setMushrooms(plastic) {
		let return1, return2;
		let mushroom1 = Plant.meshes["mushroom1"];
		let mushroom2 = Plant.meshes["mushroom2"];
		if (plastic > 0) {return1 = mushroom1;}
		if (plastic > 3) {return2 = mushroom2;}
		return [return1, return2];
	}
	setCloud(outlook) {
		let cloud;
		if (outlook == "grim") {
			cloud = Plant.meshes["cloud1"];
		}
		return cloud;
	}
	setShrubs(purpose) {
		let shrub;
		let shrub1 = Plant.meshes["shrub1"];
		let shrub2 = Plant.meshes["shrub2"];
		let shrub3 = Plant.meshes["shrub3"];
		let shrub4 = Plant.meshes["shrub4"];
		if (purpose == 2) {shrub = shrub1;} 
		else if (purpose == 3) {shrub = shrub2;}
		else if (purpose == 4) {shrub = shrub3;}
		else if (purpose == 5) {shrub = shrub4;}
		return shrub;
	}





	// Arrange Plants
	static arrangeBy(maxMapSize, maxPlantDimensions, category, sortType) {
		// By Random
		if (sortType == 0) {
			let next = {x: 0, z: 0}
			let info = {sidesize: 1, xpos: true, zpos: true, xcount: 0, zcount: 0}
			for (let i in Plant.plantDictionary) {
				// Assign new position randomly
				// console.log(Plant.plantDictionary[i].x)
				let startPosition = new BABYLON.Vector3(Plant.plantDictionary[i].x, Plant.plantDictionary[i].y, Plant.plantDictionary[i].z);
				let xRandomShift = next.x + getRandomArbitrary(-maxPlantDimensions.x, maxPlantDimensions.x);
				let zRandomShift = next.z + getRandomArbitrary(-maxPlantDimensions.z, maxPlantDimensions.z);
				let [x, z, y] = this.setPlantPosition(Plant.plantDictionary[i].plant, xRandomShift, zRandomShift);
				Plant.plantDictionary[i].x = x;
				Plant.plantDictionary[i].z = z;
				Plant.plantDictionary[i].y = y;
				let endPosition = new BABYLON.Vector3(x, y, z);
				BABYLON.Animation.CreateAndStartAnimation("anim", Plant.plantDictionary[i].plant, "position", 30, 100, startPosition, endPosition, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
				if (info.xcount < info.sidesize) {
					info.xpos ? next.x += maxPlantDimensions.x*2 : next.x -= maxPlantDimensions.x*2;
					info.xcount++;
				} else if (info.zcount < info.sidesize) {
					info.zpos ? next.z += maxPlantDimensions.z*2 : next.z -= maxPlantDimensions.z*2;
					info.zcount++;
				} else {
					info.sidesize++;
					info.xcount = 0;
					info.zcount = 0;
					info.xpos = !info.xpos;
					info.zpos = !info.zpos;
					// Start with an x movement so that corners don't double up
					info.xpos ? next.x += maxPlantDimensions.x*2 : next.x -= maxPlantDimensions.x*2;
					info.xcount++;
				}
	
			}
		// By Category
		} else {
			let numCategories = this.variableData[category.toLowerCase()].v;
			let rangeSpace = partitionSpace(maxMapSize, numCategories);
			// Loop through plants to place them
			let openSpace = 0;
			let positionDictionary = {};
			for (let i in Plant.plantDictionary) {
				// Assign a new variable category to its own space
				if (!(Plant.plantDictionary[i][category] in positionDictionary)) {
					positionDictionary[Plant.plantDictionary[i][category]] = new Object();
					positionDictionary[Plant.plantDictionary[i][category]].range = rangeSpace[openSpace];
					positionDictionary[Plant.plantDictionary[i][category]].next = {x: positionDictionary[Plant.plantDictionary[i][category]].range.x[0] + (Math.abs(positionDictionary[Plant.plantDictionary[i][category]].range.x[0] - positionDictionary[Plant.plantDictionary[i][category]].range.x[1])/2), z: positionDictionary[Plant.plantDictionary[i][category]].range.z[0] + (Math.abs(positionDictionary[Plant.plantDictionary[i][category]].range.z[0] - positionDictionary[Plant.plantDictionary[i][category]].range.z[1])/2)}
					positionDictionary[Plant.plantDictionary[i][category]].info = {sidesize: 1, xpos: true, zpos: true, xcount: 0, zcount: 0}
					openSpace++;
				}
				// Place plant + Animation
				let startPosition = new BABYLON.Vector3(Plant.plantDictionary[i].x, Plant.plantDictionary[i].y, Plant.plantDictionary[i].z);
				let [x, z, y] = this.setPlantPosition(Plant.plantDictionary[i].plant, positionDictionary[Plant.plantDictionary[i][category]].next.x, positionDictionary[Plant.plantDictionary[i][category]].next.z);
				Plant.plantDictionary[i].x = x;
				Plant.plantDictionary[i].z = z;
				Plant.plantDictionary[i].y = y;
				let endPosition = new BABYLON.Vector3(x, y, z);
				BABYLON.Animation.CreateAndStartAnimation("anim", Plant.plantDictionary[i].plant, "position", 30, 100, startPosition, endPosition, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
				// Assign next location 
				if (positionDictionary[Plant.plantDictionary[i][category]].info.xcount < positionDictionary[Plant.plantDictionary[i][category]].info.sidesize) {
					positionDictionary[Plant.plantDictionary[i][category]].info.xpos ? positionDictionary[Plant.plantDictionary[i][category]].next.x += maxPlantDimensions.x : positionDictionary[Plant.plantDictionary[i][category]].next.x -= maxPlantDimensions.x;
					positionDictionary[Plant.plantDictionary[i][category]].info.xcount++;
				} else if (positionDictionary[Plant.plantDictionary[i][category]].info.zcount < positionDictionary[Plant.plantDictionary[i][category]].info.sidesize) {
					positionDictionary[Plant.plantDictionary[i][category]].info.zpos ? positionDictionary[Plant.plantDictionary[i][category]].next.z += maxPlantDimensions.z : positionDictionary[Plant.plantDictionary[i][category]].next.z -= maxPlantDimensions.z;
					positionDictionary[Plant.plantDictionary[i][category]].info.zcount++;
				} else {
					positionDictionary[Plant.plantDictionary[i][category]].info.sidesize++;
					positionDictionary[Plant.plantDictionary[i][category]].info.xcount = 0;
					positionDictionary[Plant.plantDictionary[i][category]].info.zcount = 0;
					positionDictionary[Plant.plantDictionary[i][category]].info.xpos = !positionDictionary[Plant.plantDictionary[i][category]].info.xpos;
					positionDictionary[Plant.plantDictionary[i][category]].info.zpos = !positionDictionary[Plant.plantDictionary[i][category]].info.zpos;
					// Start with an x movement so that corners don't double up
					positionDictionary[Plant.plantDictionary[i][category]].info.xpos ? positionDictionary[Plant.plantDictionary[i][category]].next.x += maxPlantDimensions.x : positionDictionary[Plant.plantDictionary[i][category]].next.x -= maxPlantDimensions.x;
					positionDictionary[Plant.plantDictionary[i][category]].info.xcount++;
				}
			}
		}
	}
	static setPlantPosition(plant, x, z) {
		plant.position.x = x;
		plant.position.z = z;
		plant.position.y = getHeightAtOctreeGroundCoordinates(x,z,Plant.ground);
		return [x, z, getHeightAtOctreeGroundCoordinates(x,z,Plant.ground)]
	}

	// Find Max Plant Dimensions from meshes
	static findMaxPlantDimensions(maxPlantDimensions, plant) {
		let x = Math.abs(plant.getBoundingInfo().boundingBox.minimum.x - plant.getBoundingInfo().boundingBox.maximum.x);
		let z = Math.abs(plant.getBoundingInfo().boundingBox.minimum.z - plant.getBoundingInfo().boundingBox.maximum.z);
		let y = Math.abs(plant.getBoundingInfo().boundingBox.minimum.y - plant.getBoundingInfo().boundingBox.maximum.y);
		return {x: Math.max(maxPlantDimensions.x, x), y: Math.max(maxPlantDimensions.y, y), z: Math.max(maxPlantDimensions.z, z)}
	}
}