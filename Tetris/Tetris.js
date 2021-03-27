


//
// Start here
//
var randomPieces_y;

var mapmat = new Array(23);
var currentPiece = null;
var isDroping;
var isStart = 0;
var temp = 0;

var isTouchGround  = 0;
var isTouchLeft = 0;
var isTouchRight = 0;
var isTouchTop = 0;
var isRowFull = 0;
var fullRow_index = new Array(20);
initFullRowIndex();



function initFullRowIndex(){
	for(var i = 0; i < 20; i++){
		fullRow_index[i] = 0;
	}
}


const colors = [
  		[1.0, 0.0, 0.0, 1.0], //red
  		[0.0, 1.0, 0.0, 1.0], //green
  		[0.0, 0.0, 1.0, 1.0], //blue
  		[1.0, 0.4, 0.0, 1.0], //orange
  		[0.5, 0.5, 0.5, 1.0], //grey
  		[0.0, 1.0, 1.0, 1.0], //aqua
  		[1.0, 0.0, 1.0, 1.0], //purple
  		[0.3, 0.7, 0.1, 1.0], //lime
  		[1.0, 0.5, 0.6, 1.0], //pink
  	]


main();



function keyEventLinstener(gl, programInfo){
	document.addEventListener('keydown', (event) => {
		const keyname = event.key;
		console.log("keypress event " + keyname);
		if (keyname == 's')
  		{
  			//console.log("current gl is ", gl);
  			isStart = 1;
  			isTouchTop = 0;
  			game(gl, programInfo);
  		}
	  	if (keyname == 'q')
	  	{
	  		clearPiece();
	  		isTouchTop = 0;
	  		drawInitScene(gl, programInfo);
	  		isStart = 0;
	  	}
	  	if (keyname == 'r')
	  	{
	  		clearPiece();
	  		isTouchTop = 0;
  			drawInitScene(gl, programInfo);
	  		isStart = 1;

	  	}
	  	if (keyname == 'ArrowLeft'){
	  		touchLeft();
	  		if(!isTouchLeft){
	  			isTouchRight = 0;
				currentPiece.current_index[0]--;
	  		}
		}
		if (keyname == 'ArrowRight'){
			touchRight();
	  		if(!isTouchRight){
	  			isTouchLeft = 0;
				currentPiece.current_index[0]++;
	  		}
		}
		if (keyname == 'ArrowUp'){
			if(currentPiece.current_shape == 3){
				currentPiece.current_shape = 0;
			}
			else{
				currentPiece.current_shape++;
			}
			update_currentIndex();
		}
		if (keyname == 'ArrowDown'){
			currentPiece.current_index[1]--;
			randomPieces_y--;
		}
		return keyname;
		
	});

}

function main() {
  const canvas = document.querySelector('#glcanvas');
  const gl = canvas.getContext('webgl');
  // If we don't have a GL context, give up now

  if (!gl) {
    alert('Unable to initialize WebGL. Your browser or machine may not support it.');
    return;
  }

  // Vertex shader program

  const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying lowp vec4 vColor;

    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vColor = aVertexColor;
    }
  `;

  // Fragment shader program

  const fsSource = `
    varying lowp vec4 vColor;

    void main(void) {
      gl_FragColor = vColor;
    }
  `;

  // Initialize a shader program; this is where all the lighting
  // for the vertices and so forth is established.
  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

  // Collect all the info needed to use the shader program.
  // Look up which attributes our shader program is using
  // for aVertexPosition, aVevrtexColor and also
  // look up uniform locations.
  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
    },
  };


  drawInitScene(gl, programInfo);
  document.onkeydown = keyEventLinstener(gl, programInfo);
  //isDroping = setInterval(autoDrop(currentPiece.current_p, gl, programInfo, currentPiece.current_shape, currentPiece. current_index[0], currentPiece.current_index[1]), 100);
  //console.log("isDroping: ", isDroping);
  //randomPieces(gl,programInfo);

  


}

//
// initBuffers
//
// Initialize the buffers we'll need. For this demo, we just
// have one object -- a simple two-dimensional square.
//



function game(gl, programInfo){

	//console.log("current y is: ", randomPieces_y);
	if (isTouchTop){
		clearPiece();
	  		isTouchTop = 0;
	  		isStart = 0;
	  		return;
	}

	if(isStart == 0){
		isStart = 1;
		isTouchGround = 0;
		currentPiece = null;
		randomPieces(gl, programInfo);
	}
	isDroping = setInterval(autoDrop, 300,currentPiece.current_p, gl, programInfo); 
	
	
	
}

function touchLeft(){
	var tempMat = currentPiece.current_pieceMat;
	for(var n = 0; n < 4; n ++){
		if(tempMat[n][0] == 0){
			isTouchLeft = 1;
			break;
		}
	}
}

function touchRight(){
	var tempMat = currentPiece.current_pieceMat;
	for(var n = 0; n < 4; n ++){
		if(tempMat[n][0] == 9){
			isTouchRight = 1;
			break;
		}
	}
}

function touchGround(){
	var tempMat = currentPiece.current_pieceMat;
	
	for(var n = 0; n < 4; n ++){
		if(tempMat[n][1] == 19 ){
			isTouchGround = 1;
			break;
		}
		if (mapmat[tempMat[n][1]+3][tempMat[n][0]][0]==1){
			isTouchGround=1;
			break;
		}
		
	}
}

function touchTop(){
	for (var i = 0; i < 10; i++){
		if(mapmat[2][i][0] == 1){
			isTouchTop = 1;
			console.log("Touch Top! Press Q to quit or press R/S to restart!");
			break;
		}
	}
}



function rowFull(){
	isRowFull = 0;
	var full = 0;
	for(var i = 0; i < 23; i++){
		full = 0;
		for(var j = 0; j < 10; j++){
			if(mapmat[i][j][0]==1){
				full++;
			}
		}
		if (full == 10){
			fullRow_index[i] = 1;
			isRowFull++;
		}
	}
}

function initMapmat(){
	for(var i = 0; i < 23; i++){
		mapmat[i] = new Array(10);
		for(var j = 0; j < 10; j++){
			mapmat[i][j] = [0, 0];

		}
	}
	
	console.log("mapmat initialized");
}

function updateMapmat_addPiece(piece, x, y){

	var j;
	var i = x + 2;
	//console.log("index(x, y) is: ", x, " ", y);
	for(var m = 0; m < 4; m++){
		j = 12 - y;
		for(var n = 0; n < 4 ; n++){
			if(piece.piece[0][m][n] == 1){
				//console.log("Function updateMapmat_addPiece: ", mapmat);
				//console.log("Function updateMapmat_addPiece： color index is ", piece.color_ind);
				mapmat[j][i] = [1, piece.color_ind];

				//console.log("current mapmat is ", mapmat);
				//console.log("current index(i, j) is ", i, " ", j);
			}

			j++;
		}
		i++;
	}
	
	return;
}

function updateMapmat_pieceDown(){

	for(var n = 0; n < 4; n++){
		//console.log("piceMat piece down: ", currentPiece.current_pieceMat);
		mapmat[currentPiece.current_pieceMat[n][1] + 2][currentPiece.current_pieceMat[n][0]] = [1, currentPiece.current_color];
		//console.log("current mapmat is ", mapmat);
		
	}
}

function drawInitScene(gl, programInfo){

	drawCanvas(gl);

  	drawBoard(gl, programInfo);//draw basic board

  	initMapmat();

  	randomPieces(gl,programInfo);


}

function drawMapmat(gl, programInfo){
	drawCanvas(gl);

  	drawBoard(gl, programInfo);//draw basic board

	for(var i = 0; i < 23; i ++){
		for(var j = 0; j < 10; j++){
			if(mapmat[i][j][0]==1){

				color = colors[mapmat[i][j][1]];
				drawSquare(gl, programInfo, j-4, 12-i, color);

			}
		}
	}
}

function autoDrop(piece, gl, programInfo){

	
	//console.log("current y is: ", randomPieces_y);
	if(isStart){
		randomPieces_y--;
		drawMapmat(gl, programInfo);
		//console.log("Function autoDrop: current mapmat is: ", mapmat);
		drawPiece(piece, gl, programInfo, currentPiece.current_shape, currentPiece.current_index[0], randomPieces_y);
		currentPiece.current_index[1]--;
		currentPiece = pieceInfo(currentPiece.current_p, currentPiece.current_shape, currentPiece.current_index[0], randomPieces_y);
		
		touchGround();
	}
	else{
		clearInterval(isDroping);
		isDroping = null;
	}
	if(isTouchGround == 1){
		updateMapmat_pieceDown();
		rowFull();
		if(isRowFull > 0){
			cancelRow();
		}
		isRowFull = 0;
		initFullRowIndex();
		drawMapmat(gl, programInfo);
		touchTop();
		//console.log("Function autoDrop currentPiece: ", currentPiece);
		isStart = 0;
		clearInterval(isDroping);
		isDroping = null;
		game(gl, programInfo);

	}
	
	
}

function cancelRow(){
	while(isRowFull > 0){
		for(var i = 0; i < 22; i++){
			if (fullRow_index[i] == 1){
				deleteRow_mapmat(i);
							}
		}
	}
}

function deleteRow_mapmat(index){
	var temp = mapmat;
	for (var i = index; i > -1; i--){
		for(var j = 0; j < 10; j++){
			if(i > 0){
				mapmat[i][j] = temp[i-1][j];
			}
			else{
				mapmat[i][j] = [0, 0];
			}

		}
	}
	isRowFull--;
}

function Pieces(){
	const O = [
		[
			[0, 0, 0, 0],
			[0, 1, 1, 0],
			[0, 1, 1, 0],
			[0, 0, 0, 0],
		],
		[
			[0, 0, 0, 0],
			[0, 1, 1, 0],
			[0, 1, 1, 0],
			[0, 0, 0, 0],
		],
		[
			[0, 0, 0, 0],
			[0, 1, 1, 0],
			[0, 1, 1, 0],
			[0, 0, 0, 0],
		],
		[
			[0, 0, 0, 0],
			[0, 1, 1, 0],
			[0, 1, 1, 0],
			[0, 0, 0, 0],
		],
	];

	const I = [
		[
			[0, 0, 0, 0],
			[1, 1, 1, 1],
			[0, 0, 0, 0],
			[0, 0, 0, 0],
		],
		[
			[0, 0, 1, 0],
			[0, 0, 1, 0],
			[0, 0, 1, 0],
			[0, 0, 1, 0],
		],
		[
			[0, 0, 0, 0],
			[1, 1, 1, 1],
			[0, 0, 0, 0],
			[0, 0, 0, 0],
		],
		[
			[0, 0, 1, 0],
			[0, 0, 1, 0],
			[0, 0, 1, 0],
			[0, 0, 1, 0],
		],
	];

	const S = [
		[
			[0, 0, 0, 0],
			[0, 0, 1, 1],
			[0, 1, 1, 0],
			[0, 0, 0, 0],
		],
		[
			[0, 0, 1, 0],
			[0, 0, 1, 1],
			[0, 0, 0, 1],
			[0, 0, 0, 0],
		],
		[
			[0, 0, 0, 0],
			[0, 0, 1, 1],
			[0, 1, 1, 0],
			[0, 0, 0, 0],
		],
		[
			[0, 0, 1, 0],
			[0, 0, 1, 1],
			[0, 0, 0, 1],
			[0, 0, 0, 0],
		],
	];

	const Z = [
		[
			[0, 0, 0, 0],
			[0, 1, 1, 0],
			[0, 0, 1, 1],
			[0, 0, 0, 0],
		],
		[
			[0, 0, 0, 1],
			[0, 0, 1, 1],
			[0, 0, 1, 0],
			[0, 0, 0, 0],
		],
		[
			[0, 0, 0, 0],
			[0, 1, 1, 0],
			[0, 0, 1, 1],
			[0, 0, 0, 0],
		],
		[
			[0, 0, 0, 1],
			[0, 0, 1, 1],
			[0, 0, 1, 0],
			[0, 0, 0, 0],
		],
	];

	const L = [
		[
			[0, 0, 0, 0],
			[0, 1, 1, 1],
			[0, 1, 0, 0],
			[0, 0, 0, 0],
		],
		[
			[0, 0, 1, 0],
			[0, 0, 1, 0],
			[0, 0, 1, 1],
			[0, 0, 0, 0],
		],
		[
			[0, 0, 0, 1],
			[0, 1, 1, 1],
			[0, 0, 0, 0],
			[0, 0, 0, 0],
		],
		[
			[0, 1, 1, 0],
			[0, 0, 1, 0],
			[0, 0, 1, 0],
			[0, 0, 0, 0],
		]
	];

	const J = [
		[
			[0, 0, 0, 0],
			[0, 1, 1, 1],
			[0, 0, 0, 1],
			[0, 0, 0, 0],
		],
		[
			[0, 0, 1, 1],
			[0, 0, 1, 0],
			[0, 0, 1, 0],
			[0, 0, 0, 0],
		],
		[
			[0, 0, 0, 1],
			[0, 1, 1, 1],
			[0, 0, 0, 0],
			[0, 0, 0, 0],
		],
		[
			[0, 0, 1, 0],
			[0, 0, 1, 0],
			[0, 1, 1, 0],
			[0, 0, 0, 0],
		]
	];

	const T = [
		[
			[0, 0, 0, 0],
			[0, 1, 1, 1],
			[0, 0, 1, 0],
			[0, 0, 0, 0],
		],
		[
			[0, 0, 1, 0],
			[0, 0, 1, 1],
			[0, 0, 1, 0],
			[0, 0, 0, 0],
		],
		[
			[0, 0, 1, 0],
			[0, 1, 1, 1],
			[0, 0, 0, 0],
			[0, 0, 0, 0],
		],
		[
			[0, 0, 1, 0],
			[0, 1, 1, 0],
			[0, 0, 1, 0],
			[0, 0, 0, 0],
		]
	];

	const PIECES = [
    	O,
    	I,
    	S,
    	Z,
    	L,
    	J,
    	T,
	];

	

  var color_index = Math.floor(Math.random() * colors.length);
  var piece_index = Math.floor(Math.random() * PIECES.length);
  //console.log("piece is ", piece_index);
  //console.log("color is ", colors[color_index]);

  return{
  	piece : PIECES[piece_index],
  	color : colors[color_index],
  	color_ind : color_index,
  }

}

function randomPieces(gl, programInfo){

	isTouchLeft = 0;
	isTouchRight = 0;
	isTouchGround = 0;
	var rand_x = Math.floor(Math.random() * 7 - 2);
	var new_piece = Pieces();
	randomPieces_y = 12;
	//console.log("new piece is ", new_piece.piece);
	//console.log("function name: randomPieces, gl is ", gl);
	drawPiece(new_piece, gl, programInfo, 0, rand_x, randomPieces_y);
	//updateMapmat_addPiece(new_piece, rand_x, randomPieces_y);
	currentPiece = pieceInfo(new_piece, 0, rand_x, randomPieces_y);
	console.log("currentPiece: ", currentPiece);
	
	return; 
}//generate random piece

function update_currentIndex(){
	var ind = 0;
	var i = 12 - randomPieces_y;
	var j ;
	//console.log("index(x, y) is: ", x, " ", y);
	for(var m = 0; m < 4; m++){
		j = currentPiece.current_index[0] + 2;
		for(var n = 0; n < 4 ; n++){
			//console.log("m = ", m, " n = ", n);
			if(currentPiece.current_p.piece[currentPiece.current_shape][m][n] == 1){
				currentPiece.current_pieceMat[ind] = [j, i];
				ind++;
			}

			j++;
		}
		i++;
	}
	//console.log("piecemat is: ", currentPiece.current_pieceMat);

}

function pieceInfo(piece, shape_p, x, y){

	var pieceMat = new Array(4);
	var ind = 0;
	var i = 9 - y;
	var j ;
	//console.log("index(x, y) is: ", x, " ", y);
	for(var m = 0; m < 4; m++){
		j = x + 2;
		for(var n = 0; n < 4 ; n++){
			//console.log("m = ", m, " n = ", n);
			if(piece.piece[shape_p][m][n] == 1){
				pieceMat[ind] = [j, i];
				ind++;
			}

			j++;
		}
		i++;
	}
	return {
		current_shape : shape_p,
		current_index : [x, y],
		current_color : piece.color_ind,
		current_p : piece,
		current_pieceMat : pieceMat,
	}
}

function clearPiece(){
	return null;
}//clear current piece info

function drawCanvas(gl){

  gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
  gl.clearDepth(1.0);                 // Clear everything
  gl.enable(gl.DEPTH_TEST);           // Enable depth testing
  gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

  // Clear the canvas before we start drawing on it.

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Create a perspective matrix, a special matrix that is
  // used to simulate the distortion of perspective in a camera.
  // Our field of view is 45 degrees, with a width/height
  // ratio that matches the display size of the canvas
  // and we only want to see objects between 0.1 units
  // and 100 units away from the camera.
}

function drawBoard(gl, programInfo){

	//console.log("Drawing board!");
	var x_index = -5;
  	var y_index = 10;
  	var color = [0.5, 0.5, 0.5, 1.0];
  	for(;x_index < 6;x_index++){

  		//console.log("x_index is", x_index);
  		var y_1 = -10;
  		var buffers = initBuffers(gl, [x_index, y_1, x_index, y_1+20], color);

  		// Draw the scene
  		drawScene(gl, programInfo, buffers);

  	}
  	for(;y_index > -11;y_index--){

  		//console.log("y_index is", y_index);
  		var x_1 = -5;
  		var buffers = initBuffers(gl, [x_1, y_index, x_1+10, y_index], color);

  		// Draw the scene
  		drawScene(gl, programInfo, buffers);

  	}
}

function drawPiece(piece, gl, programInfo, shape_p, x, y){

	var i;
	var j;
	var piece_x = 0;
	//console.log ("piece is", piece);
	//console.log ("the drawing piece is ",piece.piece[shape_p]);
	for (i = x - 2; i < x + 2; i++){
		var piece_y = 0;
		for (j = y + 1; j> y - 3; j--){

			//console.log ("drawing at canvas index ", i, " ", j);
			//console.log ("the index of piece is", piece_x, " ", piece_y);
			//console.log ("isTure = ", piece.piece[shape_p][piece_x][piece_y]);
			if (piece.piece[shape_p][piece_y][piece_x] == 1){
				//console.log("Entering drawSquare, at index", piece_x, " ", piece_y);
				drawSquare(gl, programInfo, i, j, piece.color);
			}
			piece_y++;
		}
		piece_x++;
	}
	

}

function drawSquare(gl, programInfo, x, y, color){

	var position = [
		x, y,
		x-1, y,
		x, y-1,
		x-1, y-1,
	];
	
	var square_buffers = initBuffers(gl, position, color);
	drawScene_Square(gl, programInfo, square_buffers);// fill color


	var black = [0.0, 0.0, 0.0, 1.0];
	var line_buffers1 = initBuffers(gl, [x, y, x-1, y], black);
	var line_buffers2 = initBuffers(gl, [x-1, y, x-1, y-1], black);
	var line_buffers3 = initBuffers(gl, [x, y-1, x-1, y-1], black);
	var line_buffers4 = initBuffers(gl, [x, y, x, y-1], black);
	drawScene(gl, programInfo, line_buffers1);
	drawScene(gl, programInfo, line_buffers2);
	drawScene(gl, programInfo, line_buffers3);
	drawScene(gl, programInfo, line_buffers4);//draw edges

}

function initBuffers(gl, position, color) {

  // Create a buffer for the square's positions.


  //console.log("gl is ", gl);
  const positionBuffer = gl.createBuffer();

  // Select the positionBuffer as the one to apply buffer
  // operations to from here out.

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // Now create an array of positions for the square.

  const positions = position;

  // Now pass the list of positions into WebGL to build the
  // shape. We do this by creating a Float32Array from the
  // JavaScript array, then use it to fill the current buffer.

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  // Now set up the colors for the vertices

  

  var colors = [
    color[0], color[1], color[2], color[3],
    color[0], color[1], color[2], color[3],
  	color[0], color[1], color[2], color[3],
  	color[0], color[1], color[2], color[3],
    ];
  var colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

  return {
    position: positionBuffer,
    color: colorBuffer,
  };
}



//
// Draw the scene.
//
function drawScene(gl, programInfo, buffers) {

  const fieldOfView = 118.5 * Math.PI / 180;   // in radians
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 0.1;
  const zFar = 100.0;
  const projectionMatrix = mat4.create();

  // note: glmatrix.js always has the first argument
  // as the destination to receive the result.
  mat4.perspective(projectionMatrix,
                   fieldOfView,
                   aspect,
                   zNear,
                   zFar);

  // Set the drawing position to the "identity" point, which is
  // the center of the scene.
  const modelViewMatrix = mat4.create();

  // Now move the drawing position a bit to where we want to
  // start drawing the square.

  mat4.translate(modelViewMatrix,     // destination matrix
                 modelViewMatrix,     // matrix to translate
                 [-0.0, 0.0, -6.0]);  // amount to translate

  // Tell WebGL how to pull out the positions from the position
  // buffer into the vertexPosition attribute
  {
    const numComponents = 2;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexPosition,
        numComponents,
        type,
        normalize,
        stride,
        offset);
    gl.enableVertexAttribArray(
        programInfo.attribLocations.vertexPosition);
  }

  // Tell WebGL how to pull out the colors from the color buffer
  // into the vertexColor attribute.
  {
    const numComponents = 4;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexColor,
        numComponents,
        type,
        normalize,
        stride,
        offset);
    gl.enableVertexAttribArray(
        programInfo.attribLocations.vertexColor);
  }

  // Tell WebGL to use our program when drawing

  gl.useProgram(programInfo.program);

  // Set the shader uniforms

  gl.uniformMatrix4fv(
      programInfo.uniformLocations.projectionMatrix,
      false,
      projectionMatrix);
  gl.uniformMatrix4fv(
      programInfo.uniformLocations.modelViewMatrix,
      false,
      modelViewMatrix);

  {
    const offset = 0;
    const vertexCount = 2;
    gl.drawArrays(gl.LINE_STRIP, offset, vertexCount);
    
  }
}

function drawScene_Square(gl, programInfo, buffers) {

  const fieldOfView = 118.5 * Math.PI / 180;   // in radians
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 0.1;
  const zFar = 100.0;
  const projectionMatrix = mat4.create();

  // note: glmatrix.js always has the first argument
  // as the destination to receive the result.
  mat4.perspective(projectionMatrix,
                   fieldOfView,
                   aspect,
                   zNear,
                   zFar);

  // Set the drawing position to the "identity" point, which is
  // the center of the scene.
  const modelViewMatrix = mat4.create();

  // Now move the drawing position a bit to where we want to
  // start drawing the square.

  mat4.translate(modelViewMatrix,     // destination matrix
                 modelViewMatrix,     // matrix to translate
                 [-0.0, 0.0, -6.0]);  // amount to translate

  // Tell WebGL how to pull out the positions from the position
  // buffer into the vertexPosition attribute
  {
    const numComponents = 2;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexPosition,
        numComponents,
        type,
        normalize,
        stride,
        offset);
    gl.enableVertexAttribArray(
        programInfo.attribLocations.vertexPosition);
  }

  // Tell WebGL how to pull out the colors from the color buffer
  // into the vertexColor attribute.
  {
    const numComponents = 4;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexColor,
        numComponents,
        type,
        normalize,
        stride,
        offset);
    gl.enableVertexAttribArray(
        programInfo.attribLocations.vertexColor);
  }

  // Tell WebGL to use our program when drawing

  gl.useProgram(programInfo.program);

  // Set the shader uniforms

  gl.uniformMatrix4fv(
      programInfo.uniformLocations.projectionMatrix,
      false,
      projectionMatrix);
  gl.uniformMatrix4fv(
      programInfo.uniformLocations.modelViewMatrix,
      false,
      modelViewMatrix);

  {
    const offset = 0;
    const vertexCount = 4;
    gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
    
  }
}

//
// Initialize a shader program, so WebGL knows how to draw our data
//
function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  // Create the shader program

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // If creating the shader program failed, alert

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
    return null;
  }

  return shaderProgram;
}

//
// creates a shader of the given type, uploads the source and
// compiles it.
//
function loadShader(gl, type, source) {
  const shader = gl.createShader(type);

  // Send the source to the shader object

  gl.shaderSource(shader, source);

  // Compile the shader program

  gl.compileShader(shader);

  // See if it compiled successfully

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

