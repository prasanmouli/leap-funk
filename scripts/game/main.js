/* Globals */
var colorSets = [
	['#90C695','#90C695','#26A65B'],
	['#E87E04','#D35400','#E87E04'],
	['#6C7A89','#95A5A6', '#6C7A89']
	],
	colorCode = Math.floor(Math.random()*3);

var div = document.getElementById('main'),
	scene = new THREE.Scene(),
	camera = new THREE.PerspectiveCamera(90, window.innerWidth/window.innerHeight, 18, 1000),
	world = new THREE.Object3D(),
	worldRot = false;

var renderer = new THREE.WebGLRenderer({
	antialias:true, 
	alpha:true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.physicallyBasedShading = true;
renderer.domElement.id = 'game';
renderer.domElement.style.background = '#040404';
div.appendChild(renderer.domElement);


/* Texture Generation */
function generateTexture(color, option) {
	var size = 512;
	canvas = document.createElement( 'canvas' );
	canvas.width = size;
	canvas.height = size;
	var context = canvas.getContext( '2d' );
	context.rect( 0, 0, size, size );
	var gradient;
	if(option == 1){
	    gradient = context.createLinearGradient(0,0,size/1.9,size/1.6);
		gradient.addColorStop(0, color);	
	    gradient.addColorStop(1, 'black'); 
	}
	else{
	    gradient = context.createLinearGradient(0,0,500,500);
		gradient.addColorStop(0, color);
		gradient.addColorStop(1, 'black'); 
	}
	context.fillStyle = gradient;
	context.fill();

	return canvas;
}

/* Solids / Planes object */
var solids = function(w, h, d, MeshBasic, type){
	this.Geometry = (type == 'B') ? new THREE.BoxGeometry(w,h,d) : new THREE.PlaneGeometry(w,h);
	this.Material = new THREE.MeshBasicMaterial(MeshBasic);
}

/* rotate the world about Z */
worldRotate = function(sense){
	if(worldRot == true)
		return;
	else 
		worldRot = true;
	var angle = world.rotation.z, teta = 0;
	var T = setInterval(function(){
		teta += sense*Math.PI/64;
		angle += sense*Math.PI/64;
		world.rotation.z = angle;
		if((teta>=(Math.PI/2) && sense==1) || (teta<=-(Math.PI/2) && sense==-1)){
			clearInterval(T);
			worldRot = false;
		}
	}, 1000/60, false);
}

/* The LOOP; reason for all awesomeness and misery. */
render = function (AA){
	requestAnimFrame(function(){render(AA);});
	AA.position.z += 2;
	renderer.render(scene, camera);
};

/* It all begins here */
init = function(){

	/* Cube; Hero; You; Whatever! */
	var cubeTexture = new THREE.Texture(generateTexture(colorSets[colorCode][0],2));
	cubeTexture.needsUpdate = true;
	var cubeParams = {
		map: cubeTexture, 
		color: colorSets[colorCode][0]
		//wireframe: true, 
		//wireframeLinewidth: 2
	},
	cubeWidth = 10,
	cubeHeight = 10,
	cubeDepth = 10;

	cube = new solids(cubeWidth, cubeHeight, cubeDepth, cubeParams, 'B');
	cube.Mesh = new THREE.Mesh(cube.Geometry, cube.Material);
	cube.Mesh.position.z = 0;
	cube.Mesh.rotation.x = 0;
	scene.add(cube.Mesh);

	camera.position.z = 50;

	/* The bad guys. Not very smart (not their fault) */	
	var obstacleTexture = new THREE.Texture(generateTexture(colorSets[colorCode][0],2));
	obstacleTexture.needsUpdate = true;
	var obstacleParams = {
		map: obstacleTexture, 
		color: colorSets[colorCode][0]
		//wireframe: true, 
		//wireframeLinewidth: 2
	};

	var obstacle = new solids(50, 30, 2, obstacleParams, 'B');
	obstacle.Mesh = new THREE.Mesh(obstacle.Geometry, obstacle.Material);
	obstacle.Mesh.position.y = -20;
	obstacle.Mesh.rotation.z = 0;
	obstacle.Mesh.position.z = -250;
	obstacle.Mesh.rotation.x = Math.PI/8;
	world.add(obstacle.Mesh);


	/* The Surrounding; Our Viewport; Floors, Ceilings and Walls */
	var floorTexture = new THREE.Texture(generateTexture(colorSets[colorCode][1],1));
	floorTexture.needsUpdate = true;
	var floorParams = {
		map : floorTexture, 
		color : colorSets[colorCode][1], 
		side : THREE.DoubleSide
	}, 
	floorWidth = window.innerWidth/3, 
	floorHeight = window.innerHeight/1.5,
	floorDepth = 0;
	
	var floor = ceiling = new solids(floorWidth, floorHeight, floorDepth, floorParams, 'P');
	floor.Mesh = new THREE.Mesh(floor.Geometry, floor.Material);
	floor.Mesh.position.y = window.innerHeight/16;
	floor.Mesh.rotation.x = Math.PI/2;
	world.add(floor.Mesh);
	ceiling.Mesh = new THREE.Mesh(ceiling.Geometry, ceiling.Material);
	ceiling.Mesh.position.y = -window.innerHeight/16;
	ceiling.Mesh.rotation.x = Math.PI/2;
	world.add(ceiling.Mesh);	

	var wallTexture = new THREE.Texture(generateTexture(colorSets[colorCode][2],1));
	wallTexture.needsUpdate = true;
	var wallParams = {
		map : wallTexture, 
		color : colorSets[colorCode][2], 
		side : THREE.DoubleSide
	}, 
	wallWidth = window.innerWidth/3, 
	wallHeight = window.innerHeight/1.5,
	wallDepth = 0,
	wallTexture = generateTexture(colorSets[colorCode][2],1);

	var leftW = rightW = new solids(wallWidth, wallHeight, wallDepth, wallParams, 'P');
	leftW.Mesh = new THREE.Mesh(leftW.Geometry, leftW.Material);
	leftW.Mesh.position.x = window.innerHeight/16;
	leftW.Mesh.rotation.y = Math.PI/2;
	world.add(leftW.Mesh);
	rightW.Mesh = new THREE.Mesh(rightW.Geometry, rightW.Material);
	rightW.Mesh.position.x = -window.innerHeight/16;
	rightW.Mesh.rotation.y = Math.PI/2;
	world.add(rightW.Mesh);

	/* Dump everything to the scene, render and pray! */
	scene.add(world);
	render(obstacle.Mesh);
}

window.addEventListener('keyup', function(e){
	if(e.keyCode == 37)
		worldRotate(-1);
	else if(e.keyCode == 39)
		worldRotate(1);
});

/* So it begins */
init();