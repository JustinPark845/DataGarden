import { maximumHeight } from "./maximumHeight";

function getHeightAtOctreeGroundCoordinates(x, z, ground) {
    var height;
    var origin = new BABYLON.Vector3(x, maximumHeight, z);
    var down = new BABYLON.Vector3(0, -maximumHeight, 0);

    var ray = new BABYLON.Ray(origin, down);
    var hit = ray.intersectsMesh(ground);

    if (hit.pickedPoint) {
        height = hit.pickedPoint.y;
    } else {
        throw "height relative to ground not found at position {x: " + x + ", z: " + z + "}";
    }

    return height;
}

export {getHeightAtOctreeGroundCoordinates};