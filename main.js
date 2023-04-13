import { createScene } from './scene/scene';

(function main () {
	// Take canvas from HTML document
	let canvas = document.getElementsByTagName("canvas")[0];

	// Create scene
	createScene(canvas);
})();