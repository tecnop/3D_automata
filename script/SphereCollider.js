var SphereCollider = function(entity, radius)
{
	this.init(entity, radius);
}

SphereCollider.prototype = {
	init: function(entity, radius)
	{
		this.entity = entity;
		this.radius = radius;
		
		this.debugObject = new THREE.Mesh(
			new THREE.SphereGeometry( this.radius, 32, 32 ),
			new THREE.MeshLambertMaterial({
				color: new THREE.Color( 1, 0, 0),
			})
		);
		this.debugObject.material.transparent = true;
		this.debugObject.material.opacity = 0.2;
		
		this.debugObject.position.copy(this.entity.object.position);
	},
	CheckCollision: function(entity)
	{
		
		var distance = this.entity.getPosition().distanceTo(entity.getPosition());
		
		if(distance < this.radius + entity.SphereCollider.radius)
			return true;
		
		return false;
	}
}