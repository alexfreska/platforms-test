'use strict';

const Serializer = require('lance-gg').serialize.Serializer;
const DynamicObject = require('lance-gg').serialize.DynamicObject;
const TwoVector = require('lance-gg').serialize.TwoVector;

let P2 = null;

class Box extends DynamicObject {

    constructor(id, gameEngine, x, y) {
        super(id, new TwoVector(x, y));
        this.class = Box;
        this.gameEngine = gameEngine;

        this.width = 0.8;
        this.height = 0.8;
        this.color = 'red';
    };

    onAddToWorld(gameEngine) {

        console.log(`SPRITE ADD TO WORLD ${super.toString()}`);

        P2 = gameEngine.physicsEngine.P2
        this.gameEngine = gameEngine
        let boxMaterial = gameEngine.materials.boxMaterial
        const { width, height, angle, position } = this

        let boxShape = new gameEngine.physicsEngine.P2.Box({
          width,
          height
        })

        let boxBody = new gameEngine.physicsEngine.P2.Body({
          mass: 1,
          angle,
          position:[position.x, position.y]
        })

        this.physicsObj = boxBody

        boxShape.material = boxMaterial
        boxBody.addShape(boxShape)

        this.gameEngine.physicsEngine.world.addBody(boxBody);

    }

    syncTo(other, options){
        super.syncTo(other);

        if (this.physicsObj)
            this.refreshToPhysics();
    }

    bendToCurrent(original, bending, worldSettings, isLocal, bendingIncrements) {
        super.bendToCurrent(original, bending, worldSettings, isLocal, bendingIncrements);

        if (this.physicsObj)
            this.refreshToPhysics();
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

module.exports = Box;
