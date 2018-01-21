'use strict';

const Serializer = require('lance-gg').serialize.Serializer;
const DynamicObject = require('lance-gg').serialize.DynamicObject;
const TwoVector = require('lance-gg').serialize.TwoVector;

let P2 = null;

class Char extends DynamicObject {

    constructor(id, gameEngine, x, y) {
        super(id, new TwoVector(x, y));
        this.class = Char;
        this.gameEngine = gameEngine;

        this.width = 0.5;
        this.height = 1;
        this.color = 'red';
    };

    canJump() {
        var result = false;
        for( var i in this.gameEngine.physicsEngine.world.narrowphase.contactEquations ){
            var c = this.gameEngine.physicsEngine.world.narrowphase.contactEquations[i];
            if(c.bodyA === this.physicsObj || c.bodyB === this.physicsObj){
                var d = P2.vec2.dot(c.normalA, P2.vec2.fromValues(0,1)); // Normal dot Y-axis
                if(c.bodyA === this.physicsObj) d *= -1;
                if(d > 0.5) result = true;
            }
        }
        return result;
    }

    onAddToWorld(gameEngine) {

        P2 = gameEngine.physicsEngine.P2;

        this.gameEngine = gameEngine;

        let characterMaterial = this.gameEngine.materials.characterMaterial;
        let characterShape = new this.gameEngine.physicsEngine.P2.Box({ width: this.width, height: this.height });
        let characterBody = this.physicsObj = new this.gameEngine.physicsEngine.P2.Body({
            mass: 1,
            angle: 0,
            position:[this.position.x, this.position.y],
            fixedRotation: true,
        });
        characterBody.addShape(characterShape);

        characterShape.material = characterMaterial;
        characterBody.damping = 0.5;
        characterBody.isCharacter = true;

        this.gameEngine.physicsEngine.world.addBody(characterBody);

    }

    destroy() {
        this.gameEngine.physicsEngine.removeObject(this.physicsObj);
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

module.exports = Char;
