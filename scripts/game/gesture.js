var info = document.getElementById('main');

var scale = 2/5, step = 9; /* game to world ratio */
var fingerAlignment = [], delta = [], pos = 0;
var coordinates = {}, data = [], i = 0, j = 0, k = 0, start = 0, fingers;

Leap.loop(function(frame){
  frame.hands.forEach(function(hand, index) {
    //console.log(hand.roll());
  });

  for(i = 0, fingers = frame.pointables.length; i < fingers; i++)
    data[i] = frame.pointables[i].tipPosition;
  //console.log(fingers);
  if(fingers == 0){
  }
  else{ 
    coordinates[j] = data;
    //console.log(coordinates)
    if(j%step == 0 && j>=step){
      start = j-step;
      for (k = 0; k < fingers; k++){
        //console.log('Finger : '+k);
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
      }
      for (k = j-1; k >= start; k--)
        delete coordinates[k];
      //console.log(coordinates);
    }
    data = [];
    j++;
    console.log(fingerAlignment[0],fingerAlignment[1],fingerAlignment[2],fingerAlignment[3],fingerAlignment[4]);
  }
});