function setup() {
    //Use this to define initial environment properties (i.e., screen size) + load files
    createCanvas(600, 600);
    colorMode(HSL); //Colour set to HSL, rather than RGB
    angleMode(DEGREES);
    rectMode(CORNERS);
    noLoop(); //Static
  }
  
function draw() {
//---VARIABLES---
    let heightSky = 0.45+random(0.1); //Height of the sky 
    let heightMesa = (height*heightSky)-(height*(0.1+random(0.1))); //Height of the mesa    
    let randomHue = random(360); //Random hue
    let randomHue2 = randomHue+180; //Opposite colour ground

    if(randomHue2 > 360){ //Wrap opposite colour
      randomHue2 -= 360;
    }

    let colourSky = color(randomHue,50,75);
    let colourGround = color(randomHue2,50,75);
    let colourMesa = color(lerp(randomHue,randomHue2,0.5),50,75); 
    
    if(random(10) > 7){ //70% chance to be normal sky
        if(random(3) < 2){ //20% to be dusk
          isDusk = 1;
        }
        else{ //10% chance to be night
          isDusk = 0;
          colourSky = color(0,50,0); //Black
        }
    }
    else{
      isDusk = 0; //Day
    }

//---SKY---
    noStroke();
    fill(colourSky);
    rect(0,0,width,height);

    if(isDusk == 1){ //Think about rain also (diagonals) / clouds
      duskWobble(0,0,width,height*heightSky,100*heightSky);
    }

//---MESAS---
    drawMesa(heightMesa, height*heightSky, 30, colourMesa);

//---GROUND---  
    noStroke();
    fill(colourGround);
    drawGround(0,height*heightSky,width,height,36);
}

function drawMesa(y1, y2, res, col){
  let mesaNum = 1+floor(random(3)); //Minimum 1; maximum 4 mesas
  let isMesaStart = round(random());
  let isMesaEnd = round(random());
  let mesaBlocks = ((mesaNum*2)+1)-isMesaStart-isMesaEnd;
  let blockW = width/mesaBlocks;
  
  let mesaW = [];
  mesaW[0] = 0;
  
  let mesaX = [];
  mesaX[0] = 0;
  
  let isMesa = [];
  isMesa[0] = isMesaStart;
  
  //Populate arrays which store a block's x pos, width & isMesa
  for(let i = 0; i < mesaBlocks+1; i++){
    mesaX[i+1] = (i*blockW)+ blockW*0.33 + ceil(random(blockW*0.67));
    mesaW[i+1] = ceil(mesaX[i+1]-mesaX[i]); //Fixed rounding error
    isMesa[i+1] = (isMesa[i] == 1) ? 0 : 1;
  }
  
  let sliceNum = 0;
  let sliceMesa = [];
  let sliceX = [];
  let sliceY = [];
  sliceMesa[0] = isMesaStart;
  sliceX[0] = 0;
  sliceY[0] = (isMesaStart == 1) ? 0 : 0;
  
  let mesaTop = y1+ceil(random((y2-y1)/3));
  let mesaBottom = y2+(100-random(120));
  
  //Subdivide mesas
  for(let i = 0; i < mesaBlocks+1; i++){    
    //Subdivide mesa block
    for(let j = 0; j < ceil(mesaW[i+1]/res); j++){
      sliceMesa[sliceNum] = isMesa[i];
      sliceX[sliceNum] = mesaX[i]+(j*res);
      sliceY[sliceNum] = (sliceMesa[sliceNum] == 1) ? mesaTop+(5-ceil(random(10))) : mesaBottom+(5-ceil(random(10)));
      
      sliceNum += 1;
    }
    
    mesaTop = y1+ceil(random((y2-y1)/3));
    mesaBottom = y2+(100-random(150));
    
    sliceMesa[sliceNum] = sliceMesa[sliceNum-1];
    sliceX[sliceNum] = mesaX[i]+(floor(mesaW[i+1]/res)*res);
    sliceY[sliceNum] = (sliceMesa[sliceNum] == 0) ? (mesaTop+20)+(5-ceil(random(10))) : mesaBottom+(5-ceil(random(10)));
    
    sliceNum += 1;

  }
  
  sliceX[sliceNum+1] = width;
  sliceY[sliceNum+1] = (sliceMesa[sliceNum] == 1) ? mesaTop+(5-ceil(random(10))) : mesaBottom+(5-ceil(random(10)));
  
  //Draw fill
  push();
  fill(col);
  beginShape();

  for(let i = 0; i < sliceNum; i++){
    vertex(sliceX[i],sliceY[i]);
  }

  vertex(width,sliceY[sliceNum]);
  vertex(width,height);
  vertex(0,height);
  vertex(0,sliceY[0]);

  endShape(CLOSE);
  pop();
  
  //Draw outline
  for(let i = 0; i < sliceNum; i++){
      push();
      stroke(0);
      lineWobble(sliceX[i],sliceY[i],sliceX[i+1],sliceY[i+1],0,3);
      pop();
  }
}

function drawGround(x1, y1, x2, y2, res){
//---VARIABLES---
  const c1 = createVector(random(width/4),random(height/20)); //Control point #1
  const c2 = createVector(random(width/4),random(height/20)); //Control point #2

  let new_x = bezierPoint(x1,x1+c1.x,x2-c2.x,x2,0)+(1-random(2));
  let old_x = new_x;
  let new_y = bezierPoint(y1,y1-c1.y,y1-c2.y,y1,0)+(1-random(2));
  let old_y = new_y;

  const isRepeating = round(random());
  const hasGaps = round(random());
  const hasDashes = !isRepeating;
  const lengthDashes = ceil(random(15))+5;

  let gap = [];
  
  for(let i = 0; i < res+1; i++){
    gap[i] = 0;
  }

//---GROUND---
  bezier(x1,y1,x1+c1.x,y1-c1.y,x2-c2.x,y1-c2.y,x2,y1);
  rect(x1,y1-1,x2,y2);

  stroke(0); //Black

  for(let i = 0; i < res+1; i++){
    //Update co-ordinates
    new_x = bezierPoint(x1,x1+c1.x,x2-c2.x,x2,i/res)+(1-random(2));
    new_y = bezierPoint(y1,y1-c1.y,y1-c2.y,y1,i/res)+(1-random(2));  
    
    //Update stroke weight
    strokeWeight(1.25+random(0.5));

    //Draw line segment
    if(gap[i] == 0){
      line(old_x,old_y,new_x,new_y);

      //Draw dashes
      if(hasDashes == 1){
        let strokeX = (lengthDashes+(2-random(4)))*cos(225+(0.5-random(1)));
        let strokeY = (lengthDashes+(2-random(4)))*sin(45+(0.5-random(1)));

        strokeWeight(1+random(0.25));
        line(old_x,old_y,old_x+strokeX,old_y+strokeY);
      }

      //Cut gaps
      if(hasGaps == 1 && random(res) > res-1){
        let gapDistance = ceil(random(2));

        for(let j = 0; j < gapDistance; j++){
          gap[i+(j+1)] = 1;  
        }
      }
    }

    //Re-update co-ordinates
    old_x = new_x;
    old_y = new_y;
  }

  if(isRepeating == 1){
    let lineRepeat = ceil(random(5))+2;

    for(let j = 0; j < lineRepeat; j++){
      let new_x = bezierPoint(x1,x1+c1.x,x2-c2.x,x2,0)+(0.5-random(1));
      let old_x = new_x;
      let new_y = bezierPoint(y1,y1-c1.y,y1-c2.y,y1,0)+(0.5-random(1))+(j*5);
      let old_y = new_y;

      for(let k = 0; k < res+1; k++){
        new_x = bezierPoint(x1,x1+c1.x,x2-c2.x,x2,k/res)+(0.5-random(1));
        new_y = bezierPoint(y1,y1-c1.y,y1-c2.y,y1,k/res)+(0.5-random(1))+(j*5);

        strokeWeight(1.25+random(0.5)-(j/lineRepeat)); //Code for thinning lines

        line(old_x,old_y,new_x,new_y);

        old_x = new_x;
        old_y = new_y;      
      }
    }
  }

//---PATH---
  /*let path_x1 = bezierPoint(x1,x1+c1.x,x2-c2.x,x2,0.3);
  let path_y1 = bezierPoint(y1,y1-c1.y,y1-c2.y,y1,0.3);
  let path_x2 = bezierPoint(x1,x1+c1.x,x2-c2.x,x2,0.4);
  let path_y2 = bezierPoint(y1,y1-c1.y,y1-c2.y,y1,0.4);

  //noFill();  
  bezier(path_x1,path_y1,lerp(path_x1,width*0.66,0.33),path_y1,path_x1,lerp(path_y1,height,0.66),width*0.66,height);
  bezier(path_x2,path_y2,lerp(path_x2,width*0.88,0.33),path_y2,path_x2,lerp(path_y2,height,0.66),width*0.88,height);
  */
}

function duskWobble(x1, y1, x2, y2, res){
  let inc = 0.5; //Random increments
  let gap = 0; //Gap
  let new_x = x1;
  let old_x = new_x+(inc-random(inc*2));
  let new_y = lerp(y1,y2,(i+2)/res);
  let old_y = new_y+(inc-random(inc*2));
  
  stroke(0); //Black
  
  for(var i = 0; i < res; i++){
    for(var j = 0; j < res; j++){
      new_x = lerp(x1,x2,(j+1)/res)+(inc-random(inc*2));
      new_y = lerp(y1,y2,(i+1)/res)+(inc-random(inc*2));

      if(gap == 0){ //If no gap...
        strokeWeight(0.75+random(0.5)); //...vary stroke length
        line(old_x,old_y,new_x,new_y); //...draw line...

        if(random(50) >= 49){ //...then 1/50 chance for there to be a gap
          gap = ceil(random(3)); //Gap lasts for a variable length of time
        }
      }
      else{
        gap -= 1;
      }

      old_x = new_x;
      old_y = new_y;
    }

    old_x = x1;
    old_y = lerp(y1,y2,(i+2)/res);
    gap = 0; //Reset gap so new line doesn't start w/a break
    stroke(0+random(10));
  }  
}

function bezierWobble(x1, y1, cx1, cy1, cx2, cy2, x2, y2, gap, res){
  let t = 0;
  let new_x = bezierPoint(x1,x1+cx1,x2-cx2,x2,t)+(1-random(2));
  let old_x = new_x;
  let new_y = bezierPoint(y1,y1+cy1,y2-cy2,y2,t)+(1-random(2));
  let old_y = new_y;

  for(let i = 0; i < res+1; i++){
    t = i/res;
    new_x = bezierPoint(x1,x1+cx1,x2-cx2,x2,t)+(1-random(2));
    new_y = bezierPoint(y1,y1+cy1,y2-cy2,y2,t)+(1-random(2));  
    
    if(random(1) > gap){
      strokeWeight(1.25+random(0.5));
      line(old_x,old_y,new_x,new_y);
    }

    old_x = new_x;
    old_y = new_y;
  }
}

function bezierQuadraticWobble(x1, y1, cx, cy, x2, y2, gap, res){
  let t = 0;
  let new_x = lerp(lerp(x1,cx,t),lerp(cx,x2,t),t)+(1-random(2));
  let new_y = lerp(lerp(y1,cy,t),lerp(cy,y2,t),t)+(1-random(2));
  let old_x = new_x;
  let old_y = new_y;
  
  for(i = 0; i < res; i++){
    t = i/res;
    new_x = lerp(lerp(x1,cx,t),lerp(cx,x2,t),t)+(1-random(2));;
    new_y = lerp(lerp(y1,cy,t),lerp(cy,y2,t),t)+(1-random(2));;
    
    if(random(1) > gap){
      strokeWeight(1.25+random(0.5));
      line(old_x,old_y,new_x,new_y);
    }
    
    old_x = new_x;
    old_y = new_y;
  }
}

function lineWobble(x1, y1, x2, y2, gap, res) {
  let new_x = x1;
  let old_x = new_x;
  let new_y = y1;
  let old_y = new_y;

  stroke(0); //Black

  for (let i = 0; i < res; i++) {
    new_x = lerp(x1, x2, (i+1)/res)+(1-random(2));
    new_y = lerp(y1, y2, (i+1)/res)+(1-random(2));
    
    if(random(1) > gap){
      strokeWeight(1.25+random(0.5));
      line(old_x,old_y,new_x,new_y);
    }
    
    old_x = new_x;
    old_y = new_y;
  }
}

//Allow for click refreshing
function mouseClicked() {
  loop();
  noLoop();
}