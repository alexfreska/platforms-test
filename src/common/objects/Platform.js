'use strict';

const Serializer = require('lance-gg').serialize.Serializer;
const DynamicObject = require('lance-gg').serialize.DynamicObject;
const TwoVector = require('lance-gg').serialize.TwoVector;

let P2 = null;

class Platform extends DynamicObject {

    constructor(id, gameEngine, x, y) {
        super(id, new TwoVector(x, y));
        this.class = Platform;
        this.gameEngine = gameEngine;

        this.width = 1;
        this.height = 0.3;
        this.color = 'green';
    };

    get bendingMultiple() { return 0.8; }
    get velocityBendingMultiple() { return 0; }

    /*static get netScheme() {
        return Object.assign({
            //showThrust: { type: Serializer.TYPES.INT32 }
        }, super.netScheme);
    }

    toString() {
        return `Platform::${super.toString()}`;
    }

    //get bendingAngleLocalMultiple() { return 0.0; }

    syncTo(other) {
        super.syncTo(other);
        //this.showThrust = other.showThrust;
    }*/

    onAddToWorld(gameEngine) {

        console.log(`SPRITE ADD TO WORLD ${super.toString()}`);

        P2 = gameEngine.physicsEngine.P2;

        this.gameEngine = gameEngine;

        let platformMaterial = this.gameEngine.materials.groundMaterial;
        let platformShape = new this.gameEngine.physicsEngine.P2.Box({ width: this.width, height: this.height });
        let platformBody = this.physicsObj = new this.gameEngine.physicsEngine.P2.Body({
            mass: 0,
            angle: 0,
            position:[this.position.x, this.position.y]
        });
        platformBody.type = P2.Body.KINEMATIC;
        platformShape.material = platformMaterial;
        platformBody.addShape(platformShape);
        platformBody.isPlatform = true;

        this.gameEngine.physicsEngine.world.addBody(platformBody);

        let scene = this.scene = gameEngine.renderer ? gameEngine.renderer.scene : null;
        if (scene) {

        }
    }

    // update position, quaternion, and velocity from new physical state.
    refreshFromPhysics() {
        this.position.set(this.physicsObj.position[0], this.physicsObj.position[1]);
        this.velocity.set(this.physicsObj.velocity[0], this.physicsObj.velocity[1]);
        this.angle = this.physicsObj.angle;
    }

    // update position, quaternion, and velocity from new physical state.
    refreshToPhysics() {
        this.physicsObj.position = [this.position.x, this.position.y];
        this.physicsObj.velocity = [this.velocity.x, this.velocity.y];
        this.physicsObj.angle = this.angle;
    }

}

module.exports = Platform;