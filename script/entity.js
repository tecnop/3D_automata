var Entity = function (data){
	this.init(data);
}

Entity.prototype  = { 
	COUNT : 1,
	init : function(data) {
		this.Caracteristique = new EntityCaracteristique(data);
		//this.speed = 1;
		//this.rotationSpeed = 1;
		
		this.key = "e" + (++Entity.COUNT);
		this.object = new THREE.Mesh(
			new THREE.BoxGeometry(50, 50, 200), 
			new THREE.MeshLambertMaterial({
				color: this.Caracteristique.Color,//new THREE.Color( 1, 0, 0 ),
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
	},
	Update()
	{
		console.log("update entity");
		this.Caracteristique.Update();
	}

}

var EntityState = {
	NONE : {value:0},
	SLEEPING : {value:1},
	HUNTING : {value:2},
	REPRODUCTING: {value:3}
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
		
		this.State= EntityState.NONE;
		
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