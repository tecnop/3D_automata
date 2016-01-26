var ThreeWrapper = function (data){
	this.inject(data);
}
ThreeWrapper.prototype  = {
	// Camera attributes
	MAX_Z : 5000,
	VIEW_ANGLE : 45,
	NEAR : 1,
	FAR : 100000,
	CAMERA_Z : 1300,
	// Entity
	count : 1,
	Z_GAP : 300,
	Z_STEP : 3,
	MIN_SPEED : 25,
	MAX_SPEED : 25,
	MIN_DEPTH : 10,
	MAX_DEPTH : 10,
	//
	GENETICS_ITERATION : 40,
	//
	currentStep : 0,
	startDelay : 2,
	gridStep : 20,
	paused : false,
	entitiesSpeedFactor : 1,
	entitiesManager : null,
	globalRest : {
		topLeft : {
			x : 0,
			y : 0
		},
		bottomRight : {
			x : 0,
			y : 0
		}
	},
	inject : function(data){

		this.evaluateMode = false;
		this.currentStep = this.Z_GAP;
		this.size = data.size || {width : 800, height : 600};
		this.imagePlaneSize = data.imagePlaneSize || {width : 800, height : 600};
		this.paused = data.paused || false;

		this.container = $('<div style="width:' + this.size.width + 'px;height:' + this.size.height + 'px;">');
		
		this.orbitContainer = data.orbitContainer;

		this.aspect = this.size.width / this.size.height;
		this.scenes = {};
		this.cameras = {};
		this.entities = {
			map : {},
			list : [],
			add : function(entity){
				this.map[entity.key] = entity;
				this.list.push(entity);
			}
		};

		data.container.append(this.container);

		this.initThree();
	},
	initThree : function(){
		var me = this;
		THREE.ImageUtils.crossOrigin = "anonymous"; 

		me.renderer = new THREE.WebGLRenderer();

		me.cameras.main = new THREE.PerspectiveCamera(
			me.VIEW_ANGLE,
			me.aspect,
			me.NEAR,
			me.FAR
		);

		me.scenes.main = new THREE.Scene();


		var controls = new THREE.OrbitControls( me.cameras.main , me.orbitContainer || document);


		me.scenes.main.add(me.cameras.main);

		me.cameras.main.position.z = me.CAMERA_Z;

		me.renderer.setSize(me.size.width, me.size.height);

		me.container.append(me.renderer.domElement);

		var pointLight = new THREE.PointLight(0xFFFFFF);

		// set its position
		pointLight.position.x = 0;
		pointLight.position.y = 0;
		pointLight.position.z = 3000;

		me.pointLight = pointLight;

		// add to the scene
		me.scenes.main.add(pointLight);

		// add "sky box"
		me.scenes.main.add(
			new THREE.Mesh(
				new THREE.SphereGeometry(6000, 32, 32), 
					new THREE.MeshLambertMaterial({
						color: new THREE.Color( 0, 0, 0.5 ),
						side : THREE.BackSide
					})
			)
		);
	},
	reset : function(newParams){

		console.log("#Reset : ", newParams);

		//this.Z_STEP = 0.1;
		this.currentStep = this.Z_GAP;
		this.gridStep = newParams.step || this.gridStep;

		this.grid.clear(this);
		
		delete this.grid;

		this.grid = new Grid({
			step : this.gridStep,
			imagePlaneWrapper : this.imagePlaneWrapper
		});

		for (var k in this.entitiesManager.entities){
			this.entitiesManager.entities[k].removeFromScene(this.scenes.main);
		}

		this.entitiesManager.clear();

		this.initSquaredEntities({count : newParams.count || this.count})
	},
	// Doesnt work with negative range .. (as -10 -> 10).
	getRandomPositionInRect : function(rect, z){
		return new THREE.Vector3(
			Math.floor(Math.random() * (rect.topLeft.x - rect.bottomRight.x + 1)) + rect.topLeft.x,
			Math.floor(Math.random() * (rect.bottomRight.y - rect.topLeft.y + 1)) + rect.bottomRight.y,
			z
		);
	},
	// TO USE
	changeFramerate : function(time){
		var me = this;
		me.stop();
		me.start();
	},
	speedUp : function(){
		this.entitiesSpeedFactor *=2 ;
	},
	slowDown : function(){
		this.entitiesSpeedFactor /= 2;
	},
	pause : function(){
		if (this.paused){
			this.start();
		}
		else {
			this.stop();
		}
	},
	start : function(){
		this.paused = false;
		this.render();
	},
	stop : function(){
		this.paused = true;
	},
	/** Debug / Test methods **/	
	createRandomCude : function() {

		this.testObject = new Entity();

		this.entities.add(this.testObject);
		this.scenes.main.add(this.testObject.object);


	},
	addOrganTo : function(entity){
		entity.addOrgan();
	},
	getRandomVectorInCube : function(vector, depth){
		var x = Math.floor(Math.random() * (depth - (depth*-1) +1 ) ) + (depth*-1);

		var y = Math.floor(Math.random() * (depth - (depth*-1) +1 ) ) + (depth*-1);

		var z = Math.floor(Math.random() * (depth - (depth*-1) +1 ) ) + (depth*-1);

		return new THREE.Vector3(vector.x + x, vector.y + y, vector.z + z);
	},
	/** END **/
	render : function(){
		var me = this,
			fakeVector = new THREE.Vector3(0,0,0);

		function run () {

			if(me.paused)
				return;

			// ref :
			// http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
			requestAnimationFrame(run);


			
			for (var i = 0, len = me.entities.list.length; i < len; ++i) {
				
				//for (var i = 0, len = me.entities.list[i].actions.continuous.length; i<len; ++i ) {
				//	me.entities.list[i].actions.continuous[i](me);
				//}

				

				if(me.entities.list[i].destination) {
					var vec = fakeVector.subVectors(
						me.entities.list[i].destination,
						me.entities.list[i].getPosition()
					);

					if( (me.entities.list[i].speed * me.entitiesSpeedFactor) >= me.entities.list[i].destination.distanceTo(me.entities.list[i].getPosition())){
						me.entities.list[i].setPosition(me.entities.list[i].destination);
						
						
						var destination = new THREE.Vector3(
							me.entities.list[i].destination.x,
							me.entities.list[i].destination.y,
							me.entities.list[i].destination.z
						);

						me.entities.list[i].destination = null;
						me.entities.list[i].onDestinationReach(me, destination);

					}
					else {
						// Reduce speed for entities on validations
						if (me.entities.list[i].onValidation){

							me.entities.list[i].add(
								vec.normalize().multiply(
									new THREE.Vector3(
										(me.entities.list[i].speed / 4) * me.entitiesSpeedFactor,
										(me.entities.list[i].speed / 4) * me.entitiesSpeedFactor,
										(me.entities.list[i].speed / 4) * me.entitiesSpeedFactor
									)
								)
							);
						}
						else {
							me.entities.list[i].add(
								vec.normalize().multiply(
									new THREE.Vector3(
										me.entities.list[i].speed * me.entitiesSpeedFactor,
										me.entities.list[i].speed * me.entitiesSpeedFactor,
										me.entities.list[i].speed * me.entitiesSpeedFactor
									)
								)
							);
						}
					}
				}

			}
			

			me.pointLight.position.copy(me.cameras.main.position);

			me.renderer.render(me.scenes.main, me.cameras.main);
		}

		
		
		run();
	}

}


// shim layer with setTimeout fallback
/*
window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame       ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame    ||
		function( callback ){
			window.setTimeout(callback, 1000 / 60);
	};
})();
*/