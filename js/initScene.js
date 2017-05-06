// The babylon engine
var engine;
// The current scene
var scene;
// The HTML canvas
var canvas;
// The camera, the ship and thez ground wil move
var camera, ship, ground;

// The function onload is loaded when the DOM has been loaded
document.addEventListener("DOMContentLoaded", function () {
    onload();
}, false);

// Resize the babylon engine when the window is resized
window.addEventListener("resize", function () {
	if (engine) {
		engine.resize();
	}
},false);

/**
 * Onload function : creates the babylon engine and the scene
 */
var onload = function () {
	// Engine creation
    canvas = document.getElementById("renderCanvas");
	  engine = new BABYLON.Engine(canvas, true);

    // Scene creation
	initScene();

    // The render function
	engine.runRenderLoop(function () {
        if (!ship.killed) {
            ship.move();
            camera.position.z += ship.speed;
            ship.position.z += ship.speed;
            ground.position.z += ship.speed;
        }
        scene.render();
	});
};


var initScene = function() {
    console.log("launching scene");
    scene = new BABYLON.Scene(engine);

    // Camera attached to the canvas
    camera = new BABYLON.FreeCamera("Camera", new BABYLON.Vector3(0, 5, -30), scene);
    camera.setTarget(new BABYLON.Vector3(0,0,20));
    camera.maxZ = 1000;
    camera.speed = 4;

    // Hemispheric light to light the scene
    var h = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0, 0.5, 0), scene);
    h.intensity = 0.6;

    var d = new BABYLON.DirectionalLight("dir", new BABYLON.Vector3(0,-0.5,0.5), scene);
    d.position = new BABYLON.Vector3(0.1,100,-100);
    d.intensity = 0.4;
    d.diffuse = BABYLON.Color3.FromInts(204,196,255);

    // ground
    ground = BABYLON.Mesh.CreateGround("ground", 800, 2000, 2, scene);

    // ship
    ship = new Ship(1, scene);
    setInterval(box,350);
    scene.fogMode = BABYLON.Scene.FOGMODE_EXP2;
    scene.fogDensity = 0.01;
};
var randomNumber = function (min, max) {
    if (min == max) {
        return (min);
    }
    var random = Math.random();
    return ((random * (max - min)) + min);
};

var box = function() {
    var minZ = camera.position.z+500;
    var maxZ = camera.position.z+1500;
    var minX = camera.position.x - 100, maxX = camera.position.x+100;
    var minSize = 2, maxSize = 10;

    var randomX, randomZ, randomSize;

    randomX = randomNumber(minX, maxX);
    randomZ = randomNumber(minZ, maxZ);
    randomSize = randomNumber(minSize, maxSize);

    var b = BABYLON.Mesh.CreateBox("bb", randomSize, scene);

    b.scaling.x = randomNumber(0.5, 1.5);
    b.scaling.y = randomNumber(4, 8);
    b.scaling.z = randomNumber(2, 3);

    b.position.x = randomX;
    b.position.y = b.scaling.y/2 ;
    b.position.z = randomZ;

    b.actionManager = new BABYLON.ActionManager(scene);

    var trigger = {trigger:BABYLON.ActionManager.OnIntersectionEnterTrigger,parameter:ship};

    var sba = new BABYLON.SwitchBooleanAction(trigger,ship,'killed');
    b.actionManager.registerAction(sba);
    var condition = new BABYLON.ValueCondition(b.actionManager, ship, "ammo", 0, BABYLON.ValueCondition.IsGreater);

    var onpickAction = new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger,function(evt){
      if(evt.meshUnderPointer){
        var meshClicked = evt.meshUnderPointer;

        meshClicked.dispose();
        ship.ammo -=1;
        ship.sendEvent();
      }
    },condition);
    b.actionManager.registerAction(onpickAction);
};
