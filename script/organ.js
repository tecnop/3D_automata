var OrganHelper = {
	getRandomOrganFor : function(entity){

		var slots =[];

		for (var i = 0; i < entity.organs.list.length; ++i){
			if (!entity.organs.list[i]){
				slots.push(i);
			}
		}

		var index = Math.floor(Math.random() * slots.length),
			choosenOne = slots[index];


		if (choosenOne == 0){
			return Mouth.random();
		}
		else if (choosenOne == 1){
			return Body.random();
		}
		else if (choosenOne == 2){
			return Head.random();
		}
		else if (choosenOne == 3){
			return LeftPart.random();
		}
		else if (choosenOne == 4){
			return RightPart.random();
		}

		return null;

	}
}

var Organ = function(data){
	this.key = data.key;
	this.organIndex = data.organIndex;

	if (data.updateFunction != null) {
		this.updateFunction = data.updateFunction;
	}

	this.depedencies = data.depedencies || [];
}

var Mouth = {
	random : function(){
		var rdm = Math.floor(Math.random() * 100);

		return new Mouth.default({
			depth : Math.floor(Math.random() * (180 - 50)) + 50,
		});

	},
	default : function(data){
		var me = this;
		this.meshes = [];
		this.name = "TEETH";
		this.relativePosition = new THREE.Vector3(0, 0, 90);

		this.mouthLeft = new THREE.Mesh(
			new THREE.BoxGeometry(10, 20, data.depth || 80),
			new THREE.MeshLambertMaterial({
				color: new THREE.Color( 1, 0, 0 ),
			})
		);
		this.mouthRight = new THREE.Mesh(
			new THREE.BoxGeometry(10, 20, data.depth || 80),
			new THREE.MeshLambertMaterial({
				color: new THREE.Color( 1, 0, 0 ),
			})
		);

		this.mouthLeft.position.x = -15;
		this.mouthRight.position.x = 15;

		/*this.object = new THREE.Mesh(
			new THREE.BoxGeometry(20, 20, 40), 
			new THREE.MeshLambertMaterial({
				color: new THREE.Color( 1, 0, 0 ),
			})
		);
*/
		this.object = new THREE.Object3D();

		this.object.add(this.mouthLeft);
		this.object.add(this.mouthRight);
		this.openingMouth = true;

		this.meshes.push(this.mouthRight, this.mouthLeft);

		this.onEntityAdd = function(entity){

			//entity.SphereCollider.radius += 100;
		}

		this.onEntityRemove = function(entity){

			//entity.SphereCollider.radius -= 100;

		}

		this.Update = function(threeWrapper) {

		
			if (me.openingMouth){
				me.mouthLeft.rotation.y -= 0.02 * threeWrapper.entitiesSpeedFactor;
				me.mouthRight.rotation.y += 0.02 * threeWrapper.entitiesSpeedFactor;

				if (me.mouthRight.rotation.y > 0.40){
					me.openingMouth = false;
				}
			}
			else {

				me.mouthLeft.rotation.y += 0.04 * threeWrapper.entitiesSpeedFactor;
				me.mouthRight.rotation.y -= 0.04 * threeWrapper.entitiesSpeedFactor;

				if (me.mouthRight.rotation.y <= -0.30){
					me.openingMouth = true;
				}
			}
			

			//console.log(this.mouthLeft.rotation.y);

			/*this.mouthUp.position.x = this.mouthUp.position.x <= 0 ?
			this.mouthDown*/
		}
	}
}

var Body = {
	random : function(){
		var rdm = Math.floor(Math.random() * 100),
			params = {
				count : Math.floor(Math.random() * (12 - 3)) + 3,
				radius : Math.floor(Math.random() * (80 - 20)) + 20,
				sphereRadius : Math.floor(Math.random() * (60 - 20)) + 20,
			};

		if( rdm >= 50){
			return new Body.default(params);
		}
		else {
			return new Body.sphere(params);
		}
		

	},
	default : function(data){
		var me = this;
		this.meshes = [];
		this.name = "BODY";
		this.relativePosition = new THREE.Vector3(0, 0,-100);

		var boxGeometry = new THREE.BoxGeometry(6, 18, 90);

		var count = data.count || 5,
			radius = data.radius || 25,
			meshes = [],
			currRotation = 0,
			step = 360 / count;

		for (var i = 0; i < count; ++i) {
			var bodyPart = new THREE.Mesh(
				boxGeometry,
				new THREE.MeshLambertMaterial({
					color: new THREE.Color( 1, 0, 0 ),
				})
			);
			bodyPart.position.x = Math.cos(currRotation * (Math.PI / 180 ) ) * radius;
			bodyPart.position.y = Math.sin(currRotation * (Math.PI / 180 ) ) * radius;

			

			bodyPart.rotation.z = currRotation * (Math.PI / 180 );

			meshes.push(bodyPart);

			currRotation += step;

		}

		this.object = new THREE.Object3D();

		for (var i = 0; i < meshes.length; ++i){
			this.object.add(meshes[i]);
		}
		
		this.meshes = meshes;
		
		this.onEntityAdd = function(entity){

			entity.Caracteristique.speed += 1;
		}

		this.onEntityRemove = function(entity){

			entity.Caracteristique.speed -= 1;
			
		}

		this.Update = function(threeWrapper) {

			me.object.rotation.z += 0.01 * threeWrapper.entitiesSpeedFactor;
			
			//console.log(this.mouthLeft.rotation.y);

			/*this.mouthUp.position.x = this.mouthUp.position.x <= 0 ?
			this.mouthDown*/
		}
	},
	sphere : function(data){
		var me = this;
		this.meshes = [];
		this.name = "BODY";
		this.relativePosition = new THREE.Vector3(0, 0,-100);

		var boxGeometry = new THREE.SphereGeometry( data.sphereRadius || 10, 16, 16 );

		var count = data.count || 8,
			radius = data.radius || 50,
			meshes = [],
			currRotation = 0,
			step = 360 / count;

		for (var i = 0; i < count; ++i) {
			var bodyPart = new THREE.Mesh(
				boxGeometry,
				new THREE.MeshLambertMaterial({
					color: new THREE.Color( 1, 0, 0 ),
				})
			);
			bodyPart.position.x = Math.cos(currRotation * (Math.PI / 180 ) ) * radius;
			bodyPart.position.y = Math.sin(currRotation * (Math.PI / 180 ) ) * radius;

			

			

			meshes.push(bodyPart);

			currRotation += step;

		}

		this.object = new THREE.Object3D();

		for (var i = 0; i < meshes.length; ++i){
			this.object.add(meshes[i]);
		}
		
		this.meshes = meshes;
		
		this.onEntityAdd = function(entity){

		}

		this.Update = function(threeWrapper) {

			me.object.rotation.z += 0.01 * threeWrapper.entitiesSpeedFactor;
			
			//console.log(this.mouthLeft.rotation.y);

			/*this.mouthUp.position.x = this.mouthUp.position.x <= 0 ?
			this.mouthDown*/
		}
	}
}

var Head = {
	random : function(){
		var rdm = Math.floor(Math.random() * 100);

		return new Head.default({
			depth : Math.floor(Math.random() * (100 - 50)) + 50,
		});

	},
	default : function(data){
		var me = this;
		this.meshes = [];
		this.growing = true;

		this.name = "HEAD";
		this.relativePosition = new THREE.Vector3(0, 50, 0);

		var sphereGeometry = new THREE.SphereGeometry( 5, 32, 32 ),
			geometry = new THREE.CylinderGeometry( 1, 8, data.depth || 50, 16 );

		// Left
		this.antenaLeftSphere = new THREE.Mesh(
			sphereGeometry,
			new THREE.MeshLambertMaterial({
				color: new THREE.Color( 1, 0, 0 ),
			})
		);
		this.antenaLeftSphere.position.y = 50;

		this.antenaLeft = new THREE.Mesh(
			geometry,
			new THREE.MeshLambertMaterial({
				color: new THREE.Color( 1, 0, 0 ),
			})
		);
		this.antenaLeft.position.x = -15;
		this.antenaLeft.rotation.z = 30 * (Math.PI / 180 );

		this.antenaLeft.add(this.antenaLeftSphere);

		// Right
		this.antenaRightSphere = new THREE.Mesh(
			sphereGeometry,
			new THREE.MeshLambertMaterial({
				color: new THREE.Color( 1, 0, 0 ),
			})
		);
		this.antenaRightSphere.position.y = 50;

		this.antenaRight = new THREE.Mesh(
			geometry,
			new THREE.MeshLambertMaterial({
				color: new THREE.Color( 1, 0, 0 ),
			})
		);
		this.antenaRight.position.x = 15;
		this.antenaRight.rotation.z = -30 * (Math.PI / 180 );

		this.antenaRight.add(this.antenaRightSphere);



		this.object = new THREE.Object3D();

		this.object.add(this.antenaLeft);
		this.object.add(this.antenaRight);
		
		this.meshes.push(this.antenaLeft, this.antenaLeftSphere	, this.antenaRight	, this.antenaRightSphere);
		this.onEntityAdd = function(entity){

		}

		this.Update = function(threeWrapper) {

			if (me.growing){
				me.antenaRightSphere.scale.x += 0.03;
				me.antenaRightSphere.scale.y += 0.03;
				me.antenaRightSphere.scale.z += 0.03;

				me.antenaLeftSphere.scale.x += 0.03;
				me.antenaLeftSphere.scale.y += 0.03;
				me.antenaLeftSphere.scale.z += 0.03;

				if (me.antenaRightSphere.scale.x >= 3){
					me.growing = false;
				}
			}
			else {
				me.antenaRightSphere.scale.x -= 0.2;
				me.antenaRightSphere.scale.y -= 0.2;
				me.antenaRightSphere.scale.z -= 0.2;

				me.antenaLeftSphere.scale.x -= 0.2;
				me.antenaLeftSphere.scale.y -= 0.2;
				me.antenaLeftSphere.scale.z -= 0.2;

				if (me.antenaRightSphere.scale.x <= 1){
					me.growing = true;
				}

			}

			
			
		}
	}
}

var LeftPart = {
	random : function(){
		var rdm = Math.floor(Math.random() * 100);

		return new LeftPart.default({
			
		});

	},
	default : function(data){
		var me = this;
		this.meshes = [];
		this.upping = true;

		this.name = "HEAD";
		this.relativePosition = new THREE.Vector3(50, 0, 0);

		var geometry = new THREE.BoxGeometry(40, 4, 60);

		// Left
		this.object = new THREE.Mesh(
			geometry,
			new THREE.MeshLambertMaterial({
				color: new THREE.Color( 1, 0, 0 ),
			})
		);

		this.meshes.push(this.object);
		
		this.onEntityAdd = function(entity){

		}

		this.Update = function(threeWrapper	) {
			

			if (me.upping){
				me.object.rotation.z += 0.02 * threeWrapper.entitiesSpeedFactor;

				if (me.object.rotation.z >= 0.50){
					me.upping = false;
				}
			}
			else {
				me.object.rotation.z -= 0.02 * threeWrapper.entitiesSpeedFactor;

				if (me.object.rotation.z <= 0){
					me.upping = true;
				}

			}

			
			
		}
	}
}

var RightPart = {
	random : function(){
		var rdm = Math.floor(Math.random() * 100);

		return new RightPart.default({
			
		});

	},
	default : function(data){
		var me = this;
		this.meshes = [];
		this.upping = true;

		this.name = "HEAD";
		this.relativePosition = new THREE.Vector3(-50, 0, 0);

		var geometry = new THREE.BoxGeometry(40, 4, 60);

		// Left
		this.object = new THREE.Mesh(
			geometry,
			new THREE.MeshLambertMaterial({
				color: new THREE.Color( 1, 0, 0 ),
			})
		);


		this.meshes.push(this.object);
		
		this.onEntityAdd = function(entity){

		}

		this.Update = function(threeWrapper	) {
			

			if (me.upping){
				me.object.rotation.z -= 0.02 * threeWrapper.entitiesSpeedFactor;

				if (me.object.rotation.z <= -0.50){
					me.upping = false;
				}
			}
			else {
				me.object.rotation.z += 0.02 * threeWrapper.entitiesSpeedFactor;

				if (me.object.rotation.z >= 0){
					me.upping = true;
				}

			}

			
			
		}
	}
}

Organ.prototype = {
	COUNT : 0,
	getName : function(){
		return this.name;
	},
	getRelativePosition : function(){
		return this.relativePosition;
	},
	getObject : function(){
		return this.object;
	},
	delete : function(){
		this.removeFromScene();
	},
	setColor : function	(color){
		for (var i = 0; i < this.meshes.length; ++i){
			if (this.meshes[i].material){
				this.meshes[i].material.color = color;
			}
		}
	},
	// OVERRIDE (from threeWrapper)
	removeFromScene : function(){
		console.warn(this.key + " : removeFromScene method must be overrided.")
	},
	// OVERRIDE
	onEntityAdd : function(entity){
		console.warn(this.key + " : onEntityAdd method must be overrided.")
	},
	// OVERRIDE
	onEntityRemove : function(entity){
		console.warn(this.key + " : onEntityRemove method must be overrided.")
	},
	// OVERRIDE
	Update : function(){

	}
}

Mouth.default.prototype = new Organ({
	organIndex : 0,
	key : "teeth-default-" + (++Organ.prototype.COUNT)
});

Body.default.prototype = new Organ({
	organIndex : 1,
	key : "body-default-" + (++Organ.prototype.COUNT)
});

Body.sphere.prototype = new Organ({
	organIndex : 1,
	key : "body-sphere-" + (++Organ.prototype.COUNT)
});

Head.default.prototype = new Organ({
	organIndex : 2,
	key : "head-default-" + (++Organ.prototype.COUNT)
});

LeftPart.default.prototype = new Organ({
	organIndex : 3,
	key : "leftpart-default-" + (++Organ.prototype.COUNT)
});

RightPart.default.prototype = new Organ({
	organIndex : 4,
	key : "rightpart-default-" + (++Organ.prototype.COUNT)
});
/*
eyes.default.prototype = new Organ({
	organIndex : 1,
	key : "eyes-default-" + (++Organ.ID),
	updateFunctions : [
		null
	],
});*/