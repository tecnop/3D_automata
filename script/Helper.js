function getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min +1)) + min;
}

function generateRandomFloatInclusive(min,max) {
	return highlightedNumber = Math.random() * (max - min) + min;
}

 function getRandomVectorInCube(){
	var depth = 3000;
	var x = Math.floor(Math.random() * (depth - (depth*-1) +1 ) ) + (depth*-1);

	var y = Math.floor(Math.random() * (depth - (depth*-1) +1 ) ) + (depth*-1);

	var z = Math.floor(Math.random() * (depth - (depth*-1) +1 ) ) + (depth*-1);

	return new THREE.Vector3(x, y, z);
}
