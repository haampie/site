function Programma(canvas){
  var self = this;
  
  this.vogels = [];
  this.aantalVogels = 0;
  this.canvas = canvas;
  this.ctx = canvas.getContext('2d');
  this.breedte = canvas.width;
  this.hoogte = canvas.height;
  this.hBreedte = canvas.width/2;
  this.hHoogte = canvas.height/2;
  this.center = new Vector(this.hBreedte, this.hHoogte);
  this.shift = new Vector(0, 0);
  
  this.magneetPunt = new Vector(100, 100);
  this.magneetPunt2 = new Vector(500, 500);
  
  
  canvas.onclick = function(e){
    self.canvasClick(e);
  };
}

Programma.prototype.canvasClick = function(e){
  this.magneetPunt = new Vector(e.pageX - this.canvas.offsetLeft, e.pageY - this.canvas.offsetTop);
};

Programma.prototype.nieuweVogel = function(vogel){
  this.vogels.push(vogel);
  this.aantalVogels++;
  return this;
};

Programma.prototype.zwaartePunt = function(vogel){
  var som = new Vector();
  for(var i=0; i<this.aantalVogels; i++){
    if(i === vogel) continue;
    som.plus(this.vogels[i].p);
  }
  
  som.deel(this.aantalVogels-1);
  
  return som.krijgVerschil(this.vogels[vogel].p).deel(100);
};

Programma.prototype.gemiddeldeSnelheid = function(vogel){
  var som = new Vector();
  for(var i=0; i<this.aantalVogels; i++){
    if(i === vogel) continue;
    som.plus(this.vogels[i].v);
  }
  
  som.deel(this.aantalVogels-1);
  
  return som.min(this.vogels[vogel].v).deel(8);
};

Programma.prototype.onderlingeAfstand = function(vogel){
	var richting = new Vector();
  
  for(var i=0; i<this.aantalVogels; i++){
    if(i === vogel) continue;
    var verschil = this.vogels[i].p.krijgVerschil(this.vogels[vogel].p);
    var norm = verschil.norm
    if(norm < 80){
      verschil.deel(norm).keer(1-norm/80);
      richting.min(verschil);
    }
  }
  
  return richting;
};

Programma.prototype.naarPlaats = function(punt, vogel){
  return punt.krijgVerschil(this.vogels[vogel].p).deel(400);
};

Programma.prototype.stap = function(){
  this.ctx.clearRect(0, 0, this.breedte, this.hoogte);
  
  this.ctx.save();
  this.shift = new Vector(-this.center.x, -this.center.y);
  this.ctx.translate(this.center.x, this.center.y);
  
  for(var i=0; i<this.aantalVogels; i++){
  
    // Beweeg twee individuen meer richting een bepaalde plaats
    if(i < 25) {
      this.magneetPunt.tekenAlsPunt(this.ctx, this.shift);
      this.vogels[i].v.plus(this.naarPlaats(this.magneetPunt, i));
    }
    
    this.vogels[i].v.plus(this.zwaartePunt(i));
    this.vogels[i].v.plus(this.onderlingeAfstand(i));
    this.vogels[i].v.plus(this.gemiddeldeSnelheid(i));
    this.vogels[i].snelheidsLimiet();
  
    this.vogels[i].beweeg();
  }
  
  for(var i=0; i<this.aantalVogels; i++){
    // Beweeg de vogel en teken hem
    this.vogels[i].teken(this.ctx, this.shift);
  }
  
  this.ctx.restore();
};

Vector.prototype.tekenAlsPunt = function(ctx, shift){
  ctx.beginPath();
  ctx.fillStyle = '#333';
  ctx.arc(this.x + shift.x, this.y + shift.y, 2, 0, Math.PI*2, true);
  ctx.fill();
};

function Vogel(positie, snelheid){
  this.p = positie;
  this.v = snelheid;
  this.color = 'rgb(' + [Math.randomInt(100, 200), Math.randomInt(100, 200), Math.randomInt(100, 200)].join(', ') + ')';
}

Vogel.prototype.teken = function(ctx, shift){
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.arc(this.p.x + shift.x, this.p.y + shift.y, 4, 0, Math.PI*2, true);
  ctx.fill();
  
  ctx.beginPath();
  ctx.strokeStyle = 'red';
  ctx.moveTo(this.p.x + shift.x, this.p.y + shift.y);
  ctx.lineTo(this.p.x+this.v.x + shift.x, this.p.y+this.v.y + shift.y);
  ctx.stroke();
  
  return this;
};

Vogel.prototype.beweeg = function(){
  this.p.plus(this.v);
};

Vogel.prototype.snelheidsLimiet = function(){
  var snelheid = this.v.norm;
  if(snelheid > 4){
    this.v.deel(snelheid).keer(4);
  }
};

var programma = new Programma(document.getElementById('canvas'));

// 10 vogels gebruiken
for(var j=0; j<50; j++){
  var vogel = new Vogel(
    new Vector(Math.randomInt(100, 500), Math.randomInt(100, 500)),
    new Vector(Math.random()*4-2, Math.random()*4-2)
  );
  
  programma.nieuweVogel(vogel);
}

var interval = setInterval(function(){
  programma.stap()
}, 30);

document.body.onkeydown = function(e){
  if(e.which == 32){
    if(interval){
      clearInterval(interval);
      interval = null;
    } else {
      interval = setInterval(function(){
        programma.stap()
      }, 30);
    }
    return false;
  }
};