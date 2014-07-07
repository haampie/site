var BubbleBreaker = function(){
  
  var canvas;
  
  var opties = {
    breedte: 980,
    hoogte: 600,
    zoom: 30,
    kleurende: false,
    kleuren: ['#008000', '#0000FF', '#FF0000', '#800080', '#FFA500'],
    padding: 10,
    zet: null,
    punten: null
  };
  
  var veld = [];
  
  var score = 0;
  
  var geselecteerd = 0;
  
  var fini = false;
  
  var vallende = false;
  
  function isVakjeMogelijk(xOud, yOud, xNieuw, yNieuw){
    return    xNieuw < opties.breedte 
           && yNieuw < opties.hoogte
           && xNieuw >= 0
           && yNieuw >= 0
           && !veld[yNieuw][xNieuw].gevlagd 
           && !veld[yNieuw][xNieuw].leeg
           && veld[yNieuw][xNieuw].kleur == veld[yOud][xOud].kleur;
  }
  
  function floodFill(xCoord, yCoord){
    if(veld[yCoord][xCoord].gevlagd){
      return 0;
    }
    
    veld[yCoord][xCoord].gevlagd = true;
    var aantal = 1;
    
    // Kijk of je naar rechts kan
    if(isVakjeMogelijk(xCoord, yCoord, xCoord + 1, yCoord)){
      aantal += floodFill(xCoord+1, yCoord);
    }
    
    // Kijk of je naar links kan
    if(isVakjeMogelijk(xCoord, yCoord, xCoord - 1, yCoord)){
      aantal += floodFill(xCoord-1, yCoord);
    }
    
    // Kijk of je naar onder kan
    if(isVakjeMogelijk(xCoord, yCoord, xCoord, yCoord + 1)){
      aantal += floodFill(xCoord, yCoord+1);
    }
    
    // Kijk of je naar boven kan
    if(isVakjeMogelijk(xCoord, yCoord, xCoord, yCoord - 1)){
      aantal += floodFill(xCoord, yCoord-1);
    }

    return aantal;
  }
  
  function tekenVeld(){
    if(!fini){
      canvas.clearRect(0, 0, canvas.canvas.width, canvas.canvas.height);

      for(var y=0; y<opties.hoogte; y++){
        for(var x=0; x<opties.breedte; x++){
          if(veld[y][x].gevlagd && geselecteerd > 1){
            canvas.fillStyle = opties.kleuren[veld[y][x].kleur];
            canvas.globalAlpha = 0.4;
            canvas.beginPath();
            canvas.arc(opties.zoom*(x+0.5) + opties.padding, opties.zoom*(y+0.5) + opties.padding, opties.zoom/2+2, 0, 2*Math.PI, true);
            canvas.fill();
            canvas.globalAlpha = 1;
            canvas.closePath();          
          }
          
          canvas.fillStyle = veld[y][x].leeg ? 'white' : opties.kleuren[veld[y][x].kleur];
          canvas.beginPath();
          canvas.arc(opties.zoom*(x+0.5) + opties.padding, opties.zoom*(y+0.5) + opties.padding, opties.zoom/2-2, 0, 2*Math.PI, true);
          canvas.fill();
          canvas.closePath();
          
          canvas.fillStyle = 'rgba(255, 255, 255, .2)';
          canvas.beginPath();
          canvas.arc(opties.zoom*(x+0.4) + opties.padding, opties.zoom*(y+0.4) + opties.padding, opties.zoom/3-2, 0, 2*Math.PI, true);
          canvas.fill();
          canvas.closePath();
        }
      }
    }
  }
  
  function tekenEinde(teller){
    if(teller > 10) return;
    
    fini = true;
    canvas.font = '20px Verdana';
    canvas.textAlign = 'center';
    canvas.fillStyle = 'black';
    canvas.globalAlpha = 0.1;
    canvas.fillRect(0, 0, canvas.canvas.width, canvas.canvas.height);
    
    canvas.fillStyle = 'white';
    canvas.globalAlpha = 1;
    canvas.fillText("Awesome!", canvas.canvas.width/2, 50);
    canvas.fillText('Score: ' + score, canvas.canvas.width/2, 90);
    
    setTimeout(function(){
      tekenEinde(teller+1);
    }, 30);
  }

  function zetMogelijk(){
    for(var x=opties.breedte-1; x>=0; x--){
      if(veld[opties.hoogte-1][x].leeg){
        break;
      }
      
      for(var y=opties.hoogte-1; y>=0; y--){
        if(veld[y][x].leeg){
          break;
        }
        
        if(x+1 < opties.breedte && !veld[y][x+1].leeg && veld[y][x+1].kleur == veld[y][x].kleur){
          return true;
        }
        
        if(x-1 >= 0 && !veld[y][x-1].leeg && veld[y][x-1].kleur == veld[y][x].kleur){
          return true;
        }

        if(y+1 < opties.hoogte && !veld[y+1][x].leeg && veld[y+1][x].kleur == veld[y][x].kleur){
          return true;
        }

        if(y-1 >= 0 && !veld[y-1][x].leeg && veld[y-1][x].kleur == veld[y][x].kleur){
          return true;
        }        
      }
    }
    
    return false;
  }
  
  function schuifop(){
    var leegvakjeOver = false;
    for(var x=opties.breedte-1; x>0; x--){
      for(var y=0; y<opties.hoogte; y++){
        if(!veld[opties.hoogte-1][x-1].leeg && veld[opties.hoogte-1][x].leeg){
          
          if(!veld[y][x-1].leeg){
            veld[y][x].kleur = veld[y][x-1].kleur;
            veld[y][x].leeg = false;
            veld[y][x-1].leeg = true;
            leegvakjeOver = true;
          }
          
        } else {
          break;
        }
      }
    }
    
    if(leegvakjeOver){
      setTimeout(schuifop, 100);
      tekenVeld();
    } else {
      vallende = false;
      if(!zetMogelijk()){
        tekenEinde();
      }
    }
  }

  function laatvallen(){
    var leegvakjeOver = false;
    for(var x=0; x<opties.breedte; x++){
      for(var y=opties.hoogte-1; y>0; y--){
        if(!veld[y-1][x].leeg && veld[y][x].leeg){
          veld[y][x].kleur = veld[y-1][x].kleur;
          veld[y][x].leeg = false;
          veld[y-1][x].leeg = true;
          leegvakjeOver = true;
        }
      }
    }
    
    
    if(leegvakjeOver){
      tekenVeld();
      setTimeout(laatvallen, 100);
    } else {
      schuifop();
    }
  }
  
  function deselecteer(leeg){
    for(var y=0; y<opties.hoogte; y++){
      for(var x=0; x<opties.breedte; x++){
        if(veld[y][x].gevlagd){
          veld[y][x].gevlagd = false;
          
          if(leeg && geselecteerd > 1){
            veld[y][x].leeg = true;
          }
        }
      }
    }    
  }
  
  function klikkert(e){
    if(vallende){
      return false;
    }
    
    if(!e) var e=window.event;
    
    var offsetX = 0;
    var offsetY = 0;
    if (e.pageX || e.pageY){
      offsetX = e.pageX;
      offsetY = e.pageY;
    }
    else if (e.clientX || e.clientY)   {
      offsetX = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
      offsetY = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    
    
    offsetX -= canvas.canvas.offsetLeft + opties.padding;
    offsetY -= canvas.canvas.offsetTop + opties.padding;
    
    var xCoor = Math.floor(offsetX/opties.zoom);
    var yCoor = Math.floor(offsetY/opties.zoom);
    
    if(!veld[yCoor][xCoor].leeg){
      
      // Kijk of er al op geklikt is
      if(veld[yCoor][xCoor].gevlagd){
        // Zo ja, laat de boel knappen
        deselecteer(true);
        
        if(geselecteerd > 1){
          vallende = true;
          tekenVeld();
          laatvallen();
            
          score += geselecteerd*(geselecteerd-1);
            
          opties.punten.innerHTML = score;
          opties.zet.innerHTML = 0;
        }
      } else {
        // Zo nee, deselecteer de rest en kijk hoeveel punten dit gebied oplevert
        if(geselecteerd > 0){
          deselecteer(false);
        }
        geselecteerd = floodFill(xCoor, yCoor);
        opties.zet.innerHTML = geselecteerd*(geselecteerd-1);
        tekenVeld();
      }
    } else {
      deselecteer(false);
      tekenVeld();
    }
  }

  
  /**
   * Initialiseer de klasse
   * @param {Object} c Een object met opties
   */
  function init(c){
    canvas = c.canvas.getContext('2d');
    opties.zet = c.zet;
    opties.punten = c.punten;
    opties.breedte = (canvas.canvas.width-2*opties.padding)/opties.zoom;
    opties.hoogte = (canvas.canvas.height-2*opties.padding)/opties.zoom;
    
    for(var y=0; y<opties.hoogte; y++){
      veld[y] = [];
      for(var x=0; x<opties.breedte; x++){
        var random = Math.random();
        
        for(var i=0; i<opties.kleuren.length; i++){
          if(random < (i+1)/opties.kleuren.length){
            canvas.fillStyle = opties.kleuren[i];
            veld[y][x] = {
              leeg: false,
              kleur: i,
              gevlagd: false
            };
            break;
          }
        }
      }
    }
    
    tekenVeld();

    canvas.canvas.onclick = klikkert;
    document.onclick = function(e){
      if(!e) var e = window.event;
      
      
      if(!(e.target || e.srcElement).id == canvas.canvas.id && geselecteerd > 1){
        deselecteer(false);
        opties.zet.innerHTML = 0;
        tekenVeld();
      }
    };
  }
  
  return {
    init: init
  };
}();

window.onload = function(){
  BubbleBreaker.init({
    canvas: document.getElementById('canvas'),
    zet: document.getElementById('zet'),
    punten: document.getElementById('punten')    
  });
};