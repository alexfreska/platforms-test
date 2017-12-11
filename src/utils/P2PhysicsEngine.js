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

		/*let world = this.world = new CANNON.World();
		world.quatNormalizeSkip = 0;
		world.quatNormalizeFast = false;
		world.gravity.set(0, -10, 0);
		world.broadphase = new CANNON.NaiveBroadphase();
		this.CANNON = CANNON;*/
	}

	// entry point for a single step of the Simple Physics
	step(dt, objectFilter) {
		this.world.step(dt || this.options.dt);
	}

	// Compute elapsed time since last render frame
	// var deltaTime = lastTime ? (time - lastTime) / 1000 : 0;

	// Move bodies forward in time
	// world.step(fixedTimeStep, deltaTime, maxSubSteps);


	/*addSphere(radius, mass) {
		let shape = new CANNON.Sphere(radius);
		let body = new CANNON.Body({ mass, shape });
		body.position.set(0, 0, 0);
		this.world.addBody(body);
		return body;
	}

	addBox(x, y, z, mass, friction) {
		let shape = new CANNON.Box(new CANNON.Vec3(x, y, z));
		let options = { mass, shape };
		if (friction !== undefined)
			options.material = new CANNON.Material({ friction });

		let body = new CANNON.Body(options);
		body.position.set(0, 0, 0);
		this.world.addBody(body);
		return body;
	}

	addCylinder(radiusTop, radiusBottom, height, numSegments, mass) {
		let shape = new CANNON.Cylinder(radiusTop, radiusBottom, height, numSegments);
		let body = new CANNON.Body({ mass, shape });
		this.world.addBody(body);
		return body;
	}*/

	removeObject(obj) {
		this.world.removeBody(obj);
	}
}

module.exports = P2PhysicsEngine;