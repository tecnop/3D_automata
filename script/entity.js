var Entity = function (data){
	this.init(data);
}

Entity.prototype  = { 
	COUNT : 1,
	TYPE : EntityType.CREATURE,
	init : function(data) {
		this.Caracteristique = new EntityCaracteristique(data);
		//this.speed = 1;
		//this.rotationSpeed = 1;
		
		this.organs = {
			map : {},
			list : [
				null, // 0 : THEET
			],
			add : function(organ){
				this.map[organ.key] = organ;
				this.list[organ.organIndex] = organ;
			},
			// apply an action for each existing (non-null) organs
			each : function(action){
				for (var i = 0, len = this.list.length; i < len; ++i){
					if (this.list[i]){
						action(i, this.list[i]);
					}
				}
			}
		}

		this.key = "e" + (++Entity.COUNT);
		this.object =  new THREE.Object3D();
		this.entityObject = new THREE.Mesh(
			new THREE.BoxGeometry(50, 50, 50), 
			new THREE.MeshLambertMaterial({
				color: this.Caracteristique.Color,//new THREE.Color( 1, 0, 0 ),
			})
		);
		this.object.add(this.entityObject);
		this.object.position.copy(getRandomVectorInCube());
		
		this.SphereCollider = new SphereCollider(this, 50);
		
		this.destination = getRandomVectorInCube();

	},
	getPosition : function(){
		return this.object.position;
	},
	setPosition : function(vec3) {
		this.object.position.copy(vec3);
		this.SphereCollider.debugObject.position.copy(vec3);
	},
	onDestinationReach : function(){
		//console.log("arrivé ! ");
		this.destination = getRandomVectorInCube();
	},
	lookAt : function(vec3){
		var me = this;

		this.object.lookAt(vec3);

	},
	add : function(vec3){
		var me = this;

		this.object.position.add(vec3);
		this.SphereCollider.debugObject.position.add(vec3);
	},
	addOrgan : function(organ){
		this.organs.add(organ);

		this.object.add(organ.getObject());

		organ.getObject().position.set(
			organ.getRelativePosition().x,
			organ.getRelativePosition().y,
			organ.getRelativePosition().z
		);
	},
	Update()
	{
		this.Caracteristique.Update();
	},
	OnCollision(CollideEntity)
	{
		switch(this.Caracteristique.State)
		{
			case EntityState.HUNTING:
			{
				console.log("hunt touch");
			}
		}
	},
	delete : function(){
		this.removeFromScene();
	},
	// OVERRIDE
	removeFromScene : function(){
		console.warn(this.key + " : removeFromScene method must be overrided.")
	}
}

var EntityState = {
	NONE : {value:0},
	SLEEPING : {value:1},
	HUNTING : {value:2}, //Chercher de la nourriture
	REPRODUCTING: {value:3} //Chercher a se reproduire
};

var EntityCaracteristique = function (data){
	this.init(data);
}

EntityCaracteristique.prototype = {
	init : function(data){
		
		if(data==null)
		{
			this.CreateNewEntity();
		}else{
			this.CreateEntityFromParameter(data.split(";"))
		}
	},
	CreateNewEntity()
	{
		this.speed = 1;
		this.rotationSpeed = 1;
		//
		this.attackDamage = 1;
		this.Color = new THREE.Color(1,0,0);
		
		this.Hunger=0;
		this.Tiredness=0;
		
		this.State= EntityState.HUNTING;
		
		this.LifeTime=0;
		this.Energy=100;
	},
	CreateEntityFromParameter(parameters)
	{
		this.speed = parameters[0];
		this.rotationSpeed = parameters[1];
		//
		this.attackDamage = parameters[2];
		this.Color = new THREE.Color(parameters[3],parameters[4],parameters[5]);
		
		this.Hunger=0;
		this.Tiredness=0;
		
		this.State= EntityState.NONE;
		
		this.LifeTime=0;
		this.Energy=parameters[6];
	},
	
	
	Update : function()
	{
		this.LifeTime += 1;
		this.Hunger += 1;
		
		if(this.State != EntityState.SLEEPING)
			this.Tiredness += 1;
		else
			this.Tiredness -= 1;
		
		
		this.Energy 
	}
}