var Entity = function (data){
	this.init(data);
}

Entity.prototype  = { 
	COUNT : 1,
	init : function(data) {

		this.speed = 1;
		this.rotationSpeed = 1;
		
		this.key = "e" + (++Entity.COUNT);
		this.object = new THREE.Mesh(
			new THREE.BoxGeometry(50, 50, 200), 
			new THREE.MeshLambertMaterial({
				color: new THREE.Color( 1, 0, 0 ),
			})
		);

	},
	getPosition : function(){
		return this.object.position;
	},
	setPosition : function(vec3) {
		this.object.position.copy(vec3);
	},
	onDestinationReach : function(){
		console.log("arrivé ! ");
	},
	add : function(vec3){
		this.object.position.add(vec3);
	}

}