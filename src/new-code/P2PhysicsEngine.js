'use strict';
const PhysicsEngine = require('lance-gg').physics.PhysicsEngine;
const P2 = require('p2');

/**
 * CannonPhysicsEngine is a three-dimensional lightweight physics engine
 */
class P2PhysicsEngine extends PhysicsEngine {

	init(options) {
		super.init(options);

		this.options.dt = this.options.dt || (1 / 60);

		this.P2 = P2;

		// Create a physics world, where bodies and constraints live
		let world = this.world = new P2.World({
			gravity:[0, -9.82]
		});

	}

	// entry point for a single step of the Simple Physics
	step(dt, objectFilter) {
		this.world.step(dt || this.options.dt);
	}

	/*addBox(options){
		// width: required
		// height: required
		// mass: required
		// angle: optional
		// material: boxMaterial,
		// x: optional
		// y: optional

		let boxMaterial = this.gameEngine.materials.boxMaterial;

		let boxShape = new P2.Box({
			width: options.width,
			height: options.height
		})

		boxShape.material = boxMaterial;

		let boxBody = this.physicsObj = new P2.Body({
			mass: options.mass,
			angle: options.angle || 0 ,
			position: [options.x || 0, options.y || 0]
		});

		boxBody.addShape(boxShape);

		this.world.addBody(boxBody);

		return boxBody;
	}*/

	removeObject(obj) {
		this.world.removeBody(obj);
	}

}

module.exports = P2PhysicsEngine;