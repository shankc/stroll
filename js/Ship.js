/**
 * A mesh representing the player ship
 * @param size The ship size
 * @param scene The scene
 * @param camera
 * @constructor
 */
Ship = function(size, scene) {
    BABYLON.Mesh.call(this, "ship", scene);
    var vd = BABYLON.VertexData.CreateBox(size);
    vd.applyToMesh(this, false);

    this.killed = false;
    this.ammo = 3;
    this.position.x = 0;
    this.position.z = 0;
    this.position.y = size/2;

    // Movement attributes
    this.speed = 3;
    this.moveLeft = false;
    this.moveRight = false;

    this._initMovement();
    this._initLabelUpdate();
};

Ship.prototype = Object.create(BABYLON.Mesh.prototype);
Ship.prototype.constructor = Ship;
Ship.prototype._initMovement = function() {
    var onKeyDown = function(evt) {
        if (evt.keyCode == 37) {
            ship.moveLeft = true;
            ship.moveRight = false;
        } else if (evt.keyCode == 39) {
            ship.moveRight = true;
            ship.moveLeft = false;
        }
    };

    var onKeyUp = function(evt) {
        ship.moveRight = false;
        ship.moveLeft = false;
    };

    // Register events
    BABYLON.Tools.RegisterTopRootEvents([{
        name: "keydown",
        handler: onKeyDown
    }, {
        name: "keyup",
        handler: onKeyUp
    }]);
};

Ship.prototype.move = function() {
    if (ship.moveRight) {
      console.log("shipe moving to the right");
        ship.position.x += 1;
        camera.position.x += 1;
    }
    if (ship.moveLeft) {
        ship.position.x += -1;
        camera.position.x += -1;
    }
};
Ship.prototype.sendEvent = function() {
    var e = new Event('ammoUpdated');
    window.dispatchEvent(e);
};

// Create the event hook
Ship.prototype._initLabelUpdate = function() {
    // Update the html part
    var updateAmmoLabel = function() {
        document.getElementById("ammoLabel").innerHTML = "AMMO : "+ship.ammo;
    };

    BABYLON.Tools.RegisterTopRootEvents([{
        name:"ammoUpdated",
        handler : updateAmmoLabel
    }]);
};
