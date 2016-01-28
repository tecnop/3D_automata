var Organ = function(data){
	this.key = data.key;
	this.organIndex = data.organIndex;
	if(data.updateFunction != null)
		this.updateFunction = data.updateFunction;
}

var Teeth = {
	default : function(data){
		this.name = "TEETH";
		this.relativePosition = new THREE.Vector3(0, 0, 50);

		this.object = new THREE.Mesh(
			new THREE.BoxGeometry(20, 20, 40), 
			new THREE.MeshLambertMaterial({
				color: new THREE.Color( 1, 0, 0 ),
			})
		);

		console.log(this.object);
		this.apply = function(entity){

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
	// OVERRIDE
	applyOnAdd : function(entity){
		
	}
}

Teeth.default.prototype = new Organ({
	organIndex : 0,
	key : "teeth-default-" + (++Organ.ID) 
});

/*eyes.default.prototype = new Organ({
	organIndex : 1,
	key : "eyes-default-" + (++Organ.ID),
	updateFunction = EyesCheck;
});*/