var ThreeWrapper = function (data){
	this.inject(data);
}
ThreeWrapper.prototype  = {
	//Box size
	BOX_SIZE : 18000,
	
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
		this.clock = new THREE.Clock();
		var threeWrapperCtx = this;

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
		
		/*this.particleGroup = new SPE.Group({
			texture: {
				value: THREE.ImageUtils.loadTexture('./images/smokeparticle.png')
			}
		});
		this.emitter = new SPE.Emitter({
			maxAge: {
				value: 2
			},
			position: {
				value: new THREE.Vector3(0, 0, -50),
				spread: new THREE.Vector3( 0, 0, 0 )
			},
			acceleration: {
				value: new THREE.Vector3(0, -10, 0),
				spread: new THREE.Vector3( 10, 0, 10 )
			},
			velocity: {
				value: new THREE.Vector3(0, 25, 0),
				spread: new THREE.Vector3(10, 7.5, 10)
			},
			color: {
				value: [ new THREE.Color('white'), new THREE.Color('red') ]
			},
			size: {
				value: 100
			},
			particleCount: 2000
		});
		
		this.particleGroup.addEmitter(this.emitter);*/
		
		this.entities = {
			map : {},
			list : [],
			add : function(entity){
				var entitiesCtx = this;

				this.map[entity.key] = entity;
				this.list.push(entity);

				var index = this.list.length - 1;

				entity.removeFromScene = function(){

					//console.log("list["+index+"] : ", entitiesCtx.list[index] , "map[" + entity.key + "] : ", entitiesCtx.map[entity.key])
					
					entitiesCtx.list.splice(index);
					delete entitiesCtx.map[entity.key];

					// Delete collider
					if (entity.SphereCollider.debugObject){
						threeWrapperCtx.scenes.main.remove(entity.SphereCollider.debugObject);
					}

					// Delete organs
					entity.organs.each(function(i, organ){
						organ.delete();
					});

					// Delete entity object
					threeWrapperCtx.scenes.main.remove(entity.object);
				}
			}
		};

		this.foods = {
			map : {},
			list : [],
			add : function(food){
				food.index = this.list.length -1;
				this.map[food.key] = food;
				this.list.push(food);
				food.removeFromScene = function() {

					threeWrapperCtx.scenes.main.remove(food.object);

					/*if(food.SphereCollider.debugObject){
						threeWrapperCtx.scenes.main.remove(food.SphereCollider.debugObject);
					}*/
					threeWrapperCtx.foods.remove(food);
				}
			},
			remove : function(food){
				var index = -1;
				for (var i = 0; i < this.list.length; ++i){
					if (this.list[i].key == food.key){
						index = i;
						break;
					}
				}
				
				if (index != -1)
					this.list.splice(index);

				delete this.map[food.key];
			}
		};

		data.container.append(this.container);

		this.initThree();
	},
	initThree : function(){
		var me = this;
		THREE.ImageUtils.crossOrigin = "anonymous"; 

		this.clock = new THREE.Clock();

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

		//me.scenes.main.add(me.particleGroup.mesh);
		
		// add to the scene
		me.scenes.main.add(pointLight);

		this.skyDomeMaterial = new THREE.ShaderMaterial( {
		    uniforms: {  
		    	factor : {
		    		type : 'f',
		    		value : 0.0
		    	},
		    },
			vertexShader:   document.getElementById( 'vertexShader'   ).textContent,
			fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
			side: THREE.BackSide,
			blending: THREE.AdditiveBlending,
			transparent: true,
		});

		// add "sky box"
		me.scenes.main.add(
			new THREE.Mesh(
				new THREE.SphereGeometry(11000, 32, 32), 
					this.skyDomeMaterial
					/*new THREE.MeshLambertMaterial({
						color: new THREE.Color( 0, 0, 0.5 ),
						side : THREE.BackSide
					})*/
			)
		);
		
		
		//Food Initialization
		var average = me.BOX_SIZE/2,
			currFoodCount = 0,
			foodCount = 200;

		this.foodInterval = setInterval(function(){

			if (me.foods.list.length < 200) {

				var newFood = new Food(getRandomVectorInCube(), "NEWTYPE");
				me.foods.add(newFood);
				me.scenes.main.add(newFood.object);
				//me.scenes.main.add(newFood.SphereCollider.debugObject);
				
			}

		}, 1000);

		for(var i=0; i < 30; ++i) {
			var newFood = new Food(getRandomVectorInCube(), "NEWTYPE");

			me.foods.add(newFood);
			this.scenes.main.add(newFood.object);
			//this.scenes.main.add(newFood.SphereCollider.debugObject);

		}
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
		this.entitiesSpeedFactor *= 2;
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
		var redColor = Math.random();
		var greenColor = Math.random();
		var blueColor = Math.random();
	
		var testObject = new Entity("1;1;10;" + redColor + ";" + greenColor + ";"+ blueColor +";100000"); //Si on veut créer un CSV de config pour générer des entitées facilement

		this.addOrganTo(
			Mouth.random(),
			testObject
		);

		/*this.addOrganTo(
			new Head.default(),
			testObject
		);

		this.addOrganTo(
			new Body.sphere(),
			testObject
		);

		this.addOrganTo(
			new LeftPart.default(),
			testObject
		);

		this.addOrganTo(
			new RightPart.default(),
			testObject
		);*/

		this.entities.add(testObject);
		this.scenes.main.add(testObject.object);
		
		this.scenes.main.add(testObject.particleGroup.mesh);
		//this.particleGroup.addEmitter(testObject.emitter);
		
		//this.scenes.main.add(testObject.particuleEngine.particleMesh);
		//A virer
		//this.scenes.main.add(testObject.SphereCollider.debugObject);

		/*
		var s = Math.floor(Math.random() * (3 - 1)) + 1;
		testObject.setScale(new THREE.Vector3(s,s,s));
		*/

		//console.log("Nb entities : " + this.entities.list.length);
	},
	/*createParticuleEngine : function()
	{
		this.particuleEngine = new ParticleEngine();
		this.particuleEngine.setValues( Examples.smoke );
		this.particuleEngine.initialize(this.scenes.main);
		
		//this.scenes.main.add(this.particuleEngine.particleMesh);
	},*/
	/** END **/
	addOrganTo : function(organ, entity){
		var threeWrapperCtx = this;

		this.scenes.main.add(organ.getObject());
		entity.addOrgan(organ);

		organ.removeFromScene = function(){
			threeWrapperCtx.scenes.main.remove(organ.getObject());
		}
	},
	render : function(){
		var me = this,
			fakeVector = new THREE.Vector3(0,0,0);

		function run () {

			if(me.paused)
				return;
			
			me.skyDomeMaterial.uniforms.factor.value = me.clock.getElapsedTime() % 1000000;

			// ref :
			// http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
			requestAnimationFrame(run);
			
			
			//me.particleGroup.tick(me.clock.getDelta());
			
			//
			//Update Logic des entitées
			//A supprimer si tu penses qu'on peut update les caractéristique en même temps que les positions 
			for (var i = 0, len = me.entities.list.length; i < len; ++i) {
				me.entities.list[i].Update(me, me.entities.list[i]);
			}
			
			for (var i = 0, len = me.entities.list.length; i < len; ++i) {
				
				// Organs update
				me.entities.list[i].organs.each(function(i, organ){
					organ.Update(me);
				});

				if(me.entities.list[i].destination) {

					me.entities.list[i].lookAt(me.entities.list[i].destination);

					var vec = fakeVector.subVectors(
						me.entities.list[i].destination,
						me.entities.list[i].getPosition()
					);

					if( (me.entities.list[i].Caracteristique.speed * me.entitiesSpeedFactor) >= me.entities.list[i].destination.distanceTo(me.entities.list[i].getPosition())){
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
						me.entities.list[i].add(
							vec.normalize().multiply(
								new THREE.Vector3(
									me.entities.list[i].Caracteristique.speed * me.entitiesSpeedFactor,
									me.entities.list[i].Caracteristique.speed * me.entitiesSpeedFactor,
									me.entities.list[i].Caracteristique.speed * me.entitiesSpeedFactor
								)
							)
						);
					}
				}
				
			}
		
			for (var i = 0, len = me.entities.list.length; i < len; ++i) {
				/*for(var j = i+1, len2 = me.entities.list.length; j < len2; ++j){
					if(me.entities.list[i].SphereCollider.CheckCollision(me.entities.list[j]))
						me.entities.list[i].OnCollision(me.entities.list[j]);
				}*/
				for(var k =0,  len3 = me.foods.list.length; k < len3; ++k)
				{
					if (me.foods.list[k].isAlive){
						if(me.entities.list[i].SphereCollider.CheckCollision(me.foods.list[k]))
							me.entities.list[i].OnCollision(me.foods.list[k]);
					}
				}
			}
			
			//Render function
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