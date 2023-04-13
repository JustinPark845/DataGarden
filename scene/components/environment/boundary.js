export function createMapBoundary(maxMapSize, scene) {
	const wall1 = BABYLON.MeshBuilder.CreatePlane("plane", {width: maxMapSize, height: maxMapSize, sideOrientation: BABYLON.Mesh.DOUBLESIDE}, scene);
	const wall2 = BABYLON.MeshBuilder.CreatePlane("plane", {width: maxMapSize, height: maxMapSize, sideOrientation: BABYLON.Mesh.DOUBLESIDE}, scene);
	const wall3 = BABYLON.MeshBuilder.CreatePlane("plane", {width: maxMapSize, height: maxMapSize, sideOrientation: BABYLON.Mesh.DOUBLESIDE}, scene);
	const wall4 = BABYLON.MeshBuilder.CreatePlane("plane", {width: maxMapSize, height: maxMapSize, sideOrientation: BABYLON.Mesh.DOUBLESIDE}, scene);
	const wall5 = BABYLON.MeshBuilder.CreatePlane("plane", {width: maxMapSize, height: maxMapSize, sideOrientation: BABYLON.Mesh.DOUBLESIDE}, scene);
	wall1.isVisible = false;
	wall2.isVisible = false;
	wall3.isVisible = false;
	wall4.isVisible = false;
	wall5.isVisible = false;
	wall1.position.y = maxMapSize/2;
	wall2.position.y = maxMapSize/2;
	wall3.position.y = maxMapSize/2;
	wall4.position.y = maxMapSize/2;
	wall5.position.y = maxMapSize;
	wall1.position.z = maxMapSize/2;
	wall2.position.z = -maxMapSize/2;
	wall2.rotation.y = BABYLON.Tools.ToRadians(180);
	wall3.position.x = maxMapSize/2;
	wall3.rotation.y = BABYLON.Tools.ToRadians(90);
	wall4.position.x = -maxMapSize/2;
	wall4.rotation.y = BABYLON.Tools.ToRadians(-90);
	wall5.rotation.x = BABYLON.Tools.ToRadians(-90);
	wall1.checkCollisions = true;
	wall2.checkCollisions = true;
	wall3.checkCollisions = true;
	wall4.checkCollisions = true;
	wall5.checkCollisions = true;
}