var info = document.getElementById('main');

var scale = 2/5, step = 4; /* game to world ratio */
var fingerAlignment = [], delta = [], pos = 0;
var coordinates = {}, data = [], i = 0, j = 0, k = 0, start = 0, fingers;

function evaluateGesture(fingerAlignment){
    var velocity = 1, friction = 0.5;
    var fingerWeights = [], j = 0, move = [];
    for(var j=0; j<3; j++){
    fingerWeights[j] = 0;
    for(var i=0; i<fingerAlignment.length; i++)
      fingerWeights[j] += fingerAlignment[i][j];
    if(fingerWeights[j] >= 4){
      velocity *= friction;
      move[j] = velocity;
    }
    else if(fingerWeights[j] <= -4){
      velocity *= friction;
      move[j] = -velocity;
    }
    else if(fingerWeights[j] == 0)
      move[j] = 0
    }
    return move;
}

Leap.loop(function(frame){
    for(i = 0, fingers = frame.pointables.length; i < fingers; i++)
    data[i] = frame.pointables[i].tipPosition;
    if(fingers != 0){
        coordinates[j] = data;
        if(j%step == 0 && j>=step){
            start = j-step;
            for (k = 0; k < fingers; k++){
            delta = [];
            for (pos = 0; pos < 3; pos++){
                if(coordinates[j-step][k] != undefined){
                delta[pos] = coordinates[j][k][pos] - coordinates[j-step][k][pos];
                if(Math.abs(delta[pos]) > (1/scale))
                  delta[pos] = delta[pos] > 0 ? 1 : -1;
                else
                  delta[pos] = 0;
                }
            }
            fingerAlignment[k] = delta;
            var move = evaluateGesture(fingerAlignment);
            if(move[0]!==undefined) cube.Mesh.position.x += move[0];
            if(move[1]!==undefined) cube.Mesh.position.y += move[1];
            frame.hands.forEach(function(hand){
                radians = hand.roll();
                    if(radians > Math.PI/4 && radians < Math.PI/2) worldRotate(1);
                    else if(radians > -Math.PI/2 && radians < -Math.PI/4) worldRotate(-1);
                });
            }
            for (k = j-1; k >= start; k--)
                delete coordinates[k];
        }
        data = [];
        j++;
    }
});