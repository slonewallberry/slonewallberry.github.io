/*
---TO DO LIST---

  -> Different sky styles (waves, clouds, rain, moon)
  -> Different background objects (trees, different mesas)
  -> Foreground objects (paths, pools of water)
  -> Frames (cliff edge, looking out of window / veranda)
    -> Add plants to veranda scene
  -> Numbers

*/

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
  //Colours    
  let hueSky = random(360);
  let hueGround = hueSky+180;

  if(hueGround > 360){
    hueGround -= 360;
  }

  let hueMesa = lerp(hueSky,hueGround,0.66);
  let hueSun = lerp(hueSky,hueGround,0.33);
  let sat = 50+(5-random(10));
  let bri = 75+(5-random(10));

  if(random(20) > 19){
    hueSky = 0;
    hueGround = 0;
    hueMesa = 0;   
    hueSun = 0;
    sat = 100;
    bri = 100;
  }

  //Heights
  let heightSky = 0.45+random(0.1);
  let heightSpace = 1; //0 - top; 1 - middle; 2 - bottom;

  if(random(5) >= 4){
    heightSky = (round(random()) == 1) ? 0.25+random(0.1) : 0.75+random(0.1); 
    heightSpace = (heightSky < 0.36) ? 0 : 2;
  }
  
  let heightMesa = (height*heightSky)-(height*(0.1+random(0.1)));

//---SKY---
  let isNight = (random(20) > 19) ? 1 : 0;
  let styleSky = (random(10) < 7) ? 0 : 1;
  
  if(styleSky == 1){
    styleSky = (round(random()) == 1) ? 1 : 2;
  }

  noStroke();

  if(isNight == 1){
    fill(0);     
  }
  else{
    fill(color(hueSky,sat,bri));
  }

  rect(0,0,width,height);

  switch(styleSky){
    case 1:
      drawSun((width/10)*(2+ceil(random(7))),(heightMesa/8)*(1+ceil(random(6))), [hueSun, sat, bri]);
    break;

    case 2:
      drawMist(0,0,width,height*heightSky,100*heightSky);
    break;
  }

//---BACKGROUND---
  const treeNum = ceil(random(4)); 
  const styleTree = ceil(random(3));
  let styleBack = (random() == 1) ? 0 : 1;

  if(styleBack == 1){
    styleBack = (round(random()) == 1) ? 1 : 2;  
  }

  switch(styleBack){
    case 1:
      drawMesa(heightMesa, height*heightSky, 30, [hueMesa, sat, bri]);
    break;

    case 2:
      for(let i = 0; i < treeNum; i++){
        if(random() > 0.4){
          drawTree(((width/treeNum)*i)+random((width/treeNum)*0.66), height*heightSky, 10+random(10), 45+random(30), [hueMesa, sat, bri], [hueSun, sat, bri], styleTree);
        }
      }
    break;
  }

//---MIDGROUND---  
  noStroke();
  fill(color(hueGround,sat,bri));
  drawGround(0,height*heightSky,width,height,36);

  if(random(5) > 4 && heightSpace != 2){
    drawLake(100+random(400),height*heightSky+50+random(150), 10, 20, 8+random(8), 1+random(2), 1, [hueSky, sat, bri], [hueMesa, sat, bri]);
  }

//---FOREGROUND---
  let hasVeranda = (heightSky >= 0.36) ? 1 : 0;

  if(hasVeranda == 1){
    hasVeranda = (random(20) > 19) ? 1 : 0;
  }

  if(hasVeranda == 1){
    drawVeranda([hueMesa, sat, bri]);
  }
}

//Draw (wholes)

function drawSun(x, y, col){
  let styleSun  = (round(random()) == 1) ? 1 : 0; 

  if(styleSun == 1){
    styleSun = (round(random()) == 1) ? 1 : 2;
  }

  let sunSize = 0.25+random(1.25);
  let ringNum = 1+ceil(random(3));
  let rayNum = (round(random()) == 0) ? 45 : 60;
  let rayOff = random(rayNum);

  switch(styleSun){
    case 0:
      ellipseWobble(x, y, 20*sunSize, 30*sunSize, 1, 1, 1, [col[0],col[1],col[2]], 0);  
    break;

    case 1:
      for(let i = 0; i < ringNum; i++){
        let gap = (1/ringNum) * (i+1);
        ellipseWobble(x, y, (20*(i+2))*sunSize, (30*(i+2))*sunSize, 1, 1, 1, [-1,-1,-1], gap);  
      }

      ellipseWobble(x, y, 10*sunSize, 20*sunSize, 1, 1, 1, [col[0],col[1],col[2]], 0); 
    break;

    case 2:
      ellipseWobble(x, y, 20*sunSize, 30*sunSize, 1, 1, 1, [col[0],col[1],col[2]], 0);  

      for(let i = 0; i < 360; i += rayNum){
        let x1 = x+(((40+random(20))*sunSize)*cos(i+rayOff));
        let y1 = y+(((40+random(20))*sunSize)*sin(i+rayOff));
        let x2 = x+(((190+random(20))*sunSize)*cos(i+rayOff));
        let y2 = y+(((190+random(20))*sunSize)*sin(i+rayOff));
        lineWobble(x1, y1, x2, y2, 0, 20, 1.25);
      }

      for(let i = 0; i < 360; i += rayNum){
        let x1 = x+(((30+random(20))*sunSize)*cos(i+(rayNum/2)+rayOff));
        let y1 = y+(((30+random(20))*sunSize)*sin(i+(rayNum/2)+rayOff));
        let x2 = x+(((120+random(20))*sunSize)*cos(i+(rayNum/2)+rayOff));
        let y2 = y+(((120+random(20))*sunSize)*sin(i+(rayNum/2)+rayOff));
        lineWobble(x1, y1, x2, y2, 0, 20, 1);
      }

    break;
  }

  noiseSeed(random(999999));
}

function drawMist(x1, y1, x2, y2, res){
  let inc = 0.5;
  let gap = 0; 
  let new_x = x1;
  let old_x = new_x+(inc-random(inc*2));
  let new_y = lerp(y1,y2,(i+2)/res);
  let old_y = new_y+(inc-random(inc*2));
  
  stroke(0);
  
  for(var i = 0; i < res; i++){
    for(var j = 0; j < res; j++){
      new_x = lerp(x1,x2,(j+1)/res)+(inc-random(inc*2));
      new_y = lerp(y1,y2,(i+1)/res)+(inc-random(inc*2));

      if(gap == 0){ 
        strokeWeight(0.75+random(0.5));
        line(old_x,old_y,new_x,new_y);

        if(random(50) >= 49){ 
          gap = ceil(random(3));
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
    gap = 0;
    stroke(0+random(10));
  }  
}

function drawMesa(y1, y2, res, col){
//---VARIABLES---
  const mesaNum = 1+floor(random(3)); //Minimum 1; maximum 4 mesas
  const isMesaStart = round(random());
  const isMesaEnd = round(random());
  const mesaBlocks = ((mesaNum*2)+1)-isMesaStart-isMesaEnd;
  const blockW = width/mesaBlocks;
  
  let mesaW = [];
  mesaW[0] = 0;
  
  let mesaX = [];
  mesaX[0] = 0;
  
  let isMesa = [];
  isMesa[0] = isMesaStart;
  
//---BLOCK XPOS, WIDTH, ISMESA---
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

  const isShaded = round(random());
  const styleShade = round(random());
  let shadeX = [];
  let shadeY = [];
  shadeX[0] = 0;
  shadeY[0] = 0;
  
//---SUBDIVIDE MESA---
  for(let i = 0; i < mesaBlocks+1; i++){    
    //Subdivide mesa block
    for(let j = 0; j < ceil(mesaW[i+1]/res); j++){
      sliceMesa[sliceNum] = isMesa[i];
      sliceX[sliceNum] = mesaX[i]+(j*res);
      sliceY[sliceNum] = (sliceMesa[sliceNum] == 1) ? mesaTop+(5-ceil(random(10))) : mesaBottom+(5-ceil(random(10)));
      
      shadeX[sliceNum] = (sliceMesa[sliceNum] == 1) ? sliceX[sliceNum] : -1;
      shadeY[sliceNum] = (sliceMesa[sliceNum] == 1) ? sliceY[sliceNum] : -1;

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
  
//---DRAWING (3D)---
  const is3D = round(random());
  const colMesa = color([col[0],col[1],col[2]]);
  const col3D = (col[0] == 0) ? color(col[0],col[1],0) : color(col[0],col[1]-20,col[2]-25);

  //Draw 3D
  if(is3D == 1){
    let depth3D = 3+ceil(random(8));

    //Draw 3D block fill
    push();

    fill(col3D);
    beginShape();
  
    for(let i = 0; i < sliceNum; i++){
      vertex(sliceX[i]-depth3D,sliceY[i]);
    }
  
    vertex(width,sliceY[sliceNum]);
    vertex(width,height);
    vertex(0,height);
    vertex(0,sliceY[0]);
  
    endShape(CLOSE);
  
    pop();

    //Draw 3D outline
    for(let i = 0; i < sliceNum; i++){
      push();

      stroke(0);
      lineWobble(sliceX[i]-depth3D,sliceY[i],sliceX[i+1]-depth3D,sliceY[i+1],0,3,1);

      pop();
  }
  }

//---DRAWING NORMAL---
  //Draw block fill
  push();

  fill(colMesa);
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
      //Draw outlines
      lineWobble(sliceX[i],sliceY[i],sliceX[i+1],sliceY[i+1],0,3,1.25);

      //Draw stripe-shading
      if(isShaded == 1 && shadeX[i] != -1 && shadeY[i] != -1){
        if(styleShade == 0){
          let shadeNum = 1+ceil(random(2));

          for(let j = 0; j < shadeNum; j++){
            let xx = lerp(sliceX[i],sliceX[i+1],(1/shadeNum)*j);
            let yy = lerp(sliceY[i],sliceY[i+1],(1/shadeNum)*j);
            
            lineWobble(xx+(2-random(4)),yy+(2+random(5)),xx+(2-random(4)),y2-(2-random(5)),0,2,1.25);
          }
        }

        //Draw spot-shading
        else if(styleShade == 1 && shadeX[i+1] != -1 && shadeX[i+2] != -1 && shadeX[i-1] != -1){
          let shadeNum = 3+ceil(random(3));

          for(let j = 0; j < shadeNum; j++){
            for(let k = 0; k <shadeNum; k++){
              let xx = lerp(sliceX[i],sliceX[i+1],(1/shadeNum)*j);
              let yy = lerp(sliceY[i],sliceY[i+1],(1/shadeNum)*k);
              xx = lerp(xx+(2-random(4)),xx+(2-random(4)),random());
              yy = lerp(yy+(2+random(5)),y2+10,random());

              fill(0);
              ellipse(xx,yy,0.5+ceil(random(1)),0.5+ceil(random(1)));
            }
          }
        }
      } 

      pop();
  }
}

function drawTree(x, y, w, h, col, col2, style){
  const ridgeNum = 4+ceil(random(8));
  const shrubNum = ceil(random(4));
  
  push();
  
  //Trunk fill
  fill(color(col[0], col[1], col[2]));
  noStroke();
  
  beginShape();
  vertex(x-(w/2),y);
  vertex(x-(w/3),y-h);
  vertex(x+(w/3),y-h);
  vertex(x+(w/2),y);
  endShape(CLOSE);
  
  //Trunk outline
  noFill();
  lineWobble(x-(w/2),y,x-(w/3),y-h,0,3,2);
  
  for(let i = 0; i < ridgeNum; i++){
    let ridgeHeight = y-(i*(h/ridgeNum));
    let ridgeX = lerp(x-(w/2),x-(w/3),i/ridgeNum);
    
    lineWobble(ridgeX,ridgeHeight,ridgeX+random(w/2),ridgeHeight,0,2,1.25);
  }
  
  lineWobble(x+(w/2),y,x+(w/3),y-h,0,3,1.25);

  //Topiary
  let new_y = y;
  let wScale = (round(random()) == 1) ? 0 : 0.1+random(0.3);
  let hScale = (wScale == 1) ? 0 : 0.1+random(0.3);

  switch(style){
    case 1: //Shrubs
      new_y = y;
  
      for(let i = 0; i < shrubNum; i++){
        let r = 15-((15/shrubNum)*i);
        
        ellipseWobble(x+(2.5-random(5)), new_y-h, r, r*2, 1, 1.2, 1.125, [col2[0], col2[1], col2[2]], 0);    
        new_y -= (r*1.2)*1.5;
        noiseSeed(random(9999999));
      }
    break;

    case 2: //Fuzzy
      wScale = (round(random()) == 1) ? 0 : 0.1+random(0.3);
      hScale = (wScale == 1) ? 0 : 0.1+random(0.3);

      ellipseWobble(x+(1.25-random(2.5)), y-h, 15, 30, 1+wScale, 1+hScale, 5, [col2[0], col2[1], col2[2]], 0);
      noiseSeed(random(9999999));
    break;

    case 3: //Crown
      wScale = 2+random(3);
      new_y = y-(20+random(15));

      lineWobble(x-((w/2)*wScale),y-h+3,x-((w/2)*wScale),new_y-h,0,5,1.25);
      lineWobble(x-((w/2)*wScale),y-h+3,x+((w/2)*wScale),y-h+3,0,5,1.25);
      lineWobble(x+((w/2)*wScale),y-h+3,x+((w/2)*wScale),new_y-h,0,5,1.25);
      lineWobble(x-((w/2)*wScale),new_y-h,x,new_y-(h*0.66),0,5,1.25);
      lineWobble(x+((w/2)*wScale),new_y-h,x,new_y-(h*0.66),0,5,1.25);

      fill(color([col2[0], col2[1], col2[2]]));
      beginShape();
      vertex(x-((w/2)*wScale),y-h+3);
      vertex(x-((w/2)*wScale),new_y-h);
      vertex(x,new_y-(h*0.66));
      vertex(x+((w/2)*wScale),new_y-h);
      vertex(x+((w/2)*wScale),y-h+3);
      endShape(CLOSE);
    break;
  }

  pop();
}

function drawGround(x1, y1, x2, y2, res){
//---VARIABLES---
  const c1 = createVector(random(width/4),random(height/20)); //Control point #1
  const c2 = createVector(random(width/4),random(height/20)); //Control point #2

  let new_x = bezierPoint(x1,x1+c1.x,x2-c2.x,x2,0)+(1-random(2));
  let old_x = new_x;
  let new_y = bezierPoint(y1,y1-c1.y,y1-c2.y,y1,0)+(1-random(2));
  let old_y = new_y;

  const groundStyle = floor(random(3)); //0 = nothing; 1 = dashes; 2 = repeating lines
  const hasGaps = round(random());
  const hasGrass = round(random());
  const grassNum = 1+ceil(random(4));
  const dashDir = 225;

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
      if(groundStyle == 1){
        drawDashes(old_x,old_y,new_x,new_y,dashDir);
      }

      //Cut gaps
      if(hasGaps == 1 && (random(res) > (res-1) - (res/grassNum*hasGrass))){
        let gapDistance = ceil(random(2));

        for(let j = 0; j < gapDistance; j++){
          gap[i+(j+1)] = 1;  
        }
      }
    }
    else{
      if(hasGrass == 1){
        for(let i = 0; i < 3; i++){
          let grassX = lerp(old_x,new_x,0.25+(0.25*i));
          let grassY = lerp(old_y,new_y,0.25+(0.25*i));

          strokeWeight(1+random(0.33));
          line(grassX,grassY,grassX+(2.5-random(5)),grassY-(2.5+random(12.5)));
        }
      }
    }

    //Re-update co-ordinates
    old_x = new_x;
    old_y = new_y;
  }

  if(groundStyle == 2){
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

  noFill();  
  bezierWobble(path_x1,path_y1,lerp(path_x1,width*0.66,0.33),path_y1,path_x1,lerp(path_y1,height,0.66),width*0.66,height,0,30);
  bezierWobble(path_x2,path_y2,lerp(path_x2,width*0.88,0.33),path_y2,path_x2,lerp(path_y2,height,0.66),width*0.88,height,0,30);
  //*/
}

function drawDashes(x1, y1, x2, y2, dir){
  let lengthDashes = ceil(random(15))+5;

  let strokeX = (lengthDashes+(2-random(4)))*cos(dir+(0.5-random(1)));
  let strokeY = (lengthDashes+(2-random(4)))*sin(45+(0.5-random(1)));
  let midX1 = lerp(x1,x2,0.33);
  let midX2 = lerp(x1,x2,0.66);
  let midY1 = lerp(y1,y2,0.33);
  let midY2 = lerp(y1,y2,0.66);

  strokeWeight(1+random(0.25));
  line(x1,y1,x1+strokeX,y1+strokeY);

  strokeX = ((lengthDashes*0.66)+(2-random(4)))*cos(dir+(0.25-random(0.5)));
  strokeY = ((lengthDashes*0.66)+(2-random(4)))*sin(45+(0.25-random(0.5)));

  strokeWeight(0.5+random(0.125));
  line(midX1,midY1,midX1+strokeX,midY1+strokeY);
  line(midX2,midY2,midX2+strokeX,midY2+strokeY);
}

function drawLake(x, y, rMin, rMax, w, h, noiseMax, col, col2){
  const lakeDepth = (random(20) < 19) ? 10+random(15) : 200;
  const ridgeNum = ceil(random(2));
  const colRidge = (col2[0] == 0) ? color(col2[0],col2[1],100) : color(col2[0],col2[1]-20,col2[2]-25);
  let ridgeCon = 0;
  
  let offsetX = map(cos(0),-1,1,0,noiseMax);
  let offsetY = map(sin(0),-1,1,0,noiseMax);
  let r = map(noise(offsetX, offsetY),0,1,rMin,rMax);
  let new_x = (r*w) * cos(0);
  let new_y = (r*h) * sin(0);
  let old_x = new_x;
  let old_y = new_y;

  lakeCanvas = createGraphics(width,height);
  angleMode(RADIANS);

  lakeCanvas.push();
  lakeCanvas.fill(colRidge);
  lakeCanvas.rect(0,0,width,height);
  
  lakeCanvas.translate(x,y);
  
  //Lower ring outline
  for(let i = 0; i < TWO_PI; i += 0.1){
    offsetX = map(cos(i),-1,1,0,noiseMax);
    offsetY = map(sin(i),-1,1,0,noiseMax);
    r = map(noise(offsetX, offsetY),0,1,rMin,rMax);
    new_x = (r*w) * cos(i);
    new_y = (r*h) * sin(i);
    
    //Draw ring
    lakeCanvas.strokeWeight(1.25+random(0.5));
    lakeCanvas.line(old_x,old_y+lakeDepth,new_x,new_y+lakeDepth);
    
    //Draw ridges
    lakeCanvas.strokeWeight(0.75+random(0.25));
    let wob_new_x = old_x;
    let wob_old_x = wob_new_x;
    let wob_new_y = old_y;
    let wob_old_y = wob_new_y;
    let wob_res = lakeDepth/5;

    if(ridgeCon % ridgeNum == 0){
      for (let j = 0; j < wob_res; j++) {
        wob_new_x = lerp(old_x, old_x, (j+1)/wob_res)+(1-random(2));
        wob_new_y = lerp(old_y, old_y+lakeDepth, (j+1)/wob_res)+(1-random(2));

        if(random() > 0.1){
          lakeCanvas.line(wob_old_x,wob_old_y,wob_new_x,wob_new_y);
        }

        wob_old_x = wob_new_x;
        wob_old_y = wob_new_y;
      }
    }

    old_x = new_x;
    old_y = new_y;
    ridgeCon += 1;
  }
  
  //Lower ring fill
  lakeCanvas.fill(color(col[0],col[1],col[2]));
  lakeCanvas.beginShape();

  for(let i = 0; i < TWO_PI; i += 0.1){
    offsetX = map(cos(i),-1,1,0,noiseMax);
    offsetY = map(sin(i),-1,1,0,noiseMax);
    r = map(noise(offsetX, offsetY),0,1,rMin,rMax);
    new_x = (r*w) * cos(i);
    new_y = (r*h) * sin(i);
    lakeCanvas.vertex(new_x,new_y+lakeDepth);  
  }

  lakeCanvas.endShape(CLOSE);
  
  offsetX = map(cos(0),-1,1,0,noiseMax);
  offsetY = map(sin(0),-1,1,0,noiseMax);
  r = map(noise(offsetX, offsetY),0,1,rMin,rMax);
  old_x = (r*w) * cos(0);
  old_y = (r*h) * sin(0);

  //Upper ring fill
  let old_x2 = (r*(w*40)) * cos(0); 
  let old_y2 = (r*(h*40)) * sin(0);
  let new_x2 = old_x2; 
  let new_y2 = old_y2;
  
  lakeCanvas.erase();
  lakeCanvas.beginShape(QUADS);
  
  for(let i = 0; i < TWO_PI+1; i += 0.1){
    offsetX = map(cos(i),-1,1,0,noiseMax);
    offsetY = map(sin(i),-1,1,0,noiseMax);
    r = map(noise(offsetX, offsetY),0,1,rMin,rMax);
    new_x = (r*w) * cos(i);
    new_y = (r*h) * sin(i);
    
    new_x2 = (r*(w*40)) * cos(i); 
    new_y2 = (r*(h*40)) * sin(i); 
    
    lakeCanvas.vertex(old_x2,old_y2);
    lakeCanvas.vertex(new_x2,new_y2);    
    lakeCanvas.vertex(new_x,new_y);  
    lakeCanvas.vertex(old_x,old_y);

    old_x = new_x;
    old_y = new_y;
    old_x2 = new_x2;
    old_y2 = new_y2;
  }
  
  lakeCanvas.endShape(CLOSE);
  lakeCanvas.noErase();
  
  //Upper ring outline
  offsetX = map(cos(0),-1,1,0,noiseMax);
  offsetY = map(sin(0),-1,1,0,noiseMax);
  r = map(noise(offsetX, offsetY),0,1,rMin,rMax);
  old_x = (r*w) * cos(0);
  old_y = (r*h) * sin(0);

  for(let i = 0; i < TWO_PI+1; i += 0.1){
    offsetX = map(cos(i),-1,1,0,noiseMax);
    offsetY = map(sin(i),-1,1,0,noiseMax);
    r = map(noise(offsetX, offsetY),0,1,rMin,rMax);
    new_x = (r*w) * cos(i);
    new_y = (r*h) * sin(i);
    
    lakeCanvas.strokeWeight(1.25+random(0.5));
    lakeCanvas.line(old_x,old_y,new_x,new_y);

    old_x = new_x;
    old_y = new_y;
  }
  
  lakeCanvas.pop();
  
  image(lakeCanvas,0,0);
  
  angleMode(DEGREES);
  noiseSeed(random(999999));
}

function drawVeranda(col){
  const margin = (width/10)+10-random(20);
  const styleMargin = round(random());
  const colVeranda = (col[0] == 0) ? color(col[0],col[1],0) : color(col[0],col[1]-20,col[2]-25);
  const colBauble = (col[0] == 0) ? color(255,col[1],255) : color(col[0],col[1]-20,col[2]-40);
  const baubleNum = 1+floor(random(4));
  const baubleSize = 0.5+random(1.5);

  //Draw fill
  push();
  noStroke();
  fill(colVeranda);
  beginShape();
  vertex(0,0);
  vertex(0,height);
  vertex(margin,height);
  vertex(margin,margin*2);

  if(styleMargin == 0){
    quadraticVertex(margin,margin,margin*2,margin); 
  }
  else{
    quadraticVertex(margin*2,margin*2,margin*2,margin);  
  }

  vertex(width-(margin*2),margin);

  if(styleMargin == 0){
    quadraticVertex(width-margin,margin,width-margin,margin*2,); 
  }
  else{
    quadraticVertex(width-(margin*2),margin*2,width-margin,margin*2);  
  }

  vertex(width-margin,height);
  vertex(width,height);
  vertex(width,0);

  endShape(CLOSE);
  pop();

  //Draw outline
  lineWobble(margin,margin*2,margin,height,0,20,1.25);
  if(styleMargin == 0){
    bezierQuadraticWobble(margin,margin*2,margin,margin,margin*2,margin,0,20);
  }
  else{
    bezierQuadraticWobble(margin,margin*2,margin*2,margin*2,margin*2,margin,0,20);    
  }
  lineWobble(margin*2,margin,width-(margin*2),margin,0,20,1.25);

  if(styleMargin == 0){
    bezierQuadraticWobble(width-margin,margin*2,width-margin,margin,width-(margin*2),margin,0,20);
  }
  else{
    bezierQuadraticWobble(width-margin,margin*2,width-(margin*2),margin*2,width-(margin*2),margin,0,20);
  }
  lineWobble(width-margin,margin*2,width-margin,height,0,20,1.25);

  //Draw baubles
  push();
  fill(colBauble);
  noStroke();
  for(let i = 0; i < baubleNum+1; i++){
    let x = (width/(baubleNum+2))*(i+1);
    let y = margin/2;
    beginShape();
    vertex(x-(10*baubleSize),y);
    vertex(x,y-(10*baubleSize));
    vertex(x+(10*baubleSize),y);
    vertex(x,y+(10*baubleSize));
    endShape(CLOSE);
  }
  pop();

  for(let i = 0; i < baubleNum+1; i++){
    let x = (width/(baubleNum+2))*(i+1);
    let y = margin/2;
    lineWobble(x-(10*baubleSize),y,x,y-(10*baubleSize),0,2,1.25);
    lineWobble(x,y-(10*baubleSize),x+(10*baubleSize),y,0,2,1.25);
    lineWobble(x+(10*baubleSize),y,x,y+(10*baubleSize),0,2,1.25);
    lineWobble(x,y+(10*baubleSize),x-(10*baubleSize),y,0,2,1.25);
  }
}

//Draw (parts)

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
  
  for(i = 0; i < res+1; i++){
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

function lineWobble(x1, y1, x2, y2, gap, res, weight) {
  let new_x = x1;
  let old_x = new_x;
  let new_y = y1;
  let old_y = new_y;

  stroke(0);

  for (let i = 0; i < res; i++) {
    new_x = lerp(x1, x2, (i+1)/res)+(1-random(2));
    new_y = lerp(y1, y2, (i+1)/res)+(1-random(2));
    
    if(random() > gap){
      strokeWeight(weight+random(weight/3));
      line(old_x,old_y,new_x,new_y);
    }
    
    old_x = new_x;
    old_y = new_y;
  }
}

function ellipseWobble(x, y, rMin, rMax, w, h, noiseMax, col, gap){
  let offsetX = map(cos(0),-1,1,0,noiseMax);
  let offsetY = map(sin(0),-1,1,0,noiseMax);
  let r = map(noise(offsetX, offsetY),0,1,rMin,rMax);
  let new_x = (r*w) * cos(0);
  let new_y = (r*h) * sin(0);
  let old_x = new_x;
  let old_y = new_y;

  angleMode(RADIANS);

  push();
  
  stroke(0);
  
  translate(x,y);

  for(let i = 0; i < TWO_PI; i += 0.1){
    offsetX = map(cos(i),-1,1,0,noiseMax);
    offsetY = map(sin(i),-1,1,0,noiseMax);
    r = map(noise(offsetX, offsetY),0,1,rMin,rMax);
    new_x = (r*w) * cos(i);
    new_y = (r*h) * sin(i);
    
    if(random() > gap){
      strokeWeight(1.25+random(0.5));
      line(old_x,old_y,new_x,new_y);
    }

    old_x = new_x;
    old_y = new_y;
    
  }
  
  if(col[0] != -1){
    fill(color(col[0], col[1], col[2]));
    beginShape();
    
    for(let i = 0; i < TWO_PI; i += 0.1){
      offsetX = map(cos(i),-1,1,0,noiseMax);
      offsetY = map(sin(i),-1,1,0,noiseMax);
      r = map(noise(offsetX, offsetY),0,1,rMin,rMax);
      new_x = (r*w) * cos(i);
      new_y = (r*h) * sin(i);
      vertex(new_x,new_y);  
    }
    
    endShape(CLOSE);
  }

  pop();

  angleMode(DEGREES);
}

//Allow for click refreshing
function mouseClicked() {
  loop();
  noLoop();
}