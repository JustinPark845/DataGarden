import { randVal } from "../../sceneFeatures/randVal";

// Functional Component
function createWind(scene, engine) {
    let wind = {
        count: 50,
        minSpeed: 1,
        maxSpeed: 2,
        minSize: 5,
        maxSize: 15,
        minWidth: 0.1,
        maxWidth: 0.1,
        minAlpha: 0.3,
        maxAlpha: 0.5,
        streaks: [],
        boundSize: new BABYLON.Vector3(500, 500, 500), // streaks exist within this rectangle centered at (0, 0, 0)
    };

    wind.rootMesh = new BABYLON.MeshBuilder.CreateCylinder("wind", { height: 1, diameter: wind.width}, scene);
    wind.rootMesh.rotation.z = Math.PI/2;
    let mat = new BABYLON.StandardMaterial("mat", scene);
    mat.alpha = 0.1;
    wind.rootMesh.material = mat;
    wind.rootMesh.isVisible = false;

    for (let i = 0; i < wind.count; ++i) {
        let streak = wind.rootMesh.createInstance("streak" + i);
        streak.velocity = new BABYLON.Vector3(0, 0, 0);

        respawnStreak(streak);
        wind.streaks.push(streak);
    }

    function boundContainsStreak(streak) {
        let pos = streak.position;
        let size = wind.boundSize;
        return pos.x > -size.x/2 && pos.x < size.x/2 && pos.y > -size.y/2 && pos.y < size.y/2 && pos.z > -size.z/2 && pos.z < size.z/2;
    }
    function respawnStreak(streak) {
        let y = (Math.random() - 0.5) * wind.boundSize.y;
        let z = (Math.random() - 0.5) * wind.boundSize.z;
        streak.position.set(-wind.boundSize.x/2, y, z);

        streak.material.alpha = randVal(wind.minAlpha, wind.maxAlpha);
        streak.scaling.y = randVal(wind.minSize, wind.maxSize);
        streak.scaling.x = randVal(wind.minWidth, wind.maxWidth);
        streak.scaling.z = randVal(wind.minWidth, wind.maxWidth);
        streak.velocity.x = randVal(wind.minSpeed, wind.maxSpeed);
    }
    function updateWind() {
        for (let streak of wind.streaks){
            if (streak.position){
                streak.position.addInPlace(streak.velocity);
            }
            if (!boundContainsStreak(streak)) {
                respawnStreak(streak);
            }
        }
    }

    scene.onBeforeRenderObservable.add(() => { // gets called each frame right before painting the screen
        updateWind();
    });

    engine.runRenderLoop(function () { // gets called each frame
        scene.render();
    });

    window.addEventListener("resize", function () {
        engine.resize();
    });
}

export {createWind};