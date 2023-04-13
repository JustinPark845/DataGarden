import { setGravity } from '../sceneFeatures/setGravity';
import { createViewMode } from './viewmode';
import { arrangePlant } from '../entities/plant/plantHelper';

// Format
// Menu
// |-> Legend(button)
//     |-> Legend
//     |-> Exit Legend
// |-> View
//     |-> Top View
//     |-> Side View
//     |-> Back
// |-> Mode
//     |-> Walk
//     |-> Fly
//     |-> Back
// |-> Exit

export function createMenu(camera, xr, maxPlantDimensions, numEntries) {
    // Create Menu
	// GUI
	var fullScreenTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    // container
    var panel = new BABYLON.GUI.StackPanel();
    // container buttons
    var menuButtons = [];

    // button styles
    function styleButton(button) {
        button.width = 0.20;
        button.height = "60px";
        button.cornerRadius = 10;
        button.thickness = 0;
        button.background = "white";
        button.fontSize = 30;
        button.alpha = 1;
        button.paddingBottom = "5px";
        button.onPointerEnterObservable.add(function() {
            button.alpha = 0.8;
        });
        button.onPointerOutObservable.add(function() {
            button.alpha = 1;
        });
        button.onPointerDownObservable.add(function() {
            button.alpha = 1;
        });
    }

    // test
    var testButton = BABYLON.GUI.Button.CreateSimpleButton("test", "Test");
    styleButton(testButton);
    testButton.width = 0.25;
    testButton.height = "75px";
    testButton.top = "20%";
    testButton.fontSize = 40;
    testButton.alpha = 0.15;
    testButton.onPointerEnterObservable.add(function() {
        testButton.alpha = 0.8;
    });
    testButton.onPointerOutObservable.add(function() {
        testButton.alpha = 0.15;
    });
    testButton.onPointerDownObservable.add(function() {
        testButton.alpha = 0.15;
    })
	testButton.onPointerUpObservable.add(function() {
        fullScreenTexture.removeControl(testButton);
        fullScreenTexture.addControl(panel);
	});

	// menu button
	var menuButton = BABYLON.GUI.Button.CreateSimpleButton("menu", "Menu");
    styleButton(menuButton);
    menuButton.width = 0.25;
    menuButton.height = "75px";
    menuButton.top = "20%";
    menuButton.fontSize = 40;
    menuButton.alpha = 0.15;
    menuButton.onPointerEnterObservable.add(function() {
        menuButton.alpha = 0.8;
    });
    menuButton.onPointerOutObservable.add(function() {
        menuButton.alpha = 0.15;
    });
    menuButton.onPointerDownObservable.add(function() {
        menuButton.alpha = 0.15;
    })
	menuButton.onPointerUpObservable.add(function() {
        fullScreenTexture.removeControl(menuButton);
        fullScreenTexture.addControl(panel);
	});

    // legend button
	var legendButton = BABYLON.GUI.Button.CreateSimpleButton("legend", "Legend");
    styleButton(legendButton);
	legendButton.onPointerUpObservable.add(function() {
        fullScreenTexture.removeControl(panel);
        fullScreenTexture.addControl(exitLegendButton);
        fullScreenTexture.addControl(legend);
	});
    menuButtons.push(legendButton);
    // legend
	var legend = new BABYLON.GUI.Image("legend", "./assets/textures/userstudylegend.jpeg");
	legend.width = 0.5;
	legend.height = 0.3;
	legend.onPointerUpObservable.add(function() {
		fullScreenTexture.removeControl(exitLegendButton);
		fullScreenTexture.removeControl(legend);
        fullScreenTexture.addControl(panel);
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
        fullScreenTexture.addControl(panel);
	});

    // position tracker
    var isDefault = true;
    // view button
	var viewButton = BABYLON.GUI.Button.CreateSimpleButton("view", "View");
    styleButton(viewButton);
	viewButton.onPointerUpObservable.add(function() {
        menuButtons.forEach((button) => panel.removeControl(button));
        panel.addControl(topViewButton);
        panel.addControl(sideViewButton);
        panel.addControl(defaultViewButton);
        panel.addControl(exitViewButton);
	});
    menuButtons.push(viewButton);
    // top view button
	var topViewButton = BABYLON.GUI.Button.CreateSimpleButton("topview", "Top");
    styleButton(topViewButton);
	topViewButton.onPointerUpObservable.add(function() {
        setGravity(camera, xr, false);
        createViewMode(camera, xr, "top");
        isDefault = false;
        panel.removeControl(topViewButton);
        panel.removeControl(sideViewButton);
        panel.removeControl(defaultViewButton);
        panel.removeControl(exitViewButton);
        menuButtons.forEach((button) => panel.addControl(button));
        panel.removeControl(flyModeButton);
        fullScreenTexture.removeControl(panel);
        fullScreenTexture.addControl(menuButton);
	});
    // side view button
	var sideViewButton = BABYLON.GUI.Button.CreateSimpleButton("sideview", "Side");
    styleButton(sideViewButton);
	sideViewButton.onPointerUpObservable.add(function() {
        setGravity(camera, xr, false);
        createViewMode(camera, xr, "side");
        isDefault = false;
        panel.removeControl(topViewButton);
        panel.removeControl(sideViewButton);
        panel.removeControl(defaultViewButton);
        panel.removeControl(exitViewButton);
        menuButtons.forEach((button) => panel.addControl(button));
        panel.removeControl(flyModeButton);
        fullScreenTexture.removeControl(panel);
        fullScreenTexture.addControl(menuButton);
	});
    // default view button
	var defaultViewButton = BABYLON.GUI.Button.CreateSimpleButton("defaultview", "Default");
    styleButton(defaultViewButton);
	defaultViewButton.onPointerUpObservable.add(function() {
        setGravity(camera, xr, true);
        createViewMode(camera, xr, "default");
        isDefault = true;
        panel.removeControl(topViewButton);
        panel.removeControl(sideViewButton);
        panel.removeControl(defaultViewButton);
        panel.removeControl(exitViewButton);
        menuButtons.forEach((button) => panel.addControl(button));
        fullScreenTexture.removeControl(panel);
        fullScreenTexture.addControl(menuButton);
	});
    // exit view button
    var exitViewButton = BABYLON.GUI.Button.CreateSimpleButton("exitview", "Back");
    styleButton(exitViewButton);
	exitViewButton.onPointerUpObservable.add(function() {
        createViewMode(camera, xr, "back", isDefault);
        panel.removeControl(topViewButton);
        panel.removeControl(sideViewButton);
        panel.removeControl(defaultViewButton);
        panel.removeControl(exitViewButton);
        menuButtons.forEach((button) => panel.addControl(button));
	});
    
    // fly mode button
    var flyModeButton = BABYLON.GUI.Button.CreateSimpleButton("flymode", "Fly");
    styleButton(flyModeButton);
	flyModeButton.onPointerUpObservable.add(function() {
        setGravity(camera, xr, false);
        menuButtons.forEach((button) => panel.removeControl(button));
        let index = menuButtons.indexOf(flyModeButton);
        if (index) {
            menuButtons[index] = walkModeButton;
        }
        menuButtons.forEach((button) => panel.addControl(button));
	});
    menuButtons.push(flyModeButton);
    // walk mode button
    var walkModeButton = BABYLON.GUI.Button.CreateSimpleButton("walkmode", "Walk");
    styleButton(walkModeButton);
	walkModeButton.onPointerUpObservable.add(function() {
        setGravity(camera, xr, true);
        menuButtons.forEach((button) => panel.removeControl(button));
        let index = menuButtons.indexOf(walkModeButton);
        if (index) {
            menuButtons[index] = flyModeButton;
        }
        menuButtons.forEach((button) => panel.addControl(button));
	});

    // back button
	var exitButton = BABYLON.GUI.Button.CreateSimpleButton("exit", "Exit");
    styleButton(exitButton);
	exitButton.onPointerUpObservable.add(function() {
        fullScreenTexture.removeControl(panel);
        fullScreenTexture.addControl(menuButton);
	});
    menuButtons.push(exitButton);


	// Initialize Menu
	fullScreenTexture.addControl(menuButton);
    menuButtons.forEach((button) => panel.addControl(button));
}