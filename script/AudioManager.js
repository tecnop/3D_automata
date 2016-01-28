

var audioManager = function (data){
	this.init(data);
}

audioManager.prototype = {
	init : function()
	{
		this.audioList = {}
	},
	loadSound : function(soundPath, name){
		var audio = document.createElement('audio');
		var source = document.createElement('source');
		source.src = soundPath;
		audio.appendChild(source);
		this.audioList[name] = audio;
	},
	playSound : function(name)
	{
		var audio = this.audioList[name];
		if(audio != null)
			audio.play();
	}
}