import { arrangePlant } from "../entities/plant/plantHelper";
import { setGravity } from "../sceneFeatures/setGravity";
import { createViewMode } from "./viewmode";

export function createVRMenu(camera, xr, maxMapSize, maxPlantDimensions, scene) {
    // Fullscreen GUI
    var fullScreenTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    // Menu Button
    var menuButton = BABYLON.MeshBuilder.CreatePlane("plane", {height: .1, width: .3}, scene);
    menuButton.rotation.y = BABYLON.Tools.ToRadians(180);
    menuButton.bakeCurrentTransformIntoVertices();
    menuButton.parent = camera;
    menuButton.position.z += 2;
    menuButton.billboardMode = 7;
    var menuButtonTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(menuButton, 2*512, 1*512);
    var menuButtonStyle = new BABYLON.GUI.Rectangle();
    menuButtonStyle.background = "white";
    menuButtonStyle.alpha = 0.15;
    menuButtonStyle.cornerRadius = 100;
    menuButtonTexture.addControl(menuButtonStyle);
    var menuButtonText = new BABYLON.GUI.TextBlock();
    menuButtonText.text = "Menu";
    menuButtonText.color = "black";
    menuButtonText.alpha = 0.15;
    menuButtonText.fontSize = 250;
    menuButtonTexture.addControl(menuButtonText);

    let actionManager = new BABYLON.ActionManager(scene);
    menuButton.actionManager = actionManager;

    menuButton.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnLeftPickTrigger, function(ev){
        menuButton.setEnabled(false);
        menu.setEnabled(true);
    }));
    menuButton.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, function(ev){
        menuButtonStyle.alpha = 0.8;
        menuButtonText.alpha = 0.8;
    }));
    menuButton.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, function(ev){
        menuButtonStyle.alpha = 0.15;
        menuButtonText.alpha = 0.15;
    }));

    // Menu GUI
    var menu = BABYLON.MeshBuilder.CreatePlane("plane", {height: .75, width: .6}, scene);
    menu.rotation.y = BABYLON.Tools.ToRadians(180);
    menu.bakeCurrentTransformIntoVertices();
    menu.parent = camera;
    menu.position.z += 2;
    // menu.billboardMode = BABYLON.Mesh.BILLBOARDMODE_Y | BABYLON.Mesh.BILLBOARDMODE_USE_POSITION;
    menu.billboardMode = 7;
    menu.setEnabled(false);
    var menuTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(menu);
    // Menu Style
    var menuStyle = new BABYLON.GUI.Rectangle();
    menuStyle.background = "#708C38";
    menuStyle.cornerRadius = 50;
    menuTexture.addControl(menuStyle);

    // Change menu based on xr state
    var isXR = false;
    xr.baseExperience.onStateChangedObservable.add(function(){
        console.log(xr.baseExperience.sessionManager.inXRSession)
        if (xr.baseExperience.sessionManager.inXRSession) {
            isXR = true;
            menuButton.parent = xr.baseExperience.camera;
            menuButton.position.z += 2;
            menuButton.billboardMode = 7;
            menu.parent = xr.baseExperience.camera;
            menu.position.z += 2;
        } else {
            isXR = false;
            menuButton.parent = camera;
            menuButton.position.z += 2;
            menuButton.billboardMode = 7;
            menu.parent = camera;
            menu.position.z += 2;
        }
    })
    scene.registerBeforeRender(function () {
        if (isXR) {
            menu.position = xr.baseExperience.camera.getDirection(new BABYLON.Vector3(0.35,0,1));
            menuButton.position = xr.baseExperience.camera.getDirection(new BABYLON.Vector3(0,-0.2,1));
            menu.rotation.y = BABYLON.Tools.ToRadians(180);
            menuButton.rotation.y = BABYLON.Tools.ToRadians(180);
        } else {
            menu.position = camera.getDirection(new BABYLON.Vector3(0.35,0,1));
            menuButton.position = camera.getDirection(new BABYLON.Vector3(0,-0.2,1));
            menu.rotation.y = BABYLON.Tools.ToRadians(180);
            menuButton.rotation.y = BABYLON.Tools.ToRadians(180);
        }
    });

    // scene.registerBeforeRender(function () {
    //     menu.position.x = Math.sin(camera.rotation.y%(Math.PI*2)) * 2
    //     menu.position.z = Math.cos(camera.rotation.y%(Math.PI*2)) * 2 
    //     menu.rotation.y = BABYLON.Tools.ToRadians(180);
    // });

    // StackPanel
    var stackPanel = new BABYLON.GUI.StackPanel();
    menuTexture.addControl(stackPanel);

    // Buttons Stack Panel
    var buttonsPanel = new BABYLON.GUI.StackPanel();
    stackPanel.addControl(buttonsPanel);
    // Buttons
    var legendButton = createButton("legend", "Legend", function(){
        fullScreenTexture.addControl(exitLegendButton);
        fullScreenTexture.addControl(legend);
    });
    var [legend, exitLegendButton] = createLegend(fullScreenTexture);
    var modeButton = createButton("mode", "Fly", function(button){
        if (button.textBlock.text == "Fly") {
            button.textBlock.text = "Walk";
            setGravity(camera, xr, false);
        } else {
            button.textBlock.text = "Fly";
            setGravity(camera, xr, true);
        }});
    var viewButton = createButton("topview", "Top View", function(button){
        if (button.textBlock.text == "Top View") {
            button.textBlock.text = "Floor View";
            createViewMode(camera, xr, "top", null, maxMapSize, scene);
        } else {
            button.textBlock.text = "Top View";
            createViewMode(camera, xr, "default", null, maxMapSize, scene);
        };
    });
    // Add Buttons
    let buttonsList = [legendButton, modeButton, viewButton]
    buttonsList.forEach((button) => buttonsPanel.addControl(button));

    // Display Sort Information
    var sortedByText = new BABYLON.GUI.TextBlock();
    sortedByText.text = "Currently Sorted By: ";
    sortedByText.height = "80px";
    sortedByText.color = "white";
    sortedByText.fontSize = 40;
    stackPanel.addControl(sortedByText);

    // Sort Buttons Stack Panel
    var sortedButtonsPanel = new BABYLON.GUI.StackPanel();
    sortedButtonsPanel.height = "500px";
    stackPanel.addControl(sortedButtonsPanel);
    // Random Sort Option
    var randomButton = new BABYLON.GUI.Rectangle();
    randomButton.height = "100px";
    randomButton.thickness = 0;
    createRadioButton("Organic", "random", randomButton, sortedByText, maxMapSize, maxPlantDimensions, xr);
    sortedButtonsPanel.addControl(randomButton);
    // Sort Buttons Grid
    var sortedButtonsGrid = new BABYLON.GUI.Grid();   
    sortedButtonsGrid.height = "400px";
    sortedButtonsGrid.addColumnDefinition(0.5);
    sortedButtonsGrid.addColumnDefinition(0.5);
    sortedButtonsPanel.addControl(sortedButtonsGrid);
    // Stack Panel Left
    var sortButtonsLeftPanel = new BABYLON.GUI.StackPanel();
    sortedButtonsGrid.addControl(sortButtonsLeftPanel, 0, 0)
    // Stack Panel Right
    var sortButtonsRightPanel = new BABYLON.GUI.StackPanel();
    sortedButtonsGrid.addControl(sortButtonsRightPanel, 0, 1)
    // Sort Buttons
    let categoryList = ["Position", "Grade", "School", "Major", "Double", "MBTI", "Emoji", "Lifestyle", "Stress", "Relationships", "SocialMedia", "Plastic", "Outlook", "Purpose"]
    categoryList.forEach((category, i) => {if (i < categoryList.length/2) {createRadioButton(category, category.toLowerCase(), sortButtonsLeftPanel, sortedByText, maxMapSize, maxPlantDimensions, xr)}});
    categoryList.forEach((category, i) => {if (i >= categoryList.length/2) {createRadioButton(category, category.toLowerCase(), sortButtonsRightPanel, sortedByText, maxMapSize, maxPlantDimensions, xr)}});

    // Add Exit Button
    var exitButton = createButton("exit", "Exit", function(){
        menuButton.setEnabled(true);
        menu.setEnabled(false);
    });
    exitButton.width = 0.2;
    exitButton.background = "#4f420e";
    stackPanel.addControl(exitButton);
}

function createLegend(fullScreenTexture) {
    // legend
	var legend = new BABYLON.GUI.Image("legend", "./assets/textures/userstudylegend.jpeg");
	legend.width = 0.5;
	legend.height = 0.3;
	legend.onPointerUpObservable.add(function() {
		fullScreenTexture.removeControl(exitLegendButton);
		fullScreenTexture.removeControl(legend);
	});
    // exit legend button
	var exitLegendButton = BABYLON.GUI.Button.CreateSimpleButton("exit");
	exitLegendButton.width = 2;
	exitLegendButton.height = 2;
	exitLegendButton.background = "black";
	exitLegendButton.alpha = 0.6;
	exitLegendButton.onPointerUpObservable.add(function() {
		fullScreenTexture.removeControl(exitLegendButton);
		fullScreenTexture.removeControl(legend);
	});
    return [legend, exitLegendButton]
}

function createButton(title, text, func) {
    const button = BABYLON.GUI.Button.CreateSimpleButton(title, text);
    button.height = "80px";
    button.width = 0.8;
    button.paddingBottom = 15;
    button.color = "white";
    button.fontSize = 40;
    button.background = "#3d330b";
    button.cornerRadius = 25;
    button.onPointerUpObservable.add(function() {func(button)});
    return button;
}
function createRadioButton(text, category, parent, sortedByText, maxMapSize, maxPlantDimensions, xr) {
    var button = new BABYLON.GUI.RadioButton();
    button.width = "30px";
    button.height = "30px";
    button.color = "white";
    button.background = "green";
    button.onIsCheckedChangedObservable.add(function() {
        if (button.isChecked) {
            sortedByText.text = "Currently Sorted By: " + text;
            if (category == "random") {
                arrangePlant(maxMapSize, maxPlantDimensions, "", 0);
            } else {
                arrangePlant(maxMapSize, maxPlantDimensions, category, 1);
            }
        }
    }); 
    var header = BABYLON.GUI.Control.AddHeader(button, text, "110px", { isHorizontal: true, controlFirst: true });
    header.color = "white";
    header.height = "50px";

    parent.addControl(header);    
}