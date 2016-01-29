
var Entity = function (data){
	this.init(data);
}

Entity.prototype  = { 
	COUNT : 1,
	TYPE : EntityType.CREATURE,
	init : function(data) {
		var me = this;
		this.Caracteristique = new EntityCaracteristique(data);

		this.effects = {
			list : [],
			map : {},
			removePool : [],
			add : function(effect){
				
				this.map[effect.key] = effect;
				this.list.push(effect);
				effect.apply(me);
			},
			remove : function(effect){
				var index = -1;
				for (var i = 0; i < this.list.length; ++i){
					if (this.list[i].key == effect.key){
						
						index = i;
						break;
					}
				}

				
				effect.remove(me);

				if( -1 != index){
					console.log("remove");
					this.list.splice(index);
				}

				delete this.map[effect.key];
			},
			each : function(action){

				for (var i = 0; i < this.list.length; ++i){
					
					action(i, this.list[i]);
					
				}
			},
			addToRemovePool : function(effect){
				this.removePool.push(effect);
			},
			flushRemovePool : function(entity){

				for (var i = 0; i < this.removePool.length; ++i){
					this.remove(this.removePool[i]);
				} 

				this.removePool = [];
			}
		};

		this.organs = {
			map : {},
			list : [
				null, // 0 : MOUTH
				null, // 1 : Body
				null, // 2 : Head
				null, // 3 : LeftPart
				null, // 4 : RightPart
			],
			add : function(organ){
				this.map[organ.key] = organ;
				this.list[organ.organIndex] = organ;
				organ.onEntityAdd(me);
			},
			remove : function(organ){
				organ.onEntityRemove(me);
				this.list[organ.organIndex] = null;
				delete this.map[organ.key];
			},
			hasPart : function(organIndex){
				return this.list[organIndex] ? true : false;
			},
			removeRandomly : function(){
				var pool = [];
				for (var i = 0; i < this.list.length; ++i) {
					if (this.list[i]){
						pool.push(this.list[i]);
					}
				}

				var index = Math.floor(Math.random() * pool.length);

				this.remove(pool[index]);
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

		this.key = "e" + (++Entity.prototype.COUNT);
		
		this.object =  new THREE.Object3D();

		this.entityObject = new THREE.Mesh(
			new THREE.BoxGeometry(50, 50, 50), 
			new THREE.MeshLambertMaterial({
				color: this.Caracteristique.color,//new THREE.Color( 1, 0, 0 ),
			})
		);
		this.object.add(this.entityObject);
		this.object.position.copy(getRandomVectorInCube());
		
		this.SphereCollider = new SphereCollider(this, 300);
		
		this.destination = getRandomVectorInCube();
		
		this.createParticuleEmitter();

	},
	getPosition : function(){
		return this.object.position;
	},
	setPosition : function(vec3) {
		this.object.position.copy(vec3);
		this.SphereCollider.debugObject.position.copy(vec3);
	},
	setScale : function(vec3){
		
		this.object.scale.copy(vec3);
	},
	onDestinationReach : function(){

		if (this.trackedFood){
			if (this.trackedFood.object.position.distanceTo(this.getPosition()) <= 10){
				
				if (this.trackedFood.isAlive){
					this.trackedFood.isAlive = false;
					this.trackedFood.removeFromScene();
					AudioManager.playSound("Pop");
					//console.log("miam ! " + this.Caracteristique.exp + "/" + this.Caracteristique.nextExp);
					//this.setScale(new THREE.Vector3(1.1, 1.1, 1.1).add(this.object.scale) );
					this.gainExp(1);
				}

				this.trackedFood = null;
			}
		}

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

		organ.setColor(this.entityObject.material.color);
	},
	setColor : function(color){
		this.entityObject.material.color = color;
		this.organs.each(function(i, organ){
			organ.setColor(color);
		});
	},
	gainExp : function(value) {

		this.Caracteristique.exp += value;

		
		
	},
	Update : function(threeWrapper, entity) {

		if ( this.Caracteristique.exp >= this.Caracteristique.nextExp ) {
			this.Caracteristique.exp = 0;
			this.Caracteristique.nextExp += ( parseInt(this.Caracteristique.nextExp / 1) || 1 );
		
			var nextOrgan = OrganHelper.getRandomOrganFor(this);
			this.setScale(new THREE.Vector3(0.5, 0.5, 0.5).add(this.object.scale) );
			if(nextOrgan){
				threeWrapper.addOrganTo(nextOrgan, this);
			}
			
		}
		
		this.particleGroup.tick(0.01);//threeWrapper.clock.getDelta());
		this.emitter.position.value = this.getPosition();

		/*if(this.State != EntityState.SLEEPING)
			this.Tiredness += 1;
		else
			this.Tiredness -= 1;
		
		
		this.Energy = this.Hunger * this.LifeTime;
		
		if(this.Energy > 100 * 100)
		{

		}*/
	},
	OnCollision(CollideEntity)
	{
		switch(this.Caracteristique.State)
		{
			case EntityState.HUNTING:
			{
				if(CollideEntity.TYPE == EntityType.FOOD)
				{
					
					//CollideEntity.removeFromScene();

					if (!this.trackedFood) {
						this.destination = CollideEntity.object.position;
						this.trackedFood = CollideEntity;
						/*this.effects.add(new Effect({
							duration : 60,
							apply : function(entity) {
								
								entity.Caracteristique.speed = entity.Caracteristique.speed >= 5 ? 5 : entity.Caracteristique.speed + 2;
								
							},
							remove : function(entity){
								
								entity.Caracteristique.speed = entity.Caracteristique.speed <= 1 ? 1 : entity.Caracteristique.speed - 2;
								
							},
						}));*/
					}
					//this.Caracteristique.
				}
				/*else if(CollideEntity.TYPE == EntityType.CREATURE)
				{
					console.log("eat creature");
					this.Caracteristique.addCaracteristiqueValue(CaracteristiquesEnum.HUNGER, 10);
				}*/
				
			}
			case EntityState.REPRODUCTING:
			{
				if(CollideEntity.TYPE == EntityType.CREATURE && CollideEntity.Caracteristique.State == EntityState.REPRODUCTING)
				{
					console.log("bebe creature");
				}
			}
		}
	},
	delete : function(){
		this.removeFromScene();
	},
	// OVERRIDE
	removeFromScene : function(){
		console.warn(this.key + " : removeFromScene method must be overrided.")
	},
	
	createParticuleEmitter : function() {
		this.particleGroup = new SPE.Group({
			texture: {
				value: THREE.ImageUtils.loadTexture('./images/star.png')
			},
			maxParticleCount : 300
		});
		this.emitter = new SPE.Emitter({
			maxAge: {
				value: 0.5
			},
			position: {
				value: this.getPosition(),
				spread: new THREE.Vector3( 0, 0, 0 )
			},
			acceleration: {
				value: new THREE.Vector3(0, -10, 0),
				spread: new THREE.Vector3( 1000, 0, 1000 )
			},
			velocity: {
				value: new THREE.Vector3(0, 25, 0),
				spread: new THREE.Vector3(1000, 750, 1000)
			},
			color: {
				value: this.Caracteristique.color
			},
			size: {
				value: 100
			},
			particleCount: 120
		});
		
		this.particleGroup.addEmitter(this.emitter);
		//scene.add( particleGroup.mesh );
		/*document.querySelector('.numParticles').textContent =
			'Total particles: ' + emitter.particleCount;*/
	}
}
















var EntityState = {
	NONE : 0,
	SLEEPING : 1,
	HUNTING : 2, //Chercher de la nourriture
	REPRODUCTING: 3 //Chercher a se reproduire
};

var CaracteristiquesEnum = {
	SPEED : 0,
	ATTACK_DAMAGE : 1,
	HUNGER : 2,
	TIREDNESS : 3
}

var EntityCaracteristique = function (data){
	this.init(data);
}

EntityCaracteristique.prototype = {
	life : 100,
	currentLife : 100,

	exp : 0,
	nextExp : 2,

	angerRate : 1,
	hungerRate : 1,

	speed : 1,
	rotationSpeed : 1,
	attackDamage : 1,

	init : function(data){
		
		if(data==null)
		{
			this.createNewEntity();
		}else{
			this.createEntityFromParameter(data.split(";"))
		}
	},
	setDefaultStats(){

	},
	createNewEntity()
	{
		
		this.speed = 1;
		this.rotationSpeed = 1;
		//
		this.attackDamage = 1;
		this.color = new THREE.Color(1,0,0);
		
		this.Hunger=0;
		this.Tiredness=0;
		
		this.State = EntityState.HUNTING;
		
		this.LifeTime=0;
		this.Energy=100;
	},
	createNewEntity()
	{
		
		this.speed = 1;
		this.rotationSpeed = 1;
		//
		this.attackDamage = 1;
		this.color = new THREE.Color(1,0,0);
		
		this.Hunger=0;
		this.Tiredness=0;
		
		this.State = EntityState.HUNTING;
		
		this.LifeTime=0;
		this.Energy=100;
	},
	createEntityFromParameter(parameters)
	{
		this.speed = parameters[0];
		this.rotationSpeed = parameters[1];
		//
		this.attackDamage = parameters[2];
		this.color = new THREE.Color(parameters[3],parameters[4],parameters[5]);
		
		this.Hunger=0;
		this.Tiredness=0;
		
		this.State= EntityState.HUNTING;
		
		this.LifeTime=0;
		this.Energy=parameters[6];
	},
	addCaracteristiqueValue(Caracteristique, value)
	{
		switch(Caracteristique)
		{
			case CaracteristiquesEnum.SPEED:
				this.speed += value;
				break;
			case CaracteristiquesEnum.ATTACK_DAMAGE:
				this.attackDamage += value;
				break;
			case CaracteristiquesEnum.HUNGER:
				this.Hunger += value;
				break;
			case CaracteristiquesEnum.TIREDNESS:
				this.Tiredness += value;
				break;
		}
	}
}

var Effect = function (data){
	this.init(data);
}

Effect.prototype  = {
	COUNT : 1,
	init : function(data){
		this.key = "effect" + (++Effect.prototype.COUNT);
		this.duration = data.duration;
		this.elapsedFrame = 0;
		this.apply = data.apply;
		this.remove = data.remove;
		this.overTime = data.overTime;
	},
}