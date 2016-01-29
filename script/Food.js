var Food = function(position, type)
{
	this.init(position, type);
}

var FoodRadius = 20;

Food.prototype = {
	COUNT : 1,
	TYPE : EntityType.FOOD,
	init : function(position, type)
	{

		this.key = "e" + (++Food.prototype.COUNT);
	
		this.isAlive = true;
		this.object = new THREE.Mesh(
			new THREE.SphereGeometry( FoodRadius-1.5, 32, 32 ),
			new THREE.MeshLambertMaterial({
				color : new THREE.Color( 0, 1, 0),
				emissive: new THREE.Color( 0, 0, 0.5),
			})
		);
		
		this.object.position.copy(position);
		this.SphereCollider = new SphereCollider(this, FoodRadius);
		
	},
	removeFromScene : function(){
		console.warn("Override me !!");
	},
	getPosition : function(){
		return this.object.position;
	}
}