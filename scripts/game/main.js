var div = document.getElementById('main');

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(90, window.innerWidth/window.innerHeight, 18, 1000);
var world = new THREE.Object3D();
var worldRot = false;

var renderer = new THREE.WebGLRenderer({antialias:true, alpha:true});
renderer.setSize(window.innerWidth, window.innerHeight);
div.appendChild(renderer.domElement);
renderer.domElement.id = 'game';
renderer.domElement.style.background = '#FFFFFF';

var colorSets = [[0x00FF00,0x90C695,0x26A65B],[0xFF0000,0xD35400,0xF4B350],[0x0000FF,0x6C7A89,0x95A5A6]], colorCode;

var obstacleMaterial = new THREE.MeshBasicMaterial( {color: 0xCCCCCC, side:THREE.DoubleSide} );
var obstacleGeometry = new THREE.PlaneGeometry(window.innerWidth/32, window.innerHeight/32);
var obstacle = new THREE.Mesh(obstacleGeometry, obstacleMaterial);
obstacle.rotation.z = Math.PI/2;
obstacle.position.z = -50;
world.add(obstacle);
  
var render = function () {
	requestAnimationFrame(render);
	obstacle.position.z += 0.5;
	renderer.render(scene, camera);
};

function init(){
	colorCode = Math.floor(Math.random()*3);

	var geometry = new THREE.BoxGeometry(10, 10, 10);
	var material = new THREE.MeshBasicMaterial({color: colorSets[colorCode][0], wireframe: true, wireframeLinewidth: 2});
	cube = new THREE.Mesh(geometry, material);
	cube.rotation.x = 0;
	scene.add(cube);

	camera.position.z = 50;

	var floorMaterial = new THREE.MeshBasicMaterial( {color:colorSets[colorCode][1], side:THREE.DoubleSide} );
	var wallMaterial = new THREE.MeshBasicMaterial( {color:colorSets[colorCode][2], side:THREE.DoubleSide} );
	var geometry = new THREE.PlaneGeometry(window.innerWidth/8, window.innerHeight/4);

	// floor and ceilings
	var floor = new THREE.Mesh(geometry, floorMaterial);
	floor.position.y = -window.innerHeight/16;
	floor.rotation.x = Math.PI/2;
	world.add(floor);
	
	var ceiling = new THREE.Mesh(geometry, floorMaterial);
	ceiling.position.y = window.innerHeight/16;
	ceiling.rotation.x = Math.PI/2;
	world.add(ceiling);

	// walls
	var wall1 = new THREE.Mesh(geometry, wallMaterial);
	wall1.position.x = -window.innerHeight/16;
	wall1.rotation.y = Math.PI/2;
	world.add(wall1);

	var wall2 = new THREE.Mesh(geometry, wallMaterial);
	wall2.position.x = window.innerHeight/16;
	wall2.rotation.y = Math.PI/2;
	world.add(wall2);

	window.addEventListener('keyup', function(e){
		if(e.keyCode == 37)
			worldRotate(-1);
		else if(e.keyCode == 39)
			worldRotate(1);
	});

	/* // create a point light
	var pointLight = new THREE.PointLight('white');

	// set its position
	pointLight.position.x = -1000;
	pointLight.position.y = 0;
	pointLight.position.z = 1000;
	pointLight.intensity = 2.9;
	pointLight.distance = 10000;

	// add to the scene
	scene.add(pointLight);*/
	scene.add(world);

	render();
}

worldRotate = function(sense){
	if(worldRot == true)
		return;
	else 
		worldRot = true;
	angle = world.rotation.z, teta = 0;
	var T = setInterval(function(){
		teta += sense*Math.PI/64;
		angle += sense*Math.PI/64;
		world.rotation.z = angle;
		console.log(angle, world.rotation.z);
		if((teta>=(Math.PI/2) && sense==1) || (teta<=-(Math.PI/2) && sense==-1)){
			clearInterval(T);
			worldRot = false;
		}
	}, 1000/60, false);
}

init();