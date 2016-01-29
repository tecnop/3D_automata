var AudioManager = new audioManager();

$(document).ready(function()  {
	
	//console.log("super");

	AudioManager.init();
	AudioManager.loadSound("Sound/Pop.mp3","Pop");
	
	var threeWrapper = new ThreeWrapper({
		container : $('#main-canvas'),
		paused : false,
		size : {
			width : $(document).width(),
			height : $(document).height(),
		},
		orbitContainer : document.getElementById( 'main-canvas' ),
		
	});

	threeWrapper.render();

	/*
	 * Inputs
	 */

	$(document).on('keypress', function(e){

		// t
		if (e.charCode == 116){
			for(var i=0; i < 1; ++i)
				threeWrapper.createRandomCude();
		}
		//z
		else if (e.charCode == 122){
			//threeWrapper.testObject.destination = threeWrapper.getRandomVectorInCube(threeWrapper.testObject.object.position, 500);
			//threeWrapper.createParticuleEngine();
		}
		//s
		else if (e.charCode == 115){
			
		}
		//q
		else if (e.charCode == 113){
			
		}
		//d
		else if (e.charCode == 100){
			threeWrapper.entities.list[threeWrapper.entities.list.length - 1].delete();
		}
		// +
		else if (e.charCode == 43){
			threeWrapper.speedUp();
		}
		// -
		else if (e.charCode == 45){
			threeWrapper.slowDown();
		}
		// o
		else if (e.charCode == 111){

			threeWrapper.addOrganTo(
				new Body.default(),
				threeWrapper.entities.list[threeWrapper.entities.list.length - 1]
			);
			
		}
		else {
			console.log(e.charCode);
		}
		

	});

});
