function $(wut){
	return document.getElementById(wut);
}

function Cirkel(straal, startPositie, tegenKlokIn, snelheid){
	this.straal = straal;
	this.startPositie = this.huidigePositie = startPositie;
	this.tegenKlokIn = tegenKlokIn;
	this.snelheid = snelheid;
}

Cirkel.prototype.draai = function(){
	var verandering = this.snelheid/(2*Math.PI);
	if(this.tegenKlokIn){
		verandering = -verandering;
	}
	
	this.huidigePositie += verandering;
	
	if(this.huidigePositie > 2){
		this.huidigePositie-=2;
	} else if(this.huidigePositie < -2){
		this.huidigePositie+=2;
	}
	return this;
};

var CirkelTekenaar = function(){
	var cirkels = [];
	var pause = false;
	var vorigePositie = null;
	var lijnTekenCanvas;
	var cirkelBewerkElement;
	var interval;
	var ctx;
	
	function veranderPause(){
		if(pause){
			interval = setInterval(function(){
				CirkelTekenaar.tekenCirkels(ctx);
			}, 1);
		} else {
			clearInterval(interval);
		}
		
		pause=!pause;
	}
	
	function prepareerCirkelbewerker(){
		cirkelBewerkElement.value = '//new Cirkel(straal, startPositie [-0.5 tot 0.5], tegenKlokIn, snelheid\n\nCirkelTekenaar.maakCirkels(\n';
		for(var i=0; i < cirkels.length; i++){
			cirkelBewerkElement.value += '   new Cirkel(';
			cirkelBewerkElement.value += cirkels[i].straal + ', ' + cirkels[i].startPositie + ', ' + cirkels[i].tegenKlokIn + ', ' + cirkels[i].snelheid;
			cirkelBewerkElement.value += ')' + (i+1<cirkels.length ? ',\n':'\n);');
		}
	}
	
	function pushBack(obj){
		cirkels.push(obj);
	}
	
	function maakCirkels(){
		lijnTekenCanvas.clearRect(0, 0, lijnTekenCanvas.canvas.width, lijnTekenCanvas.canvas.height);
		vorigePositie = null;
		cirkels = Array.prototype.slice.call(arguments);
		if(pause){
			pause=false;
		}
	}
	
	function tekenCirkels(ctx){
		if(pause){
			return;
		}
		
		var x, y;
		
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		for(var i=0; i<cirkels.length; i++){
			ctx.strokeStyle = '#AAA';
			cirkels[i].draai();
			
			if(i === 0){
				x = ctx.canvas.width/2;
				y = ctx.canvas.height/2;
			}
			
			var start = cirkels[i].huidigePositie*Math.PI;

			ctx.beginPath();
			ctx.arc(x, y, cirkels[i].straal, 0, 2*Math.PI, cirkels[i].tegenKlokIn);
			ctx.stroke();
			
			
			x += Math.cos(start)*cirkels[i].straal; 
			y += Math.sin(start)*cirkels[i].straal;
			
			if(i+1==cirkels.length){
				ctx.fillStyle = 'red';
			} else {
				ctx.fillStyle = 'blue';
			}
			
			ctx.beginPath();
			ctx.arc(x, y, 3, 0, 2*Math.PI, false);
			ctx.fill();
		}
		
		if(vorigePositie !== null){
			ctx.strokeStyle = '#333';
			lijnTekenCanvas.beginPath();
			lijnTekenCanvas.moveTo(vorigePositie.x, vorigePositie.y);
			lijnTekenCanvas.lineTo(x, y);
			lijnTekenCanvas.stroke();
		}
		vorigePositie = {x: x, y:y};
	}
	
	function beginTekenen(){
		interval = setInterval(function(){
			CirkelTekenaar.tekenCirkels(ctx);
		}, 1);
	}
	
	function init(){
		lijnTekenCanvas = $('canvas2').getContext('2d');
		ctx = $('canvas').getContext('2d');
		cirkelBewerkElement = $('cirkels');
		ctx.canvas.onclick = function(){
			CirkelTekenaar.veranderPause();
			return false;
		};
	}
	
	return {
		beginTekenen: beginTekenen,
		pushBack: pushBack,
		tekenCirkels: tekenCirkels,
		veranderPause: veranderPause,
		init: init,
		prepareerCirkelbewerker: prepareerCirkelbewerker,
		maakCirkels: maakCirkels
	};
}();


window.onload = function(){
	CirkelTekenaar.init();
	CirkelTekenaar.pushBack(new Cirkel(70, 0, true, 0.13));
	CirkelTekenaar.pushBack(new Cirkel(100, 0, true, 0.15));
	CirkelTekenaar.pushBack(new Cirkel(20, 0.25, false, 0.3));
	CirkelTekenaar.prepareerCirkelbewerker();
	CirkelTekenaar.beginTekenen();
	
	$('laatC1Zien').onchange = function(){
		$('canvas').style.display = this.checked ? 'block' : 'none';
	};
	
	$('laatC2Zien').onchange = function(){
		$('canvas2').style.display = this.checked ? 'block' : 'none';
	};
	
	$('form').onsubmit = function(){
		try {
			(new Function($('cirkels').value))();
		} catch(e){
			alert(e.name + ': ' + e.message);
		}
		return false;
	};
};