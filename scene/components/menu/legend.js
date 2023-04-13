export function createLegend(texture) {
    // legend
	var legend = new BABYLON.GUI.Image("legend", "./assets/textures/legend.jpg");
	legend.width = 0.5;
	legend.height = 0.5;
	legend.onPointerUpObservable.add(function() {
		texture.removeControl(exitButton);
		texture.removeControl(legend);
	});

    // exit button
	var exitButton = BABYLON.GUI.Button.CreateSimpleButton("exit");
	exitButton.width = 2;
	exitButton.height = 2;
	exitButton.background = "black";
	exitButton.alpha = 0.6;
	exitButton.onPointerUpObservable.add(function() {
		texture.removeControl(exitButton);
		texture.removeControl(legend);
	});

    // Initialize Legend
    texture.addControl(exitButton);
    texture.addControl(legend);
}