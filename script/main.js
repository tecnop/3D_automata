$(document).ready(function()  {
	
	console.log("super");

	var threeWrapper = new ThreeWrapper({
		container : $('#main-canvas'),
		paused : false,
		size : {
			width : $(document).width(),
			height : $(document).height(),
		},
		orbitContainer : document.getElementById( 'main-canvas' ),
		
	});

	threeWrapper.render();

	/*
	 * Inputs
	 */

	$(document).on('keypress', function(e){

		// t
		if (e.charCode == 116){
			threeWrapper.createRandomCude();
		}
		//z
		else if (e.charCode == 122){
			threeWrapper.testObject.destination = threeWrapper.getRandomVectorInCube(threeWrapper.testObject.object.position, 500);
		}
		//s
		else if (e.charCode == 115){
			
		}
		//q
		else if (e.charCode == 113){
			
		}
		//d
		else if (e.charCode == 100){
			
		}
		// +
		else if (e.charCode == 43){
			threeWrapper.speedUp();
		}
		// -
		else if (e.charCode == 45){
			threeWrapper.slowDown();
		}
		// o
		else if (e.charCode == 111){
			threeWrapper.addOrganTo(threeWrapper.testObject);
		}
		else {
			console.log(e.charCode);
		}
		

	});

});

THREE.StaticShader = {

	uniforms: {

		"tDiffuse": { type: "t", value: null },
		"time":     { type: "f", value: 0.0 },
		"amount":   { type: "f", value: 0.5 },
		"size":     { type: "f", value: 4.0 }
	},

	vertexShader: [

	"varying vec2 vUv;",

	"void main() {",

		"vUv = uv;",
		"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

	"}"

	].join("\n"),

	fragmentShader: [

	"uniform sampler2D tDiffuse;",
	"uniform float time;",
	"uniform float amount;",
	"uniform float size;",

	"varying vec2 vUv;",

	"float rand(vec2 co){",
		"return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);",
	"}",

	"void main() {",
		"vec2 p = vUv;",
		"vec4 color = texture2D(tDiffuse, p);",
		"float xs = floor(gl_FragCoord.x / size);",
		"float ys = floor(gl_FragCoord.y / size);",
		"vec4 snow = vec4(rand(vec2(xs * time,ys * time))*amount);",

		//"gl_FragColor = color + amount * ( snow - color );", //interpolate

		"gl_FragColor = color+ snow;", //additive

	"}"

	].join("\n")

};

