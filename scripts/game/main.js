/* Globals */
/*var colorSets = [
	['#90C695','#90C695','#26A65B'],
	['#E87E04','#D35400','#E87E04'],
	['#6C7A89','#95A5A6', '#6C7A89']
	],
	colorCode = Math.floor(Math.random()*3);*/
var colorSets = [
	['#E87E04','#D35400','#E87E04'],
	['#90C695','#90C695','#26A65B'],
	['#FDE3A7','#96281B','#FDE3A7'],
	['#6C7A89','#95A5A6', '#6C7A89']
	],
	colorCode = Math.floor(Math.random()*4);

var div = document.getElementById('main'),
	scene = new THREE.Scene(),
	camera = new THREE.PerspectiveCamera(90, window.innerWidth/window.innerHeight, 18, 1000),
	world = new THREE.Object3D(),
	worldRot = false,
	requestId;

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
	    gradient.addColorStop(1, '#100'); 
	}
	else{
	    gradient = context.createLinearGradient(0,0,500,500);
		gradient.addColorStop(0, color);
		gradient.addColorStop(1, '#100'); 
	}
	context.fillStyle = gradient;
	context.fill();

	return canvas;
}

/* Solids/Planes object */
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

/* The bad guys. Not very smart (not their fault) */
var obstacleTexture = new THREE.Texture(generateTexture(colorSets[colorCode][0],2));
	obstacleTexture.needsUpdate = true;
var obstacleParams = {
	map : obstacleTexture, 
	color : colorSets[colorCode][0]
};
var obstacleState = {};
var weights = {
	1 : 0.5, 
	2 : 0.75,
	3 : 0.9,
	4 : 0.95
};
function obstacleFactory(cube){	
	if(obstacleState.active == undefined || obstacleState.active == [] || obstacleState.active.indexOf(true) == -1){
		var factor = Math.random(), i, w = Math.random(), proceed, delta, flag, k;
		obstacleState = {
			instances : [],
			number : 0,
			active : [],
			dimensions : {
				x : [], y : [],	z : []
			},
			bidirectional : []
		};
		for (i=1; i<=4; i++)
			if(weights[i]>w){
				obstacleState.number = i;
				break;
			}
		for(i=0; i<obstacleState.number; i++){
			proceed = false;
			var rand = 0.5-Math.random(), sense;
			sense = (rand <= 0)? -1 : 1;
			if(Math.random()>0.33) obstacleState.bidirectional[i] = true;
			obstacleState.dimensions.x[i] = Math.floor(45 + sense*factor*15);
			obstacleState.dimensions.y[i] = Math.floor(30 + sense*factor*10);
			obstacleState.dimensions.z[i] = Math.floor(2 + sense*factor*2);
			obstacleState.active[i] = true;
			obstacleState.instances[i] = new solids(obstacleState.dimensions.x[i], obstacleState.dimensions.y[i], obstacleState.dimensions.z[i], obstacleParams, 'B');
			obstacleState.instances[i].Mesh = new THREE.Mesh(obstacleState.instances[i].Geometry, obstacleState.instances[i].Material);
			obstacleState.instances[i].Mesh.rotation.z = Math.PI/2*Math.floor(factor*4);
			/*while(proceed == false){
				factor = Math.random();
				flag = 0;
				if(obstacleState.number > 1)
					for(k=0; k<i; k++){
						delta = Math.abs(-Math.floor(200 + factor*50) - obstacleState.instances[k].Mesh.position.z);
						if(delta < 25){
							flag = 1;
							break;
						}
					}
				if(flag == 0) proceed = true;
			}*/
			obstacleState.instances[i].Mesh.position.x = sense*Math.floor(factor*25);
			obstacleState.instances[i].Mesh.position.y = sense*Math.floor(factor*15);
			obstacleState.instances[i].Mesh.position.z = -Math.floor(200 + factor*100);
			world.add(obstacleState.instances[i].Mesh);
		}
	}
	else{
		for(i=0; i<obstacleState.number; i++){
			if(obstacleState.instances[i].Mesh.position.z > 10+cube.Mesh.position.z){
				obstacleState.instances[i].Mesh.position.z += 20000;
				obstacleState.active[i] = false;
				continue;
			}
			else{
				obstacleState.instances[i].Mesh.position.z += 1.6;
				var rand = 0.7-Math.random(), sense;
				sense = (rand <= 0)? -1 : 1;
				/*if(obstacleState.bidirectional[i])
					if(obstacleState.instances[i].Mesh.rotation.z == 0 || obstacleState.instances[i].Mesh.rotation.z-Math.PI <= 0.01)
						obstacleState.instances[i].Mesh.position.x += sense*1.2;
					else
						obstacleState.instances[i].Mesh.position.y += sense*1.2;*/
			}
		}
	}
	scene.add(world);
	return obstacleState;
}

function collisionDetection(obstacleState){
	var cX = cube.Mesh.position.x, cY = cube.Mesh.position.x, cZ = cube.Mesh.position.z, cWidth = cHeight = cDepth = 10;
    var eX, eY, eZ, eWidth, eHeight, eDepth;
    var margin = 4;

	for(var k=0; k<obstacleState.instances.length; k++){
		eX = obstacleState.instances[k].Mesh.position.x;
		eY = obstacleState.instances[k].Mesh.position.y;
		eZ = obstacleState.instances[k].Mesh.position.z;
		eWidth = obstacleState.dimensions.x[k];
		eHeight = obstacleState.dimensions.y[k];
		eDepth = obstacleState.dimensions.z[k];

		console.log(cX,eX,cY,eY,cZ,eZ,cWidth,cHeight,cDepth,eWidth,eHeight,eDepth);
		if (Math.abs(cZ - eZ) <= cDepth/2 + eDepth/2 - margin) {
			if (Math.abs(cY - eY) <= cHeight/2 + eHeight/2 - margin) {
				if (Math.abs(cX - eX) <= cWidth/2 + eWidth/2 - margin) {
					console.log('HIT');
					console.log(cX,eX,cY,eY,cZ,eZ,cWidth,cHeight,cDepth,eWidth,eHeight,eDepth);
					cancelAnimFrame(requestId);
				}
			}
		}
	}
}

/* The LOOP; reason for all awesomeness and misery. */
render = function (cube){
	requestId = requestAnimFrame(function(){render(cube);});
	obstacles = obstacleFactory(cube);
	collisionDetection(obstacles);
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

	/* Dump everything to the scene, render and then pray! */
	render(cube);
}

window.addEventListener('keyup', function(e){
	if(e.keyCode == 37)
		worldRotate(-1);
	else if(e.keyCode == 39)
		worldRotate(1);
});

/* So it begins */
init();