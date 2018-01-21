'use strict';

const GameEngine = require('lance-gg').GameEngine;
const Box = require('./objects/Box');
const Char = require('./objects/Char');
const Floor = require('./objects/Floor');
const Platform = require('./objects/Platform');
const TwoVector = require('lance-gg').serialize.TwoVector;
const Serializable = require('lance-gg').serialize.Serializable;

let P2 = null;

class PlatformsGameEngine extends GameEngine {

    constructor(options){
        super(options);

        P2 = this.physicsEngine.P2;

        this.materials = {};

        this.physicsEngine.world.defaultContactMaterial.friction = 0.5;
        this.physicsEngine.world.setGlobalStiffness(1e5);

        this.physicsEngine.world.on('beginContact', function (evt){
            if(!evt.bodyA.isCharacter && !evt.bodyB.isCharacter) return;
            let otherBody = evt.bodyA.isCharacter ? evt.bodyB : evt.bodyA;
            let characterBody = evt.bodyA.isCharacter ? evt.bodyA : evt.bodyB;
            if(otherBody.isPlatform && otherBody.position[1] > characterBody.position[1]){
                characterBody.passThroughBody = otherBody;
            }
        });

        // Disable any equations between the current passthrough body and the character
        this.physicsEngine.world.on('preSolve', function (evt){
            for(var i=0; i<evt.contactEquations.length; i++){
                var eq = evt.contactEquations[i];
                if( (eq.bodyA.isCharacter && eq.bodyB === eq.bodyA.passThroughBody) || (eq.bodyB.isCharacter && eq.bodyA === eq.bodyB.passThroughBody) ){
                    eq.enabled = false;
                }
            }
            for(var i=0; i<evt.frictionEquations.length; i++){
                var eq = evt.frictionEquations[i];
                if( (eq.bodyA.isCharacter && eq.bodyB === eq.bodyA.passThroughBody) || (eq.bodyB.isCharacter && eq.bodyA === eq.bodyB.passThroughBody) ){
                    eq.enabled = false;
                }
            }
        });

        this.physicsEngine.world.on('endContact', function (evt){
            if (evt.bodyA.isCharacter && evt.bodyB === evt.bodyA.passThroughBody) evt.bodyA.passThroughBody = undefined;
            if (evt.bodyB.isCharacter && evt.bodyA === evt.bodyB.passThroughBody) evt.bodyB.passThroughBody = undefined;
        });

        // init materials
        let groundMaterial = this.materials.groundMaterial = new P2.Material(),
            characterMaterial = this.materials.characterMaterial = new P2.Material(),
            boxMaterial = this.materials.boxMaterial = new P2.Material();

        // Init contactmaterials
        var groundCharacterCM = new P2.ContactMaterial(groundMaterial, characterMaterial,{
            friction : 0.0 // No friction between character and ground
        });
        var boxCharacterCM = new P2.ContactMaterial(boxMaterial, characterMaterial,{
            friction : 0.0 // No friction between character and boxes
        });
        var boxGroundCM = new P2.ContactMaterial(boxMaterial, groundMaterial,{
            friction : 0.6 // Between boxes and ground
        });

        this.physicsEngine.world.addContactMaterial(groundCharacterCM);
        this.physicsEngine.world.addContactMaterial(boxCharacterCM);
        this.physicsEngine.world.addContactMaterial(boxGroundCM);

        this.on('server__init', this.gameInit.bind(this));
    }

    gameInit() {

        let floor = new Floor(++this.world.idCount, this, 0, -3);

        let box1 = new Box(++this.world.idCount, this, 2, 1);
        let box2 = new Box(++this.world.idCount, this, 0, 2);
        let box3 = new Box(++this.world.idCount, this, -2, 3);

        let platform1 = new Platform(++this.world.idCount, this, 2, 0);
        let platform2 = new Platform(++this.world.idCount, this, 0, 1);
        let platform3 = new Platform(++this.world.idCount, this, -2, 2);

        this.physicsEngine.world.on('postStep', function(){
            platform1.physicsObj.velocity[0] = 2*Math.sin(this.time);
            platform2.physicsObj.velocity[0] = 2*Math.sin(this.time);
            platform3.physicsObj.velocity[0] = 2*Math.sin(this.time);

            platform1.refreshFromPhysics();
            platform2.refreshFromPhysics();
            platform3.refreshFromPhysics();
        });

        this.addObjectToWorld(floor);

        this.addObjectToWorld(box1);
        this.addObjectToWorld(box2);
        this.addObjectToWorld(box3);

        this.addObjectToWorld(platform1);
        this.addObjectToWorld(platform2);
        this.addObjectToWorld(platform3);
    }

    start() {
        let that = this;
        super.start();

    };

    step(isReenact) {
        super.step(isReenact);

        this.world.forEachObject((id, o) => {

            // remove velocity for all moved Char's
            if(o.class == Char && o.physicsObj.velocity[0] != 0){
                o.physicsObj.velocity[0] = 0
                o.refreshFromPhysics();
            }

        });
    }

    createChar(playerId){
        let char = new Char(++this.world.idCount, this, 0, 3);
        char.playerId = playerId;
        this.addObjectToWorld(char);
    }

    removeChar(playerId){
        let char = this.world.getPlayerObject(playerId);
        if (char) {
            this.removeObjectFromWorld(char.id);
        }
    }

    processInput(inputData, playerId) {

        super.processInput(inputData, playerId);

        let walkSpeed = 2, jumpSpeed = 6;

        let char = this.world.getPlayerObject(playerId);

        if (char) {
            // this condition allow multiples jumps keeping the jump button pressed
            // if you want the P2 example jump, needs handle when up stops and allow jump just when toggle to up
            if (inputData.input == 'up' && char.canJump()) {
                char.physicsObj.velocity[1] = jumpSpeed;
            }

            if (inputData.input == 'right' || inputData.input == 'left') {
                // to keep P2 example functionallity we apply velocity for a single step
                // we set it here , and remove them after super.step is processed
                char.physicsObj.velocity[0] = inputData.input == 'right' ? walkSpeed : -walkSpeed;
            }

            char.refreshFromPhysics();
        }
    };

}

module.exports = PlatformsGameEngine;
