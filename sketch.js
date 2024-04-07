p5.disableFriendlyErrors = true;
let cnvLine;
let cnvFill;
let cnvShadeLight;
let cnvShadeMid;
let cnvShadeDark;

function setup() {
  createCanvas(900, 900);
  angleMode(DEGREES);
  rectMode(CORNERS);
  noLoop();
}

function draw() {  
  //VARIABLES (canvases)
  cnvLine = createGraphics(width,height);
  cnvFill = createGraphics(width,height);
  cnvShadeLight = createGraphics(width,height);
  cnvShadeMid = createGraphics(width,height);
  cnvShadeDark = createGraphics(width,height);
  setupShade();
  cnvLine.stroke(0);
  cnvFill.noStroke();
  cnvFill.fill(0);
  background(255);

  //VARIABLES (constants)
  const cTYPE = Math.round(Math.random()); //0 = sharp; 1 = blur
  const cSHADE = Math.round(Math.random()-0.25); //0 = no shade; 1 = shade
  const cTHRESHOLD = 0.725+random(0.125);
  const cBLUR = Math.floor(random(3));
  const cWEIGHT = 2;
  const cSTATIC = random(0.1);

  const cGROUND1 = createVector(random(width/4),random(height/20));
  const cGROUND2 = createVector(random(width/4),random(height/20));

  const cTREENUM = Math.ceil(random(4)); 
  const cTREESTYLE = Math.ceil(random(4));

  //Variables (other)
  let heightSky = 0.45+random(0.1);
  let heightSpace = 1; //0 - top; 1 - middle; 2 - bottom
  let horizonPlace = [0,0,0,0,0,0];
  let horizonRand = [1,2,3,4,5]; //For shuffling

  if(Math.random() < 0.2){
    heightSky = (Math.round(random()) == 1) ? 0.25+random(0.1) : 0.75+random(0.1); 
    heightSpace = (heightSky < 0.36) ? 0 : 2;
  }

  let typeSky = 0; //0 - clear; 1 - waves; 2 - lines; 3 - night
  let typeSun  = (Math.round(Math.random()) == 1) ? 1 : 0; //0 - normal; 1 - rings; 2 - rays
  let sunSlot = Math.ceil(random(horizonPlace.length-1));

  if(Math.random() <= 0.1){
    typeSky = Math.ceil(random(3));
  }

  if(typeSun == 1){
    switch(typeSky){
      case 0:
        typeSun = (Math.round(Math.random()) == 1) ? 1 : 2;
      break;

      case 1: case 2: case 3:
        typeSun = 0;
      break;
    }
  }

  typeSun = 0;

  let typeBack = weightedRandom({"none":0.5, "mesa":0.3, "trees":0.1, "treesSmall":0.1});

  let heightMesa = (height*heightSky)-(height*(0.1+random(0.1)));

  ///DRAWING

  //Sky
  drawSky(typeSky,cWEIGHT);

  //Sun
  if(Math.random() <= 0.2 && typeSky != 2 && heightSpace > 0){
    let sunOff = random((width/horizonPlace.length)*0.66);
    drawSun(((width/horizonPlace.length)*sunSlot)+sunOff,(heightMesa/8)*(1+Math.ceil(random(6))),typeSun,cWEIGHT);
    horizonPlace[sunSlot] = sunOff;
  }

  //Background
  switch(typeBack){
    //Mesas
    case "mesa":
      drawMesa(heightMesa,height*heightSky,45,cSHADE,cWEIGHT);
    break;

    //Trees
    case "trees":
      horizonRand = shuffleArray(horizonRand);

      for(let i = 1; i < horizonPlace.length-1; i++){
        if(horizonPlace.filter(i => i > 0).length < cTREENUM){
          let i2 = horizonRand[i];
          let treeOff = random((width/horizonPlace.length)*0.66);
          let treeX = ((width/horizonPlace.length)*i2)+treeOff;
          let treeY = bezierPoint(height*heightSky,(height*heightSky)+cGROUND1.y,(height*heightSky)-cGROUND2.y,height*heightSky,treeX/width);

          if(Math.random() > 0.5){
            drawTree(treeX,treeY,15+random(15),66+random(45),cTREESTYLE,cSHADE,cWEIGHT);
            horizonPlace[i2] = treeOff;
          }
        }
      }
    break;

    //Small trees
    case "treesSmall":
      let newTreeNum = Math.ceil((cTREENUM*2.5)+(cTREENUM*(Math.random()*2)));

      for(let i = 0; i < newTreeNum; i++){
        let treeOff = random((width/newTreeNum)*0.66);
        let treeX = ((width/newTreeNum)*i)+treeOff;
        let treeY = bezierPoint(height*heightSky,(height*heightSky)+cGROUND1.y,(height*heightSky)-cGROUND2.y,height*heightSky,treeX/width);

        if(Math.random() > 0.5){
          let treeY2 = treeY-25-(Math.random()*35);
          let treeH = 8+(Math.random()*10);
          let treeW = 8+(Math.random()*10);

          lineWobble(treeX,treeY,treeX,treeY2,0,10,cWEIGHT);

          if(cSHADE == 1){
            ellipseShade(treeX,treeY2-10,1,1,treeH,treeW,5,1,0,2);
          }

          ellipseWobble(treeX,treeY2-10,1,1,treeH,treeW,5,0,1,1,1,cWEIGHT);
        }
      }
    break;
  }

  //Midground
  horizonPlace[sunSlot] = 0; //Reset
  let typeMid = weightedRandom({"none":0.6, "path":0.2, "lake":0.2});

  if(heightSpace == 2){//Neither ground nor lake work at this height
    typeMid = "none";
  }
  
  let pathOff = random((width/horizonPlace.length)*0.33);
  let pathOrigin = -1;

  drawGround(0,height*heightSky,cGROUND1.x,cGROUND1.y,cGROUND2.x,cGROUND2.y,width,height*heightSky,45,cWEIGHT); //res = 30

  switch(typeMid){
    case "path":
      horizonRand = shuffleArray(horizonRand);

      for(let i = 1; i < horizonPlace.length-1; i++){
        let i2 = horizonRand[i];
  
        if(horizonPlace[i2] == 0 && pathOrigin == -1){
          horizonPlace[i2] = pathOff;
          pathOrigin = (width/horizonPlace.length)*i2;
        }
      }
  
      drawPath(0,height*heightSky,cGROUND1.x,cGROUND1.y,cGROUND2.x,cGROUND2.y,width,height*heightSky,pathOrigin,pathOff,cSHADE,cWEIGHT);
    break;

    case "lake":
      let lakeY = (height*heightSky) + (height-(height*heightSky))/2 + ( ((height-(height*heightSky))/8) - ((height-(height*heightSky))/4) ); //Halway between skyline + bottom + random 1/4 of the distance
      drawLake(100+(Math.random()*(width-200)),lakeY, 10, 20, 8+random(8), 1+random(2), 1);
    break;
  }

  //Foreground
  let hasVeranda = (heightSky >= 0.36) ? 1 : 0;

  if(hasVeranda == 1){
    hasVeranda = (random(20) > 19) ? 1 : 0;
  }

  if(hasVeranda == 1){
    drawVeranda(cWEIGHT);
  }

  //--PROCESSING--
  if(Math.random() <= 0.1){//Black dots
    for(let i = 0; i < width; i += width/20){
      for(let j = 0; j < height; j += height/20){
        if(Math.random() <= 0.15){
          cnvLine.push();
          cnvLine.strokeWeight(cWEIGHT*(1-random(0.5)));
          cnvLine.point(i+(10-random(20)),j+(10-random(20)));
          cnvLine.pop();
        }
      }
    }
  }

  switch(cBLUR){
    case 0: drawingContext.filter = 'blur(1px)'; break;
    case 1: drawingContext.filter = 'blur(2px)'; break;
    case 2: drawingContext.filter = 'blur(3px)'; break;
  }

  image(cnvLine,0,0);

  drawingContext.filter = 'none';

  filter(THRESHOLD,cTHRESHOLD);

  if(cSHADE == 1){
    blendMode(DARKEST);
    image(cnvFill,0,0);
    blendMode(BLEND);
  }

  if(cTYPE == 1){
    filter(BLUR,1); //Modulate this
  }
  else{
    if(cSTATIC >= 0.025){
      stroke(255);
      strokeWeight(1);

      for(let i = 0; i < width; i++){
        for(let j = 0; j < height; j++){
          if(Math.round(Math.random() <= cSTATIC)){
            point(i,j);
          }
        }
      }
    }
  }
}

//Functions (drawing; whole)
function drawSky(type, weight){
  switch(type){
    case 1: //Waves
      let waveStroke = weight*(0.66+random(0.33));
      let waveOffset = weight*(2+Math.floor(random(4)));

      if(Math.round(Math.random()) == 1){
        waveStroke = (weight*5)+random(weight*10);
        waveOffset = waveStroke;
      }

      let waveGap = 0;

      if(waveStroke < weight && Math.round(Math.random()) == 1){
        waveGap = random(0.2);
      }

      let xOffset = 20+random(60);
      let yOffset = (width/16)+random(width/8);

      for(let i = 0; i < height+((waveStroke+waveOffset)*5); i += (waveStroke+waveOffset)){
        cnvLine.push();
        cnvLine.translate(0,i-((waveStroke+waveOffset)*5));
        bezierWobble(0,0,(width/2)-xOffset,yOffset,(width/2)+xOffset,yOffset*2,width,0,waveGap,80,waveStroke);
        cnvLine.pop();
      }
    break;

    case 2: //Lines
      let lineOffset = (weight*1.5)+random(weight*6);
      let lineGap = 0;
      let lineStroke = weight*(0.5+random(0.5));

      if(Math.round(Math.random()) == 1 && lineOffset >= weight*3){
        lineGap = random(0.25);
      }

      for(let i = 0; i < height; i+= weight+lineOffset){
        lineWobble(0,i,width,i,lineGap,60,lineStroke);
      }
    break;

    case 3: //Night
      cnvLine.push();
      cnvLine.fill(0);
      cnvLine.rect(0,0,width,height);
      
      if(Math.random() < 0.33){//Stars
        cnvLine.noStroke();
        cnvLine.fill(255);
        poissonDisc(weight*3);
      }

      cnvLine.pop();
    break;
  }
}

function drawSun(x, y, type, weight){
  let sunSize = 0.25+random(1.25);
  let ringNum = 1+Math.ceil(random(3));
  let rayNum = (Math.round(Math.random()) == 0) ? 45 : 60;
  let rayOff = random(rayNum);

  switch(type){
    case 0: //Normal
      ellipseWobble(x, y, 20*sunSize, 30*sunSize, 1, 1, 1, 0, 1, 1, 1, weight);  
    break;

    case 1: //Ripple
      for(let i = 0; i < ringNum; i++){
        let gap = (1/ringNum) * (i+1);
        ellipseWobble(x, y, (20*(i+2))*sunSize, (30*(i+2))*sunSize, 1, 1, 1, gap, 0, 1, 0, weight);  
      }

      ellipseWobble(x, y, 10*sunSize, 20*sunSize, 1, 1, 1, 0, 1, 1, 1, weight); 
    break;

    case 2: //Rays
      ellipseWobble(x, y, 20*sunSize, 30*sunSize, 1, 1, 1, 0, 1, 1, 1, weight);  

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
}

function drawMesa(y1, y2, res, shade, weight){
//---VARIABLES---
  const mesaNum = 1+Math.floor(random(3)); //Minimum 1; maximum 4 mesas
  const isMesaStart = Math.round(Math.random());
  const isMesaEnd = Math.round(Math.random());
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
    mesaX[i+1] = (i*blockW) + blockW*0.33 + Math.ceil(random(blockW*0.67));
    mesaW[i+1] = Math.ceil(mesaX[i+1]-mesaX[i]);
    isMesa[i+1] = (isMesa[i] == 1) ? 0 : 1;
  }
  
  let sliceNum = 0;
  let sliceMesa = [];
  let sliceX = [];
  let sliceY = [];
  sliceMesa[0] = isMesaStart;
  sliceX[0] = 0;
  sliceY[0] = (isMesaStart == 1) ? 0 : 0;
  
  let mesaTop = y1+Math.ceil(random((y2-y1)/3));
  let mesaBottom = y2+(100-random(120));

  const isTex = Math.round(Math.random());
  const styleTex = Math.round(Math.random());
  let shadeX = [];
  let shadeY = [];
  shadeX[0] = 0;
  shadeY[0] = 0;
  
//---SUBDIVIDE MESA---
  for(let i = 0; i < mesaBlocks+1; i++){    
    //Subdivide mesa block
    for(let j = 0; j < Math.ceil(mesaW[i+1]/res); j++){
      sliceMesa[sliceNum] = isMesa[i];
      sliceX[sliceNum] = mesaX[i]+(j*res);
      sliceY[sliceNum] = (sliceMesa[sliceNum] == 1) ? mesaTop+(5-Math.ceil(random(10))) : mesaBottom+(5-Math.ceil(random(10)));
      
      shadeX[sliceNum] = (sliceMesa[sliceNum] == 1) ? sliceX[sliceNum] : -1;
      shadeY[sliceNum] = (sliceMesa[sliceNum] == 1) ? sliceY[sliceNum] : -1;

      sliceNum += 1;
    }
    
    mesaTop = y1+Math.ceil(random((y2-y1)/3));
    mesaBottom = y2+(100-random(150));
    
    sliceMesa[sliceNum] = sliceMesa[sliceNum-1];
    sliceX[sliceNum] = mesaX[i]+(Math.floor(mesaW[i+1]/res)*res);
    sliceY[sliceNum] = (sliceMesa[sliceNum] == 0) ? (mesaTop+20)+(5-Math.ceil(random(10))) : mesaBottom+(5-Math.ceil(random(10)));
    
    sliceNum += 1;

  }
  
  sliceX[sliceNum+1] = width;
  sliceY[sliceNum+1] = (sliceMesa[sliceNum] == 1) ? mesaTop+(5-Math.ceil(random(10))) : mesaBottom+(5-Math.ceil(random(10)));
  
//---DRAWING (3D)---
  const is3D = Math.round(Math.random());

  //Draw 3D
  if(is3D == 1){
    let depth3D = 6+Math.ceil(random(16));

    //Erase 3D (line)
    cnvLine.push();
    cnvLine.erase();
    cnvLine.beginShape();
  
    for(let i = 0; i < sliceNum; i++){
      if(sliceY[i] < sliceY[i+1]-15){
        cnvLine.vertex(sliceX[i],sliceY[i]);
      }
      
      cnvLine.vertex(sliceX[i]-depth3D,sliceY[i]);
    }
  
    cnvLine.vertex(width,sliceY[sliceNum]);
    cnvLine.vertex(width,height);
    cnvLine.vertex(0,height);
    cnvLine.vertex(0,sliceY[0]);
  
    cnvLine.endShape(CLOSE);
    cnvLine.noErase();
    cnvLine.pop();

    //Erase 3D (fill)
    cnvFill.push();
    cnvFill.erase();
    cnvFill.beginShape();
  
    for(let i = 0; i < sliceNum; i++){
      if(sliceY[i] < sliceY[i+1]-15){
        cnvFill.vertex(sliceX[i],sliceY[i]);
      }
      
      cnvFill.vertex(sliceX[i]-depth3D,sliceY[i]);
    }
  
    cnvFill.vertex(width,sliceY[sliceNum]);
    cnvFill.vertex(width,height);
    cnvFill.vertex(0,height);
    cnvFill.vertex(0,sliceY[0]);
  
    cnvFill.endShape(CLOSE);
    cnvFill.noErase();
    cnvFill.pop();

    //Draw 3D (outline)
    for(let i = 0; i < sliceNum; i++){
      cnvLine.push();
      if(sliceY[i] < sliceY[i+1]-15){
        lineWobble(sliceX[i]-depth3D,sliceY[i],sliceX[i],sliceY[i],0,3,weight*0.5);
        lineWobble(sliceX[i],sliceY[i],sliceX[i+1]-depth3D,sliceY[i+1],0,3,weight*0.5);
      }
      else{
        lineWobble(sliceX[i]-depth3D,sliceY[i],sliceX[i+1]-depth3D,sliceY[i+1],0,3,weight*0.5);
      }
      cnvLine.pop();
    }

    //Draw 3D (fill)
    if(shade > 0){
      cnvFill.push();
      cnvFill.beginClip();
      cnvFill.beginShape();
    
      for(let i = 0; i < sliceNum; i++){
        if(sliceY[i] < sliceY[i+1]-15){
          cnvFill.vertex(sliceX[i],sliceY[i]);
        }
        
        cnvFill.vertex(sliceX[i]-depth3D,sliceY[i]);
      }
    
      cnvFill.vertex(width,sliceY[sliceNum]);
      cnvFill.vertex(width,height);
      cnvFill.vertex(0,height);
      cnvFill.vertex(0,sliceY[0]);
    
      cnvFill.endShape(CLOSE);
      cnvFill.endClip();

      drawShade(3);

      cnvFill.pop();
    }
  }

//---DRAWING NORMAL---
  //Erase mesa (line)
  cnvLine.push();
  cnvLine.erase();
  cnvLine.beginShape();

  for(let i = 0; i < sliceNum; i++){
    cnvLine.vertex(sliceX[i],sliceY[i]);
  }

  cnvLine.vertex(width,sliceY[sliceNum]);
  cnvLine.vertex(width,height);
  cnvLine.vertex(0,height);
  cnvLine.vertex(0,sliceY[0]);

  cnvLine.endShape(CLOSE);
  cnvLine.noErase();

  cnvLine.pop();

  //Erase mesa (fill)
  cnvFill.push();
  cnvFill.erase();
  cnvFill.beginShape();

  for(let i = 0; i < sliceNum; i++){
    cnvFill.vertex(sliceX[i],sliceY[i]);
  }

  cnvFill.vertex(width,sliceY[sliceNum]);
  cnvFill.vertex(width,height);
  cnvFill.vertex(0,height);
  cnvFill.vertex(0,sliceY[0]);

  cnvFill.endShape(CLOSE);
  cnvFill.noErase();

  cnvFill.pop();

  //Draw dots
  if(isTex == 1 && styleTex == 1){
    cnvLine.push();
    cnvLine.beginClip();
    cnvLine.beginShape();

    for(let i = 0; i < sliceNum; i++){
      cnvLine.vertex(sliceX[i],sliceY[i]);
    }
  
    cnvLine.vertex(width,sliceY[sliceNum]);
    cnvLine.vertex(width,height);
    cnvLine.vertex(0,height);
    cnvLine.vertex(0,sliceY[0]);
  
    cnvLine.endShape(CLOSE);
    cnvLine.endClip();

    cnvLine.noStroke();
    cnvLine.fill(0);
    poissonDisc(weight*3);
    cnvLine.pop();
  }
  
  //Draw outline
  for(let i = 0; i < sliceNum; i++){
    cnvLine.push();

    //Draw outlines
    lineWobble(sliceX[i],sliceY[i],sliceX[i+1],sliceY[i+1],0,3,weight*0.66);

    //Draw stripe-shading
    if(isTex == 1 && shadeX[i] != -1 && shadeY[i] != -1){
      if(styleTex == 0){
        let shadeNum = 1+Math.ceil(random(2));

        for(let j = 0; j < shadeNum; j++){
          let xx = lerp(sliceX[i],sliceX[i+1],(1/shadeNum)*j);
          let yy = lerp(sliceY[i],sliceY[i+1],(1/shadeNum)*j);
          
          lineWobble(xx+(2-random(4)),yy+(2+random(5)),xx+(2-random(4)),y2-(2-random(5)),0,2,weight*0.66);
        }
      }
    } 

    cnvLine.pop();
  }

  //Draw fill
  if(shade == 1 && isTex == 0){
    cnvFill.push();
    cnvFill.beginClip();
    cnvFill.beginShape();

    for(let i = 0; i < sliceNum; i++){
      cnvFill.vertex(sliceX[i],sliceY[i]);
    }
  
    cnvFill.vertex(width,sliceY[sliceNum]);
    cnvFill.vertex(width,height);
    cnvFill.vertex(0,height);
    cnvFill.vertex(0,sliceY[0]);
    cnvFill.endShape(CLOSE);
    cnvFill.endClip();

    drawShade(2);

    cnvFill.pop();
  }
}

function drawTree(x, y, w, h, style, shade, weight){
  const ridgeNum = 4+Math.ceil(random(8));
  const shrubNum = Math.ceil(random(4));
  
  //Trunk erase
  cnvLine.erase();
  cnvLine.beginShape();

  cnvLine.vertex(x-(w/2),y);
  cnvLine.vertex(x-(w/3),y-h);
  cnvLine.vertex(x+(w/3),y-h);
  cnvLine.vertex(x+(w/2),y);

  cnvLine.endShape(CLOSE);
  cnvLine.noErase();

  //Trunk shade
  if(shade == 1){
    cnvFill.push();
    cnvFill.beginClip();
    cnvFill.beginShape();
  
    cnvFill.vertex(x-(w/2),y);
    cnvFill.vertex(x-(w/3),y-h);
    cnvFill.vertex(x+(w/3),y-h);
    cnvFill.vertex(x+(w/2),y);
  
    cnvFill.endShape(CLOSE);
    cnvFill.endClip();

    drawShade(2);

    cnvFill.pop();
  }
  
  //Trunk outline
  lineWobble(x-(w/2),y,x-(w/3),y-h,0,3,weight);
  
  for(let i = 0; i < ridgeNum; i++){
    let ridgeHeight = y-(i*(h/ridgeNum));
    let ridgeX = lerp(x-(w/2),x-(w/3),i/ridgeNum);
    
    lineWobble(ridgeX,ridgeHeight,ridgeX+random(w/2),ridgeHeight,0,2,weight*0.55);
  }
  
  lineWobble(x+(w/2),y,x+(w/3),y-h,0,3,weight*0.55);

  //Topiary
  let new_y = y;
  let wScale = (Math.round(Math.random()) == 1) ? 0 : 0.1+random(0.3);
  let hScale = (wScale == 1) ? 0 : 0.1+random(0.3);

  switch(style){
    case 1: //Shrubs
      new_y = y;
  
      for(let i = 0; i < shrubNum; i++){
        let r = 20-((20/shrubNum)*i);
        let x_pos = x+(2.5-random(5));

        if(shade == 1){
          ellipseShade(x_pos,new_y-h, r, r*2, 1, 1.2, 1.125,1,0,1);
        }

        ellipseWobble(x_pos, new_y-h, r, r*2, 1, 1.2, 1.125,0,1,1,1,weight);    
        new_y -= (r*1.2)*1.5;
      }
    break;

    case 2: //Fuzzy
      wScale = (Math.round(Math.random()) == 1) ? 0 : 0.1+random(0.3);
      hScale = (wScale == 1) ? 0 : 0.1+random(0.3);

      let x_pos = x+(1.25-random(2.5));

      if(shade == 1){
        ellipseShade(x_pos,y-h,25,45,1+wScale,1+hScale,5,1,0,1);
      }

      ellipseWobble(x_pos,y-h,25,45,1+wScale,1+hScale,5,0,1,1,1,weight);
    break;

    case 3: //Crown
      wScale = 2+random(3);
      new_y = y-(30+random(20)); //y-(20+random(15));

      if(shade == 1){
        cnvFill.push();
        cnvFill.beginClip();
        cnvFill.beginShape();
        cnvFill.vertex(x-((w/2)*wScale),y-h+3);
        cnvFill.vertex(x-((w/2)*wScale),new_y-h);
        cnvFill.vertex(x,new_y-(h*0.66));
        cnvFill.vertex(x+((w/2)*wScale),new_y-h);
        cnvFill.vertex(x+((w/2)*wScale),y-h+3);
        cnvFill.endShape(CLOSE);
        cnvFill.endClip();

        drawShade(1);

        cnvFill.pop();
      }

      cnvLine.erase();
      cnvLine.beginShape();
      cnvLine.vertex(x-((w/2)*wScale),y-h+3);
      cnvLine.vertex(x-((w/2)*wScale),new_y-h);
      cnvLine.vertex(x,new_y-(h*0.66));
      cnvLine.vertex(x+((w/2)*wScale),new_y-h);
      cnvLine.vertex(x+((w/2)*wScale),y-h+3);
      cnvLine.endShape(CLOSE);
      cnvLine.noErase();

      lineWobble(x-((w/2)*wScale),y-h+3,x-((w/2)*wScale),new_y-h,0,5,weight);
      lineWobble(x-((w/2)*wScale),y-h+3,x+((w/2)*wScale),y-h+3,0,5,weight);
      lineWobble(x+((w/2)*wScale),y-h+3,x+((w/2)*wScale),new_y-h,0,5,weight*0.55);
      lineWobble(x-((w/2)*wScale),new_y-h,x,new_y-(h*0.66),0,5,weight);
      lineWobble(x+((w/2)*wScale),new_y-h,x,new_y-(h*0.66),0,5,weight*0.55);
    break;

    case 4: //Navajo
      wScale = 0.1+random(0.3);
      hScale = 0.1+random(0.3);
      let xx = 1.25-random(2.5);
      let yy = -10-random(10);
      let xadd = 10+random(7);
      let yadd = 15+random(10);//10+random(15);

      let offsetX = map(cos(0),-1,1,0,1);
      let offsetY = map(sin(0),-1,1,0,1);
      let r = map(noise(offsetX, offsetY),0,1,25,45);
      let circ_x = (r*(0.66+wScale)) * cos(0);
      let circ_y = (r*(1+hScale)) * sin(0);

      let cb_shade = Math.random();

      //Inside
      if(shade == 1){
        ellipseShade(x+xx,y-h,25,45,0.66+wScale,1+hScale,1,1,0,1);
      }

      ellipseWobble(x+xx,y-h,25,45,0.66+wScale,1+hScale,1,0,2,1,0,weight);

      angleMode(RADIANS);

      cnvLine.push();
      cnvLine.translate(x+xx,y-h);
      cnvLine.beginClip();
      cnvLine.beginShape();

      for(let i = 0; i < TWO_PI+0.1; i += 0.1){
        offsetX = map(cos(i),-1,1,0,1);
        offsetY = map(sin(i),-1,1,0,1);
        r = map(noise(offsetX, offsetY),0,1,25,45);
        circ_x = (r*(0.66+wScale)) * cos(i);
        circ_y = (r*(1+hScale)) * sin(i);
        cnvLine.vertex(circ_x,circ_y);  
      }

      cnvLine.endShape();
      cnvLine.endClip();
      cnvLine.translate(-(x+xx),-(y-h));

      angleMode(DEGREES);

      for(i = 0; i < 2; i++){
        lineWobble(x+xx,y-h-(yy*i),x+xx+xadd,y-h-yadd-(yy*i),0,2,weight*0.55);
        lineWobble(x+xx+xadd,y-h-yadd-(yy*i),x+xx+(xadd*2),y-h-(yy*i),0,2,weight*0.55);
        lineWobble(x+xx+(xadd*2),y-h-(yy*i),x+xx+(xadd*3),y-h-yadd-(yy*i),0,2,weight*0.55);
        lineWobble(x+xx+(xadd*3),y-h-yadd-(yy*i),x+xx+(xadd*4),y-h-(yy*i),0,2,weight*0.55);
        lineWobble(x+xx+(xadd*4),y-h-(yy*i),x+xx+(xadd*5),y-h-yadd-(yy*i),0,2,weight*0.55);
        lineWobble(x+xx,y-h-(yy*i),x+xx-xadd,y-h-yadd-(yy*i),0,2,weight*0.55);
        lineWobble(x+xx-xadd,y-h-yadd-(yy*i),x+xx-(xadd*2),y-h-(yy*i),0,2,weight*0.55);
        lineWobble(x+xx-(xadd*2),y-h-(yy*i),x+xx-(xadd*3),y-h-yadd-(yy*i),0,2,weight*0.55);
        lineWobble(x+xx-(xadd*3),y-h-yadd-(yy*i),x+xx-(xadd*4),y-h-(yy*i),0,2,weight*0.55);
        lineWobble(x+xx-(xadd*4),y-h-(yy*i),x+xx-(xadd*5),y-h-yadd-(yy*i),0,2,weight*0.55);
      }

      cnvLine.pop();

      //Outline
      ellipseWobble(x+xx,y-h,25,45,0.66+wScale,1+hScale,1,0,0,1,0,weight);

      //Shade strip
      if(shade == 1 || cb_shade >= 0.75){ //So either global shading, or 1/4 chance
        angleMode(RADIANS);

        cnvFill.push();
        cnvFill.translate(x+xx,y-h);
        cnvFill.beginClip();
        cnvFill.beginShape();
  
        for(let i = 0; i < TWO_PI+0.1; i += 0.1){
          offsetX = map(cos(i),-1,1,0,1);
          offsetY = map(sin(i),-1,1,0,1);
          r = map(noise(offsetX, offsetY),0,1,25,45);
          circ_x = (r*(0.66+wScale)) * cos(i);
          circ_y = (r*(1+hScale)) * sin(i);
          cnvFill.vertex(circ_x,circ_y);  
        }
  
        cnvFill.endShape();
        cnvFill.endClip();

        cnvFill.translate(-(x+xx),-(y-h));
  
        angleMode(DEGREES);
        
        cnvFill.beginShape();
        
        cnvFill.vertex(x+xx-(xadd*5),y-h-yadd);
        cnvFill.vertex(x+xx-(xadd*4),y-h);
        cnvFill.vertex(x+xx-(xadd*3),y-h-yadd);
        cnvFill.vertex(x+xx-(xadd*2),y-h);
        cnvFill.vertex(x+xx-xadd,y-h-yadd);
        cnvFill.vertex(x+xx,y-h);
        cnvFill.vertex(x+xx+xadd,y-h-yadd);
        cnvFill.vertex(x+xx+(xadd*2),y-h);
        cnvFill.vertex(x+xx+(xadd*3),y-h-yadd);
        cnvFill.vertex(x+xx+(xadd*4),y-h);
        cnvFill.vertex(x+xx+(xadd*5),y-h-yadd);

        cnvFill.vertex(x+xx+(xadd*5),y-h-yadd-(yy));
        cnvFill.vertex(x+xx+(xadd*4),y-h-(yy));
        cnvFill.vertex(x+xx+(xadd*3),y-h-yadd-(yy));
        cnvFill.vertex(x+xx+(xadd*2),y-h-(yy));
        cnvFill.vertex(x+xx+xadd,y-h-yadd-(yy));
        cnvFill.vertex(x+xx,y-h-(yy));
        cnvFill.vertex(x+xx-xadd,y-h-yadd-(yy));
        cnvFill.vertex(x+xx-(xadd*2),y-h-(yy));
        cnvFill.vertex(x+xx-(xadd*3),y-h-yadd-(yy));  
        cnvFill.vertex(x+xx-(xadd*4),y-h-(yy));
        cnvFill.vertex(x+xx-(xadd*5),y-h-yadd-(yy));  
        cnvFill.vertex(x+xx-(xadd*5),y-h-yadd);

        cnvFill.endShape(CLOSE);
  
        cnvFill.pop();
      }

      noiseSeed(random(9999999));
    break;
  }
}

function drawGround(x1, y1, cx1, cy1, cx2, cy2, x2, y2, res, weight){ 
  //Variables
  const cSTYLE = Math.floor(random(3)); //0 = nothing; 1 = dashes; 2 = repeating lines
  const cHAS_GAPS = Math.round(Math.random());
  const cHAS_GRASS = Math.round(Math.random());
  const cGRASS_NUM = 1+Math.ceil(random(4));
  const cDASH_DIR = 225;

  let groundFill = Math.round(Math.random());
  groundFill = (groundFill == 1) ? 0 : 1+Math.round(Math.random());
  
  let t = 0;
  let new_x = bezierPoint(x1,x1+cx1,x2-cx2,x2,t)+(1-random(2));
  let old_x = new_x;
  let new_y = bezierPoint(y1,y1+cy1,y2-cy2,y2,t)+(1-random(2));
  let old_y = new_y;

  let gap = [];
  
  for(let i = 0; i < res+1; i++){
    gap[i] = 0;
  }

  //Erase (lines & fill)
  cnvLine.erase();
  cnvLine.beginShape();

  for(let i = 0; i < res+1; i++){
    cnvLine.vertex(bezierPoint(x1,x1+cx1,x2-cx2,x2,i/res),bezierPoint(y1,y1+cy1,y2-cy2,y2,i/res));
  }

  cnvLine.vertex(width,height);
  cnvLine.vertex(0,height);
  cnvLine.vertex(0,bezierPoint(y1,y1+cy1,y2-cy2,y2,0));

  cnvLine.endShape();
  cnvLine.noErase();

  cnvFill.erase();
  cnvFill.beginShape();

  for(let i = 0; i < res+1; i++){
    cnvFill.vertex(bezierPoint(x1,x1+cx1,x2-cx2,x2,i/res),bezierPoint(y1,y1+cy1,y2-cy2,y2,i/res));
  }

  cnvFill.vertex(width,height);
  cnvFill.vertex(0,height);
  cnvFill.vertex(0,bezierPoint(y1,y1+cy1,y2-cy2,y2,0));

  cnvFill.endShape();
  cnvFill.noErase();

  //Draw outline
  for(let i = 0; i < res+1; i++){
    t = i/res;
    new_x = bezierPoint(x1,x1+cx1,x2-cx2,x2,t)+(1-random(2));
    new_y = bezierPoint(y1,y1+cy1,y2-cy2,y2,t)+(1-random(2));
    
    cnvLine.strokeWeight(weight+random(weight/3));

    if(gap[i] == 0){
      cnvLine.line(old_x,old_y,new_x,new_y);

      if(cSTYLE == 1){
        drawDashes(old_x,old_y,new_x,new_y,cDASH_DIR,weight);
      }

      if(cHAS_GAPS == 1 && (random(res) > (res-1) - (res/cGRASS_NUM*cHAS_GRASS))){
        let gapDistance = ceil(random(2));

        for(let j = 0; j < gapDistance; j++){
          gap[i+(j+1)] = 1;
        }
      }
    }
    else{
      if(cHAS_GRASS == 1){
        for(let i = 0; i < 3; i++){
          let grassX = lerp(old_x,new_x,0.25+(0.25*i));
          let grassY = lerp(old_y,new_y,0.25+(0.25*i));

          cnvLine.strokeWeight((weight*0.66)+random(weight/3));
          cnvLine.line(grassX,grassY,grassX+(2.5-random(5)),grassY-(2.5+random(12.5)));
        }
      }
    }

    old_x = new_x;
    old_y = new_y;
  }

  //Draw reapeated outline
  if(cSTYLE == 2){
    let lineRepeat = Math.ceil(random(4))+2;
    let repeatStyle = Math.round(Math.random()); //0 = even spaced; 1 = incrementally spaced
    let repeatStart = 1;

    if(repeatStyle == 1){
      repeatStart = 2;
    }

    for(let j = repeatStart; j < lineRepeat; j++){
      let yy = j*10;

      if(repeatStyle == 1){
        yy = (j*1.5)*(j*1.5);
      }

      t = 0;
      let new_x = bezierPoint(x1,x1+cx1,x2-cx2,x2,t)+(0.5-random(1));
      let old_x = new_x;
      let new_y = bezierPoint(y1,y1+cy1,y2-cy2,y2,t)+(0.5-random(1))+yy;//(j*10);
      let old_y = new_y;

      for(let k = 0; k < res+1; k++){
        t = k/res
        new_x = bezierPoint(x1,x1+cx1,x2-cx2,x2,t)+(0.5-random(1));
        new_y = bezierPoint(y1,y1+cy1,y2-cy2,y2,t)+(0.5-random(1))+yy;//(j*10);

        if(gap[k] == 0){
          cnvLine.strokeWeight((weight+random(weight/3)/5)-(j/lineRepeat));
          cnvLine.line(old_x,old_y,new_x,new_y);

          if(cHAS_GAPS == 1 && Math.random() > 1-(0.15*j)){
            let gapDistance = Math.ceil(random(j+1)/(0.5+random(1.5)));

            for(let l = 0; l < gapDistance; l++){
              gap[k+(l+1)] = 1;
            }
          }
        }

        old_x = new_x;
        old_y = new_y;      
      }

      for(let l = 0; l < res+1; l++){
        if(l == 0){
          if(cHAS_GAPS == 1 && Math.random() > 1-(0.15*j)){
            let gapDistance = Math.ceil(random(j+1)/(0.5+random(1.5)));

            for(let m = 0; m < gapDistance; m++){
              gap[l+(m+1)] = 1;
            }
            
            l = gapDistance+1;
          }
          else{
            gap[l] = 0;  
          }
        }
        else{
          gap[l] = 0;
        }
      }
    }
  }

  //Draw fill
  if(groundFill > 0){
    cnvFill.push();
    cnvFill.beginClip();
    cnvFill.beginShape();

    for(let i = 0; i < res+1; i++){
      cnvFill.vertex(bezierPoint(x1,x1+cx1,x2-cx2,x2,i/res),bezierPoint(y1,y1+cy1,y2-cy2,y2,i/res));
    }

    cnvFill.vertex(width,height);
    cnvFill.vertex(0,height);
    cnvFill.vertex(0,bezierPoint(y1,y1+cy1,y2-cy2,y2,0));
    cnvFill.endShape();
    cnvFill.endClip();
    drawShade(groundFill-1);
    cnvFill.pop();
  }
}

function drawPath(x1, y1, cx1, cy1, cx2, cy2, x2, y2, pathOrigin, pathOff, shade, weight){
  let pathStart = (pathOrigin+pathOff)/width;
  let pathEnd = 0.02+random(0.02);
  let pathStart1 = [bezierPoint(x1,x1+cx1,x2-cx2,x2,pathStart),bezierPoint(y1,y1+cy1,y2-cy2,y2,pathStart)];
  let pathStart2 = [bezierPoint(x1,x1+cx1,x2-cx2,x2,pathStart+pathEnd),bezierPoint(y1,y1+cy1,y2-cy2,y2,pathStart+pathEnd)];
  let pathEnd1 = [0,height-150];
  let pathEnd2 = [150,height];
  let ridgeDist = 10;

  if(pathStart < 0.5){
    pathEnd1 = [width-150,height];
    pathEnd2 = [width,height-150];
  }

  //Clip path (outline)
  cnvLine.erase();
  cnvLine.beginShape();

  cnvLine.vertex(pathStart1[0],pathStart1[1]+5);
  cnvLine.vertex(pathStart2[0],pathStart2[1]+5);
  cnvLine.quadraticVertex(lerp(pathStart2[0],pathEnd2[0],0.15),lerp(pathStart2[1],pathEnd2[1],0.75),pathEnd2[0],pathEnd2[1]);
  if(pathStart < 0.5){
    cnvLine.vertex(width,height);
  }
  else{
    cnvLine.vertex(0,height);
  }
  cnvLine.vertex(pathEnd1[0],pathEnd1[1]);
  cnvLine.quadraticVertex(lerp(pathStart1[0],pathEnd1[0],0.15),lerp(pathStart1[1],pathEnd1[1],0.75),pathStart1[0],pathStart1[1]);

  cnvLine.endShape(CLOSE);
  cnvLine.noErase();

  //Clip path (fill)
  cnvFill.fill(255);
  cnvFill.beginShape();

  cnvFill.vertex(pathStart1[0],pathStart1[1]+5);
  cnvFill.vertex(pathStart2[0],pathStart2[1]+5);
  cnvFill.quadraticVertex(lerp(pathStart2[0],pathEnd2[0],0.15),lerp(pathStart2[1],pathEnd2[1],0.75),pathEnd2[0],pathEnd2[1]);
  if(pathStart < 0.5){
    cnvFill.vertex(width,height);
  }
  else{
    cnvFill.vertex(0,height);
  }
  cnvFill.vertex(pathEnd1[0],pathEnd1[1]);
  cnvFill.quadraticVertex(lerp(pathStart1[0],pathEnd1[0],0.15),lerp(pathStart1[1],pathEnd1[1],0.75),pathStart1[0],pathStart1[1]);

  cnvFill.endShape(CLOSE);
  cnvFill.fill(0);

  //Draw path (outline)
  bezierQuadraticWobble(pathStart1[0],pathStart1[1],lerp(pathStart1[0],pathEnd1[0],0.15),lerp(pathStart1[1],pathEnd1[1],0.75),pathEnd1[0],pathEnd1[1],0,60,weight*0.66);

  if(pathStart < 0.5){//Ridge
    bezierQuadraticWobble(pathStart2[0]+(ridgeDist*0.33),pathStart2[1],lerp(pathStart2[0]+(ridgeDist*0.33),pathEnd2[0],0.15),lerp(pathStart2[1],pathEnd2[1]+ridgeDist,0.75),pathEnd2[0],pathEnd2[1]+ridgeDist,0,60,weight*0.66);
  }
  else{
    bezierQuadraticWobble(pathStart1[0]+(ridgeDist*0.33),pathStart1[1],lerp(pathStart1[0]+(ridgeDist*0.33),pathEnd1[0],0.15),lerp(pathStart1[1],pathEnd1[1]+ridgeDist,0.75),pathEnd1[0],pathEnd1[1]+ridgeDist,0,60,weight*0.66);
  }

  bezierQuadraticWobble(pathStart2[0],pathStart2[1],lerp(pathStart2[0],pathEnd2[0],0.15),lerp(pathStart2[1],pathEnd2[1],0.75),pathEnd2[0],pathEnd2[1],0,60,weight*0.66);

  //Draw path (fill)
  if(shade == 1){
    //Ridge
    cnvFill.push();
    cnvFill.beginClip();
    cnvFill.beginShape();

    if(pathStart < 0.5){
      cnvFill.vertex(pathStart2[0]+(ridgeDist*0.33),pathStart2[1]);
      cnvFill.quadraticVertex(lerp(pathStart2[0]+(ridgeDist*0.33),pathEnd2[0],0.15),lerp(pathStart2[1],pathEnd2[1]+ridgeDist,0.75),pathEnd2[0],pathEnd2[1]+ridgeDist);
      cnvFill.vertex(pathEnd2[0],pathEnd2[1]);
      cnvFill.quadraticVertex(lerp(pathStart2[0],pathEnd2[0],0.15),lerp(pathStart2[1],pathEnd2[1],0.75),pathStart2[0],pathStart2[1]);
    }
    else{
      cnvFill.vertex(pathStart1[0]+(ridgeDist*0.33),pathStart1[1]);
      cnvFill.quadraticVertex(lerp(pathStart1[0]+(ridgeDist*0.33),pathEnd1[0],0.15),lerp(pathStart1[1],pathEnd1[1]+ridgeDist,0.75),pathEnd1[0],pathEnd1[1]+ridgeDist);
      cnvFill.vertex(pathEnd1[0],pathEnd1[1]);
      cnvFill.quadraticVertex(lerp(pathStart1[0],pathEnd1[0],0.15),lerp(pathStart1[1],pathEnd1[1],0.75),pathStart1[0],pathStart1[1]);
    }

    cnvFill.endShape();
    cnvFill.endClip();

    drawShade(3);

    cnvFill.pop();

    //Path
    cnvFill.push();
    cnvFill.beginClip();
    cnvFill.beginShape();

    if(pathStart < 0.5){
      cnvFill.vertex(pathStart2[0]+(ridgeDist*0.33),pathStart2[1]);
      cnvFill.quadraticVertex(lerp(pathStart2[0]+(ridgeDist*0.33),pathEnd2[0],0.15),lerp(pathStart2[1],pathEnd2[1]+ridgeDist,0.75),pathEnd2[0],pathEnd2[1]+ridgeDist);
      cnvFill.vertex(width,height);
      cnvFill.vertex(pathEnd1[0],pathEnd1[1]);
      cnvFill.quadraticVertex(lerp(pathStart1[0],pathEnd1[0],0.15),lerp(pathStart1[1],pathEnd1[1],0.75),pathStart1[0],pathStart1[1]);
    }
    else{
      cnvFill.vertex(pathStart1[0]+(ridgeDist*0.33),pathStart1[1]);
      cnvFill.quadraticVertex(lerp(pathStart1[0]+(ridgeDist*0.33),pathEnd1[0],0.15),lerp(pathStart1[1],pathEnd1[1]+ridgeDist,0.75),pathEnd1[0],pathEnd1[1]+ridgeDist);
      cnvFill.vertex(0,height);
      cnvFill.vertex(pathEnd2[0],pathEnd2[1]);
      cnvFill.quadraticVertex(lerp(pathStart2[0],pathEnd2[0],0.15),lerp(pathStart2[1],pathEnd2[1],0.75),pathStart2[0],pathStart2[1]);
    }

    cnvFill.endShape();
    cnvFill.endClip();

    drawShade(2);

    cnvFill.pop();
  }
}

function drawLake(x, y, rMin, rMax, w, h, noiseMax){
  const lakeDepth = (random(20) < 19) ? 10+random(15) : 200;
  const ridgeNum = Math.ceil(random(2));
  let ridgeCon = 0;
  
  let offsetX = map(cos(0),-1,1,0,noiseMax);
  let offsetY = map(sin(0),-1,1,0,noiseMax);
  let r = map(noise(offsetX, offsetY),0,1,rMin,rMax);
  let new_x = (r*w) * cos(0);
  let new_y = (r*h) * sin(0);
  let old_x = new_x;
  let old_y = new_y;

  angleMode(RADIANS);

  ///Fill
  cnvFill.push();
  cnvFill.translate(x,y);

  //Erase fill
  cnvFill.erase();
  cnvFill.beginShape();

  for(let i = 0; i < TWO_PI+0.1; i += 0.1){
    offsetX = map(cos(i),-1,1,0,noiseMax);
    offsetY = map(sin(i),-1,1,0,noiseMax);
    r = map(noise(offsetX, offsetY),0,1,rMin,rMax);
    new_x = (r*w) * cos(i);
    new_y = (r*h) * sin(i);
    cnvFill.vertex(new_x,new_y);  
  }

  cnvFill.endShape(CLOSE);
  cnvFill.noErase();
  
  //Outer ring (fill)
  /*cnvFill.beginShape();

  for(let i = 0; i < TWO_PI+0.1; i += 0.1){
    offsetX = map(cos(i),-1,1,0,noiseMax);
    offsetY = map(sin(i),-1,1,0,noiseMax);
    r = map(noise(offsetX, offsetY),0,1,rMin,rMax);
    new_x = (r*w) * cos(i);
    new_y = (r*h) * sin(i);
    cnvFill.vertex(new_x,new_y);  
  }

  cnvFill.endShape(CLOSE);
  
  //Clipping mask
  cnvFill.beginClip();
  cnvFill.beginShape();

  for(let i = 0; i < TWO_PI+0.1; i += 0.1){
    offsetX = map(cos(i),-1,1,0,noiseMax);
    offsetY = map(sin(i),-1,1,0,noiseMax);
    r = map(noise(offsetX, offsetY),0,1,rMin,rMax);
    new_x = (r*w) * cos(i);
    new_y = (r*h) * sin(i);
    cnvFill.vertex(new_x,new_y);  
  }

  cnvFill.endShape(CLOSE);
  cnvFill.endClip();
  
  //Lower ring (fill)
  cnvFill.fill(255);
  cnvFill.beginShape();

  for(let i = 0; i < TWO_PI+0.1; i += 0.1){
    offsetX = map(cos(i),-1,1,0,noiseMax);
    offsetY = map(sin(i),-1,1,0,noiseMax);
    r = map(noise(offsetX, offsetY),0,1,rMin,rMax);
    new_x = (r*w) * cos(i);
    new_y = (r*h) * sin(i);
    cnvFill.vertex(new_x,new_y+lakeDepth);  
  }

  cnvFill.endShape(CLOSE);*/
  cnvFill.pop();
  
  ///Outlines
  cnvLine.push();
  cnvLine.translate(x,y);
  
  //Outer ring (outline)
  for(let i = 0; i < TWO_PI+0.1; i += 0.1){
    offsetX = map(cos(i),-1,1,0,noiseMax);
    offsetY = map(sin(i),-1,1,0,noiseMax);
    r = map(noise(offsetX, offsetY),0,1,rMin,rMax);
    new_x = (r*w) * cos(i);
    new_y = (r*h) * sin(i);

    cnvLine.strokeWeight(1.25+random(0.5));
    cnvLine.line(old_x,old_y,new_x,new_y);
    
    old_x = new_x;
    old_y = new_y;
  }
  
  //Clipping mask
  cnvLine.beginClip();
  cnvLine.beginShape();

  for(let i = 0; i < TWO_PI+0.1; i += 0.1){
    offsetX = map(cos(i),-1,1,0,noiseMax);
    offsetY = map(sin(i),-1,1,0,noiseMax);
    r = map(noise(offsetX, offsetY),0,1,rMin,rMax);
    new_x = (r*w) * cos(i);
    new_y = (r*h) * sin(i);
    cnvLine.vertex(new_x,new_y);  
  }

  cnvLine.endShape(CLOSE);
  cnvLine.endClip();
  
  //Lower ring (outline)
  for(let i = 0; i < TWO_PI+0.1; i += 0.1){
    offsetX = map(cos(i),-1,1,0,noiseMax);
    offsetY = map(sin(i),-1,1,0,noiseMax);
    r = map(noise(offsetX, offsetY),0,1,rMin,rMax);
    new_x = (r*w) * cos(i);
    new_y = (r*h) * sin(i);

    //Ring
    cnvLine.strokeWeight(1.25+random(0.5));
    cnvLine.line(old_x,old_y+lakeDepth,new_x,new_y+lakeDepth);
    
    //Ridges
    cnvLine.strokeWeight(0.75+random(0.25));
    let wob_new_x = old_x;
    let wob_old_x = wob_new_x;
    let wob_new_y = old_y;
    let wob_old_y = wob_new_y;
    let wob_res = lakeDepth/5;

    if(ridgeCon % ridgeNum == 0){
      for (let j = 0; j < wob_res; j++) {
        wob_new_x = lerp(old_x, old_x, (j+1)/wob_res)+(1-random(2));
        wob_new_y = lerp(old_y, old_y+(lakeDepth-4), (j+1)/wob_res)+(1-random(2));

        if(Math.random() > 0.1){
          cnvLine.line(wob_old_x,wob_old_y,wob_new_x,wob_new_y);
        }

        wob_old_x = wob_new_x;
        wob_old_y = wob_new_y;
      }
    }
    
    old_x = new_x;
    old_y = new_y;
    ridgeCon += 1;
  }
  
  cnvLine.pop();

  angleMode(DEGREES);
  
  //Reset random seed
  noiseSeed(random(9999999));
}

function drawVeranda(weight){
  const margin = (width/10)+15-random(30);
  const styleMargin = Math.round(Math.random());
  const baubleNum = 1+Math.floor(random(4));
  const baubleSize = 0.5+random(1.5);

  //Cut out (line)
  cnvLine.push();
  cnvLine.erase();
  cnvLine.beginShape();
  cnvLine.vertex(0,0);
  cnvLine.vertex(0,height);
  cnvLine.vertex(margin,height);
  cnvLine.vertex(margin,margin*2);

  if(styleMargin == 0){
    cnvLine.quadraticVertex(margin,margin,margin*2,margin); 
  }
  else{
    cnvLine.quadraticVertex(margin*2,margin*2,margin*2,margin);  
  }

  cnvLine.vertex(width-(margin*2),margin);

  if(styleMargin == 0){
    cnvLine.quadraticVertex(width-margin,margin,width-margin,margin*2); 
  }
  else{
    cnvLine.quadraticVertex(width-(margin*2),margin*2,width-margin,margin*2);  
  }

  cnvLine.vertex(width-margin,height);
  cnvLine.vertex(width,height);
  cnvLine.vertex(width,0);

  cnvLine.endShape(CLOSE);
  cnvLine.noErase();
  cnvLine.pop();

  //Cut out (fill)
  cnvFill.push();
  cnvFill.erase();
  cnvFill.beginShape();
  cnvFill.vertex(0,0);
  cnvFill.vertex(0,height);
  cnvFill.vertex(margin,height);
  cnvFill.vertex(margin,margin*2);

  if(styleMargin == 0){
    cnvFill.quadraticVertex(margin,margin,margin*2,margin); 
  }
  else{
    cnvFill.quadraticVertex(margin*2,margin*2,margin*2,margin);  
  }

  cnvFill.vertex(width-(margin*2),margin);

  if(styleMargin == 0){
    cnvFill.quadraticVertex(width-margin,margin,width-margin,margin*2); 
  }
  else{
    cnvFill.quadraticVertex(width-(margin*2),margin*2,width-margin,margin*2);  
  }

  cnvFill.vertex(width-margin,height);
  cnvFill.vertex(width,height);
  cnvFill.vertex(width,0);

  cnvFill.endShape(CLOSE);
  cnvFill.noErase();
  cnvFill.pop();

  //Draw outline
  lineWobble(margin,margin*2,margin,height,0,20,weight);
  if(styleMargin == 0){
    bezierQuadraticWobble(margin,margin*2,margin,margin,margin*2,margin,0,20,weight);
  }
  else{
    bezierQuadraticWobble(margin,margin*2,margin*2,margin*2,margin*2,margin,0,20,weight);    
  }
  lineWobble(margin*2,margin,width-(margin*2),margin,0,20,weight);

  if(styleMargin == 0){
    bezierQuadraticWobble(width-margin,margin*2,width-margin,margin,width-(margin*2),margin,0,20,weight);
  }
  else{
    bezierQuadraticWobble(width-margin,margin*2,width-(margin*2),margin*2,width-(margin*2),margin,0,20,weight);
  }
  lineWobble(width-margin,margin*2,width-margin,height,0,20,weight);

  //Draw baubles
  if(Math.random() > 0.3){
    /*push();
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
    pop();*/

    for(let i = 0; i < baubleNum+1; i++){
      let x = (width/(baubleNum+2))*(i+1);
      let y = margin/2;
      lineWobble(x-(10*baubleSize),y,x,y-(10*baubleSize),0,2,weight*0.5);
      lineWobble(x,y-(10*baubleSize),x+(10*baubleSize),y,0,2,weight*0.5);
      lineWobble(x+(10*baubleSize),y,x,y+(10*baubleSize),0,2,weight*0.5);
      lineWobble(x,y+(10*baubleSize),x-(10*baubleSize),y,0,2,weight*0.5);
    }
  }
}

function drawDashes(x1, y1, x2, y2, dir, weight){
  let lengthDashes = Math.ceil(random(15))+5;

  let strokeX = (lengthDashes+(2-random(4)))*cos(dir+(0.5-random(1)));
  let strokeY = (lengthDashes+(2-random(4)))*sin(45+(0.5-random(1)));
  let midX1 = lerp(x1,x2,0.33);
  let midX2 = lerp(x1,x2,0.66);
  let midY1 = lerp(y1,y2,0.33);
  let midY2 = lerp(y1,y2,0.66);

  cnvLine.strokeWeight((weight*0.66)+random(weight/3));
  cnvLine.line(x1,y1,x1+strokeX,y1+strokeY);

  strokeX = ((lengthDashes*0.66)+(2-random(4)))*cos(dir+(0.25-random(0.5)));
  strokeY = ((lengthDashes*0.66)+(2-random(4)))*sin(45+(0.25-random(0.5)));

  cnvLine.strokeWeight((weight*0.33)+random(weight/3));
  cnvLine.line(midX1,midY1,midX1+strokeX,midY1+strokeY);
  cnvLine.line(midX2,midY2,midX2+strokeX,midY2+strokeY);
}

//Functions (drawing; part)
function bezierWobble(x1, y1, cx1, cy1, cx2, cy2, x2, y2, gap, res, weight){
  let t = 0;
  let new_x = bezierPoint(x1,x1+cx1,x2-cx2,x2,t)+(1-random(2));
  let old_x = new_x;
  let new_y = bezierPoint(y1,y1+cy1,y2-cy2,y2,t)+(1-random(2));
  let old_y = new_y;

  for(let i = 0; i < res+1; i++){
    t = i/res;
    new_x = bezierPoint(x1,x1+cx1,x2-cx2,x2,t)+(1-random(2));
    new_y = bezierPoint(y1,y1+cy1,y2-cy2,y2,t)+(1-random(2));  
    
    if(Math.random() > gap){
      cnvLine.strokeWeight(weight+random(weight/3));
      cnvLine.line(old_x,old_y,new_x,new_y);
    }

    old_x = new_x;
    old_y = new_y;
  }
}

function bezierQuadraticWobble(x1, y1, cx, cy, x2, y2, gap, res, weight){
  let t = 0;
  let new_x = lerp(lerp(x1,cx,t),lerp(cx,x2,t),t)+(1-random(2));
  let new_y = lerp(lerp(y1,cy,t),lerp(cy,y2,t),t)+(1-random(2));
  let old_x = new_x;
  let old_y = new_y;
  
  for(i = 0; i < res+1; i++){
    t = i/res;
    new_x = lerp(lerp(x1,cx,t),lerp(cx,x2,t),t)+(1-random(2));
    new_y = lerp(lerp(y1,cy,t),lerp(cy,y2,t),t)+(1-random(2));
    
    if(Math.random() > gap){
      cnvLine.strokeWeight(weight+random(weight/3));
      cnvLine.line(old_x,old_y,new_x,new_y);
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

  for (let i = 0; i < res; i++) {
    new_x = lerp(x1, x2, (i+1)/res)+(1-random(2));
    new_y = lerp(y1, y2, (i+1)/res)+(1-random(2));
    
    if(Math.random() > gap){
      cnvLine.strokeWeight(weight+random(weight/3));
      cnvLine.line(old_x,old_y,new_x,new_y);
    }
    
    old_x = new_x;
    old_y = new_y;
  }
}

function ellipseWobble(x, y, rMin, rMax, w, h, noiseMax, gap, cut, drop, reset, weight){
  let offsetX = map(cos(0),-1,1,0,noiseMax);
  let offsetY = map(sin(0),-1,1,0,noiseMax);
  let r = map(noise(offsetX, offsetY),0,1,rMin,rMax);
  let new_x = (r*w) * cos(0);
  let new_y = (r*h) * sin(0);
  let old_x = new_x;
  let old_y = new_y;
  let weightMin = weight*0.33;
  let weightMax = weight+random(1.5); 
  let weightSun = weightMin;
  let curveInc = random(22.5);
  let curveMid = (45-curveInc) + (((225+curveInc) - (45-curveInc))/2);

  angleMode(RADIANS);

  cnvLine.push();
  cnvLine.translate(x,y);

  //Inside
  if(cut > 0){//0 = outline only; 1 = cut & outline; 2 = cut only
    cnvLine.erase();
    cnvLine.beginShape();
    
    for(let i = 0; i < TWO_PI+0.1; i += 0.1){
      offsetX = map(cos(i),-1,1,0,noiseMax);
      offsetY = map(sin(i),-1,1,0,noiseMax);
      r = map(noise(offsetX, offsetY),0,1,rMin,rMax);
      new_x = (r*w) * cos(i);
      new_y = (r*h) * sin(i);
      cnvLine.vertex(new_x,new_y);  
    }
    
    cnvLine.endShape(CLOSE);
    cnvLine.noErase();
  }

  //Outline
  if(cut < 2){
    for(let ang = 0; ang < TWO_PI+0.1; ang += 0.1){
      offsetX = map(cos(ang),-1,1,0,noiseMax);
      offsetY = map(sin(ang),-1,1,0,noiseMax);
      r = map(noise(offsetX, offsetY),0,1,rMin,rMax);
      new_x = (r*w) * cos(ang);
      new_y = (r*h) * sin(ang);

      if(drop == 1){
        if(degrees(ang) > (45-curveInc) && degrees(ang) < (225+curveInc)){
          if(degrees(ang) <= curveMid){
            weightSun = map(degrees(ang),45-curveInc,curveMid,weightMin,weightMax);
            
          }
          else{
            weightSun = map(degrees(ang),curveMid,225+curveInc,weightMax,weightMin);
          }
        }
        else{
          weightSun = weightMin;  
        }
      }
      else{
        weightSun = weight;
      }
      
      if(Math.random() > gap){
        cnvLine.strokeWeight(weightSun+random(weightSun/3));
        cnvLine.line(old_x,old_y,new_x,new_y);
      }

      old_x = new_x;
      old_y = new_y;
    }
  }

  cnvLine.pop();

  angleMode(DEGREES);

  if(reset == 1){
    noiseSeed(random(9999999));
  }
}

function poissonDisc(weight){
  // Daniel Shiffman
  // http://codingtra.in
  // http://patreon.com/codingtrain
  let r = weight;
  let k = 30;
  let grid = [];
  let w = (r*3) / Math.sqrt(2);
  let active = [];
  let cols;
  let rows;
  let ordered = [];

  cols = floor(width / w);
  rows = floor(height / w);
  for (let i = 0; i < cols * rows; i++) {
    grid[i] = undefined;
  }

  let x = width / 2;
  let y = height / 2;
  let i = floor(x / w);
  let j = floor(y / w);
  let pos = createVector(x, y);
  grid[i + j * cols] = pos;
  active.push(pos);

  for (let total = 0; total < 25; total++) {
    while (active.length > 0) {
      let randIndex = floor(random(active.length));
      let pos = active[randIndex];
      let found = false;
      for (let n = 0; n < k; n++) {
        let sample = p5.Vector.random2D();
        let m = random(r, 2 * r);
        sample.setMag(m);
        sample.add(pos);

        let col = floor(sample.x / w);
        let row = floor(sample.y / w);

        if (col > -1 && row > -1 && col < cols && row < rows && !grid[col + row * cols]) {
          let ok = true;
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              let index = (col + i) + (row + j) * cols;
              let neighbor = grid[index];
              if (neighbor) {
                let d = p5.Vector.dist(sample, neighbor);
                if (d < r) {
                  ok = false;
                }
              }
            }
          }
          if (ok) {
            found = true;
            grid[col + row * cols] = sample;
            active.push(sample);
            ordered.push(sample);
            break;
          }
        }
      }

      if (!found) {
        active.splice(randIndex, 1);
      }

    }
  }

  for (let i = 0; i < ordered.length; i++) {
    if (ordered[i]) {
      //cnvLine.strokeWeight(r);
      //cnvLine.point(ordered[i].x, ordered[i].y);
      cnvLine.ellipse(ordered[i].x, ordered[i].y,r*(0.5+random(0.5)),r*(0.5+random(0.5)));
    }
  }
}

//Function (drawing; shading)
function setupShade(){
  cnvShadeLight.noStroke();
  cnvShadeLight.fill(0);
  cnvShadeMid.noStroke();
  cnvShadeMid.fill(0);
  cnvShadeDark.noStroke();
  cnvShadeDark.fill(0);

  let sh_l = 6+random(2);
  let sh_m = 4+random(2);
  let sh_d = 2+random(2);

  for(let i = 0; i < width/sh_l; i++){
    for(let j = 0; j < height/sh_l; j++){
      if(i % 2 == 0 && j % 2 == 1 || i % 2 == 1 && j % 2 == 0){
        cnvShadeLight.circle((i*sh_l),(j*sh_l),sh_l*0.5);
      }
    }
  }

  for(let i = 0; i < width/sh_m; i++){
    for(let j = 0; j < height/sh_m; j++){
      if(i % 2 == 0 && j % 2 == 1 || i % 2 == 1 && j % 2 == 0){
        cnvShadeMid.circle((i*sh_m),(j*sh_m),sh_m*0.66);
      }
    }
  }

  for(let i = 0; i < width/sh_d; i++){
    for(let j = 0; j < height/sh_d; j++){
      if(i % 2 == 0 && j % 2 == 1 || i % 2 == 1 && j % 2 == 0){
        cnvShadeDark.circle((i*sh_d),(j*sh_d),sh_d*0.75);
      }
    }
  }
}

function drawShade(shade){
  switch(shade){
    case 0:
      cnvFill.image(cnvShadeLight,0,0);
    break;

    case 1:
      cnvFill.image(cnvShadeMid,0,0);
    break;

    case 2:
      cnvFill.image(cnvShadeDark,0,0);
    break;

    case 3:
      cnvFill.rect(0,0,width,height);
    break;
  }
}

function ellipseShade(x, y, rMin, rMax, w, h, noiseMax, cut, reset, shade){
  angleMode(RADIANS);

  cnvFill.push();
  cnvFill.translate(x,y);

  //Erase
  if(cut > 0){//0 = just fill; 1 = erase and fill; 2 = just erase
    cnvFill.erase();
    cnvFill.beginShape();
    
    for(let ang = 0; ang < TWO_PI+0.1; ang += 0.1){
      offsetX = map(cos(ang),-1,1,0,noiseMax);
      offsetY = map(sin(ang),-1,1,0,noiseMax);
      r = map(noise(offsetX, offsetY),0,1,rMin,rMax);
      new_x = (r*w) * cos(ang);
      new_y = (r*h) * sin(ang);
      cnvFill.vertex(new_x,new_y);  
    }
    
    cnvFill.endShape(CLOSE);
    cnvFill.noErase();
  }

  //Fill
  if(cut < 2){
    cnvFill.beginClip();
    cnvFill.beginShape();
    
    for(let ang = 0; ang < TWO_PI+0.1; ang += 0.1){
      offsetX = map(cos(ang),-1,1,0,noiseMax);
      offsetY = map(sin(ang),-1,1,0,noiseMax);
      r = map(noise(offsetX, offsetY),0,1,rMin,rMax);
      new_x = (r*w) * cos(ang);
      new_y = (r*h) * sin(ang);
      cnvFill.vertex(new_x,new_y);  
    }
    
    cnvFill.endShape(CLOSE);
    cnvFill.endClip();

    cnvFill.translate(-x,-y);

    drawShade(shade);
  }

  cnvFill.pop();

  angleMode(DEGREES);

  if(reset == 1){
    noiseSeed(random(9999999));
  }
}

//Functions (misc)
function mouseClicked(){
  cleanUp();
  loop();
  noLoop();
}

function cleanUp(){
  if (cnvLine) {
    cnvLine.remove();
    cnvLine = null;
  }
  if (cnvFill) {
    cnvFill.remove();
    cnvFill = null;
  }
  if (cnvShadeLight) {
    cnvShadeLight.remove();
    cnvShadeLight = null;
  }
  if (cnvShadeMid) {
    cnvShadeMid.remove();
    cnvShadeMid = null;
  }
  if (cnvShadeDark) {
    cnvShadeDark.remove();
    cnvShadeDark = null;
  }
}

function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) { 
 
      var j = Math.floor(Math.random() * (i + 1));
                 
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
  }
     
  return array;
}

function weightedRandom(obj){
    // Returns a random property of obj whose property values are all numbers.
    // The probability of a property being selected is based on its value.
    // E.g. {foo:5, bar:10} will return bar twice as often as foo.
    let result = undefined;
    let total = 0;

    for (const property in obj) {
        total += obj[property];
    }

    let index = Math.random()*total;

    for (const property in obj) {
        const value = obj[property];
        if (index < value) {
            result = property;
            break;
        } else {
            index -= value;
        }
    }

    return result;
}