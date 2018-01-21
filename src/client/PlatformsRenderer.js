'use strict';

const Renderer = require('lance-gg').render.Renderer;
const Utils= require('./../common/Utils');

const Char = require('./../common/objects/Char');

class PlatformsRenderer extends Renderer {

    constructor(gameEngine, clientEngine) {
        super(gameEngine, clientEngine);

        this.sprites = {};

        this.zoom = 50;
    }

    init() {
        return super.init().then(() => {
            let canvas = this.canvas = document.getElementById("myCanvas");
            let ctx = this.ctx = canvas.getContext("2d");
            ctx.lineWidth = 1/this.zoom;
        });
    }

    drawBox(object){
        let body = object.physicsObj || object;
        this.ctx.fillStyle = object.color;
        this.ctx.beginPath();
        /*var x = body.position[0],
            y = body.position[1],
            s = body.shapes[0];*/
        var x = object.position.x, // body.position[0], //.x || object.position_x,
            y = object.position.y, // body.position[1], //.y || object.position_y,
            w = object.width,
            h = object.height;
        this.ctx.save();
        this.ctx.translate(x, y);     // Translate to the center of the box
        //this.ctx.rotate(body.angle);  // Rotate to the box body frame
        this.ctx.rotate(object.angle);  // Rotate to the box body frame
        this.ctx.fillRect(-w/2, -h/2, w, h);
        this.ctx.restore();
    }

    draw() {
        super.draw();

        let w = this.canvas.width, h = this.canvas.height;

        // Clear the canvas
        this.ctx.clearRect(0,0,w,h);

        // Transform the canvas
        // Note that we need to flip the y axis since Canvas pixel coordinates
        // goes from top to bottom, while physics does the opposite.
        this.ctx.save();
        this.ctx.translate(w/2, h/2);  // Translate to the center
        this.ctx.scale(this.zoom, -this.zoom);   // Zoom in and flip y axis

        // Draw all bodies
        this.ctx.strokeStyle='none';

        for( var i in this.gameEngine.world.objects ){
            this.drawBox(this.gameEngine.world.objects[i]);
        }

        // Restore transform
        this.ctx.restore();
    }

}

// convenience function
function qs(selector) { return document.querySelector(selector);}

function truncateDecimals(number, digits) {
    let multiplier = Math.pow(10, digits);
    let adjustedNum = number * multiplier;
    let truncatedNum = Math[adjustedNum < 0 ? 'ceil' : 'floor'](adjustedNum);

    return truncatedNum / multiplier;
};

function isMacintosh() {
    return navigator.platform.indexOf('Mac') > -1;
}

function isWindows() {
    return navigator.platform.indexOf('Win') > -1;
}

module.exports = PlatformsRenderer;
