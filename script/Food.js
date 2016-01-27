var Food = function(position, type)
{
	this.init(position, type);
}

var FoodRadius = 10;

Food.prototype = {
	COUNT : 1,
	TYPE : EntityType.FOOD,
	init : function(position, type)
	{
		this.key = "e" + (++Food.COUNT);
		
		this.object = new THREE.Mesh(
			new THREE.SphereGeometry( FoodRadius-1.5, 32, 32 ),
			new THREE.MeshLambertMaterial({
				color: new THREE.Color( 0, 1, 0),
			})
		);
		
		this.object.position.copy(position);
		this.Collider = new SphereCollider(this, FoodRadius);
	}
}