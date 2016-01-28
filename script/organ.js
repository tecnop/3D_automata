var OrganHelper = {
	addRandomOrganTo : function(entity){

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
	default : function(data){
		var me = this;

		this.name = "TEETH";
		this.relativePosition = new THREE.Vector3(0, 0, 90);

		this.mouthLeft = new THREE.Mesh(
			new THREE.BoxGeometry(10, 20, 80),
			new THREE.MeshLambertMaterial({
				color: new THREE.Color( 1, 0, 0 ),
			})
		);
		this.mouthRight = new THREE.Mesh(
			new THREE.BoxGeometry(10, 20, 80),
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

		this.onEntityAdd = function(entity){

		}

		this.Update = function() {

		
			if (me.openingMouth){
				me.mouthLeft.rotation.y -= 0.02;
				me.mouthRight.rotation.y += 0.02;

				if (me.mouthRight.rotation.y > 0.40){
					me.openingMouth = false;
				}
			}
			else {

				me.mouthLeft.rotation.y += 0.06;
				me.mouthRight.rotation.y -= 0.06;

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
	default : function(data){
		var me = this;

		this.name = "BODY";
		this.relativePosition = new THREE.Vector3(0, 0,-100);

		var boxGeometry = new THREE.BoxGeometry(6, 18, 90);

		var count = 5,
			radius = 25,
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
		
		
		this.onEntityAdd = function(entity){

		}

		this.Update = function() {

			me.object.rotation.z += 0.01;
			
			//console.log(this.mouthLeft.rotation.y);

			/*this.mouthUp.position.x = this.mouthUp.position.x <= 0 ?
			this.mouthDown*/
		}
	}
}

var Head = {
	default : function(data){
		var me = this;

		this.growing = true;

		this.name = "HEAD";
		this.relativePosition = new THREE.Vector3(0, 50, 0);

		var sphereGeometry = new THREE.SphereGeometry( 5, 32, 32 ),
			geometry = new THREE.CylinderGeometry( 1, 8, 50, 16 );

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
		
		this.onEntityAdd = function(entity){

		}

		this.Update = function() {

			if (me.growing){
				me.antenaRightSphere.scale.x += 0.05;
				me.antenaRightSphere.scale.y += 0.05;
				me.antenaRightSphere.scale.z += 0.05;

				me.antenaLeftSphere.scale.x += 0.05;
				me.antenaLeftSphere.scale.y += 0.05;
				me.antenaLeftSphere.scale.z += 0.05;

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
	default : function(data){
		var me = this;

		this.upping = true;

		this.name = "HEAD";
		this.relativePosition = new THREE.Vector3(50, 0, 0);

		var geometry = new THREE.BoxGeometry(40, 4, 20);

		// Left
		this.object = new THREE.Mesh(
			geometry,
			new THREE.MeshLambertMaterial({
				color: new THREE.Color( 1, 0, 0 ),
			})
		);

		
		this.onEntityAdd = function(entity){

		}

		this.Update = function() {
			

			if (me.upping){
				me.object.rotation.z += 0.02;

				if (me.object.rotation.z >= 0.50){
					me.upping = false;
				}
			}
			else {
				me.object.rotation.z -= 0.02;

				if (me.object.rotation.z <= 0){
					me.upping = true;
				}

			}

			
			
		}
	}
}

Organ.prototype = {
	ID : 0,
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
	key : "teeth-default-" + (++Organ.ID)
});

Body.default.prototype = new Organ({
	organIndex : 1,
	key : "body-default-" + (++Organ.ID)
});

Head.default.prototype = new Organ({
	organIndex : 2,
	key : "head-default-" + (++Organ.ID)
});

LeftPart.default.prototype = new Organ({
	organIndex : 3,
	key : "head-default-" + (++Organ.ID)
});

/*
eyes.default.prototype = new Organ({
	organIndex : 1,
	key : "eyes-default-" + (++Organ.ID),
	updateFunctions : [
		null
	],
});*/