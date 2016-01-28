var Organ = function(data){
	this.key = data.key;
	this.organIndex = data.organIndex;
	if(data.updateFunction != null)
		this.updateFunction = data.updateFunction;
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
		this.apply = function(entity){

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
	// OVERRIDE
	removeFromScene : function(){
		console.warn(this.key + " : removeFromScene method must be overrided.")
	},
	// OVERRIDE
	applyOnAdd : function(entity){
		
	},
	// OVERRIDE
	Update : function(){

	}
}

Mouth.default.prototype = new Organ({
	organIndex : 0,
	key : "teeth-default-" + (++Organ.ID) 
});
/*
eyes.default.prototype = new Organ({
	organIndex : 1,
	key : "eyes-default-" + (++Organ.ID),
	updateFunctions : [
		null
	],
});*/