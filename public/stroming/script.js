// requestAnim shim layer by Paul Irish
window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame       ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame    ||
			window.oRequestAnimationFrame      ||
			window.msRequestAnimationFrame     ||
			function(/* function */ callback, /* DOMElement */ element){
				window.setTimeout(callback, 1000 / 60);
			};
})();

function cosh(x){
	return (Math.exp(x) + Math.exp(-x))/2
}

function sinh(x){
	return (Math.exp(x) - Math.exp(-x))/2
}


// example code from mr doob : http://mrdoob.com/lab/javascript/requestanimationframe/

var canvas, context;
var k=Math.PI/179, A=16;
var omega = Math.sqrt(9.81*k);
var h=256;

init();
animate();

function init() {

	canvas = document.createElement( 'canvas' );
	canvas.id = 'canvas';
	canvas.width = 700;
	canvas.height = 512;

	context = canvas.getContext( '2d' );

	document.body.appendChild( canvas );

}

function animate() {
	requestAnimFrame( animate );
	draw();
}

function draw() {

    var time = new Date().getTime() * 0.002;
    var x0,z0,x,z;

    context.clearRect(0, 0, canvas.width, canvas.height);

    context.save();
    context.translate(120,160);

    for(x0=0; x0<=512; x0+=16){
		for(z0=0; z0<=256; z0+=16){
			x = -A*k*Math.exp(k*(256-z0))*Math.sin(k*x0-omega*time);
			z = A*k*Math.exp(k*(256-z0))*Math.cos(k*x0-omega*time);

			context.fillStyle = "#DDD";
			context.strokeStyle = "#DDD";
			context.beginPath();
			context.arc(x0,z0,1,0,Math.PI*2,true);
			context.closePath();
			context.fill();

			context.beginPath();
			context.moveTo(x0,z0);
			context.lineTo(x0+x,z0+z);
			context.stroke();

			context.fillStyle = "#000";
			context.beginPath();
			context.arc(x+x0, z+z0, 3, 0, Math.PI*2, true);
			context.closePath();
			context.fill();
		}
    }

    context.restore();
}