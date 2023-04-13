function CreateToolTip(plant_x, plant_z, plant_y, position, categories, scene) {
	var plane = new BABYLON.MeshBuilder.CreatePlane("plane", {height:1, width: 1}, scene);
	plane.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
	plane.position.x = plant_x + 1;
	plane.position.z = plant_z;
	plane.position.y = plant_y + 1;
	if (position === "professor/faculty") {
		plane.position.y += 1.5;
	}

	// Create lighting
	let lights = {
		"hemi1": new BABYLON.HemisphericLight("hemisphericLight", new BABYLON.Vector3(plant_x + 1, 10 + 1, plant_z), scene),
		"hemi2": new BABYLON.HemisphericLight("hemisphericLight", new BABYLON.Vector3(plant_x + 1, -10 + 1, plant_z), scene),
	}
	lights["hemi1"].intensity = 100;
	lights["hemi2"].intensity = 100;
	lights["hemi1"].includedOnlyMeshes = [plane];
	lights["hemi2"].includedOnlyMeshes = [plane];
	lights["hemi1"].specular = new BABYLON.Color3.Black();
	lights["hemi2"].specular = new BABYLON.Color3.Black();

	// ToolTip Texture
	var toolTipTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(plane);
	toolTipTexture.background = "white";

	// Initialize Stack Panel
	var stackPanel = new BABYLON.GUI.StackPanel();
	toolTipTexture.addControl(stackPanel);

	for (let category in categories) {
		let text = addCategory(category, categories[category]);
		stackPanel.addControl(text);
	}

	return [plane, lights];
}
function addCategory(name, category) {
	var text = new BABYLON.GUI.TextBlock();
	text.text = name + ": " + category;
	text.fontFamily = "Arial";
	text.fontSize = 100;
	text.color = "black";
	text.background = "white";
	text.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
	text.paddingLeft = "50px";
	text.textWrapping = true;
	text.resizeToFit = true;
	return text;
}

export { CreateToolTip };