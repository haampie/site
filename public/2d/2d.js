var Frameteller = function(){
	var aantalFrames = [];
	var framesVoorGemiddelde = 10;
	var laatsteTijd;
	var fpsEl;
	
	function nieuwFrame(){
		var nu = new Date().getTime();
		aantalFrames.push(nu);
		if(aantalFrames.length == framesVoorGemiddelde){
			fpsEl.innerHTML = Math.round((1000*framesVoorGemiddelde)/(nu - aantalFrames.shift()));
		}
	}
	
	function init(el){
		fpsEl = el;
	}
	
	return {
		nieuwFrame: nieuwFrame,
		init: init
	}
}();

var Lader = function(){
	var aantal=0;
	var geladen=0;
	
	function plaatjeGeladen(){
		geladen++;
		if(geladen === aantal) {
			return true;
		}
		
		return false;
	}
	
	function voegAantalToe(num){
		aantal += num;
	}
	
	function getVoortgang(){
		return Math.round(100*geladen/aantal);
	}
	
	return {
		plaatjeGeladen: plaatjeGeladen,
		voegAantalToe: voegAantalToe,
		getVoortgang: getVoortgang
	};
}();

var TwoDimensional = function(){
	
	var canvas;
	
	var voortgangEl, gereedschapEl;
	
	var opties = {
		breedte: 8,
		hoogte: 6,
		vakje: 100,
		actieveTexture: 0,
		schietSnelheid: 8,
		BGposX: 400,
		BGposY: 300,
		BGposEchtX: 400,
		BGposEchtY: 300,
	};
	
	var level=
	[[4, 0, 3, 8, 2, 2, 7, 4, 0, 3, 8, 2, 2],
	 [5, 1, 6, 4, 0, 0, 3, 5, 1, 6, 4, 0, 0],
	 [8, 2, 7, 4, 0, 0, 3, 8, 2, 7, 4, 0, 0],
	 [4, 0, 3, 5, 1, 1, 6, 4, 0, 3, 5, 1, 1],
	 [4, 0, 3, 8, 2, 2, 7, 4, 0, 3, 8, 2, 2],
	 [4, 0, 3, 4, 0, 0, 3, 4, 0, 3, 4, 0, 0],
	 [4, 0, 3, 4, 0, 0, 3, 4, 0, 3, 4, 0, 0],
	 [4, 0, 3, 4, 0, 0, 3, 4, 0, 3, 4, 0, 0],
	];
	
	var tegels = [
		{kleur: '#8ca2a0', img: 'trottoir.png'},               // 0
		{kleur: '#646756', img: 'straatBoven.png'},            // 1
		{kleur: '#b0af7f', img: 'straatOnder.png'},            // 2
		{kleur: '#b0af7f', img: 'straatLinks.png'},            // 3
		{kleur: '#b0af7f', img: 'straatRechts.png'},           // 4
		{kleur: '#b0af7f', img: 'straatBochtRechtsboven.png'}, // 5
		{kleur: '#b0af7f', img: 'straatBochtLinksboven.png'},  // 6
		{kleur: '#b0af7f', img: 'straatBochtLinksonder.png'},  // 7
		{kleur: '#b0af7f', img: 'straatBochtRechtsonder.png'}  // 8
	];
	
	var toetsen = {
		links: false,
		boven: false,
		rechts: false,
		onder: false,
		schiet: false
	};
	
	var held = {
		x: 100,
		y: 100,
		richting: 0,
		snelheid: 4,
		schietTijd: 0
	};
	
	var kogels = [];
	
	var kogelEl;
	
	
	function verplaatsHeld(){
		// Kijk of de knop naar links is ingedrukt
		if(toetsen.links){
			held.richting -= 0.2;
		}
		
		// Kijk of de knop naar rechts is ingedrukt
		else if(toetsen.rechts){
			held.richting += 0.2;
		}
		
		// Richting tussen 0 en 2PI laten vallen
		if(held.richting > 2*Math.PI){
			held.richting -= 2*Math.PI;
		} else if(held.richting > 0){
			held.richting += 2*Math.PI;
		}
		
		// Kijk of de boven naar links is ingedrukt
		if(toetsen.boven){
			held.x += Math.cos(held.richting)*held.snelheid;
			held.y += Math.sin(held.richting)*held.snelheid;
		}
		
		// Kijk of de onder naar links is ingedrukt
		else if(toetsen.onder){
			held.x -= Math.cos(held.richting)*held.snelheid;
			held.y -= Math.sin(held.richting)*held.snelheid;
		}	
	}
	
	/**
	 * Tekent de held
	 */
	function tekenHeld(){
		
		/** Held zelf **/
		canvas.save();
		
		var heldPos = krijgAbsolutePositieTOVachtergrond(held.x, held.y);
		
		canvas.translate(heldPos.x, heldPos.y);
		canvas.rotate(held.richting);
		
		
		// Teken het wapen
		canvas.fillStyle = '#222';
		canvas.fillRect(0, 0, 20, 6);
		
		// Teken het poppetje
		canvas.beginPath();
		canvas.fillStyle = 'black';
		canvas.arc(0, 0, 10, 0, Math.PI*2, true);
		canvas.fill();
		
		canvas.restore();
		
		/** Schieten **/
		
		// Maak nieuwe kogels
		if(held.schietTijd>0){
			held.schietTijd--;
		}
		
		// Kijk of de held wil schieten en mag schieten
		if(toetsen.schiet && held.schietTijd === 0){
			
			// Schiet-afteller
			held.schietTijd = opties.schietSnelheid;

			// Voeg de kogel toe
			kogels.push({
				x: held.x,
				y: held.y,
				richting: held.richting
			});
		}
		
		// Teken en beweeg de kogels
		if(kogels.length>0){
			canvas.fillStyle = 'orange';
			var i=0;
			while(true){
				canvas.save();
				
				// Verplaats de kogel
				kogels[i].x += Math.cos(kogels[i].richting)*held.snelheid*3;
				kogels[i].y += Math.sin(kogels[i].richting)*held.snelheid*3;
				var kogelPos = krijgAbsolutePositieTOVachtergrond(kogels[i].x, kogels[i].y);
				
				// Kijk of de kogel nog zichtbaar is
				if(!isZichtbaar(kogels[i].x, kogels[i].y, 10)){
					kogels.splice(i, 1);
				} else {
					// Teken de kogel
					canvas.translate(kogelPos.x, kogelPos.y);
					canvas.rotate(kogels[i].richting);
					
					canvas.fillRect(0, 0, 10, 2);
					
					i++;
				}
				
				canvas.restore();
				
				if(i>=kogels.length){
					break;
				}
			}
		}
		
		kogelEl.innerHTML = kogels.length;
	}
	
	
	/**
	 * tekenLevel tekent de plattegrond
	 */
	function tekenLevel(){
		Frameteller.nieuwFrame();
		
		canvas.clearRect(0, 0, canvas.canvas.width, canvas.canvas.height);
		
		verplaatsHeld();
		
		opties.BGposX = opties.BGposEchtX = canvas.canvas.width/2-held.x;
		opties.BGposY = opties.BGposEchtY = canvas.canvas.height/2-held.y;
		
		// Kijk of de persoon helemaal links loopt
		if(opties.BGposX > 0){
			opties.BGposX = 0;
		}
		
		// Kijk of de persoon helemaal rechts loopt
		else if(opties.BGposX < canvas.canvas.width - level[0].length*opties.vakje){
			opties.BGposX = canvas.canvas.width - level[0].length*opties.vakje;
		}
		
		
		// Kijk of de persoon helemaal boven loopt
		if(opties.BGposY > 0){
			opties.BGposY = 0;
		}
		
		// Kijk of de persoon helemaal onder loopt
		else if(opties.BGposY < canvas.canvas.height - level.length*opties.vakje){
			opties.BGposY = canvas.canvas.height - level.length*opties.vakje;
		}
		
		var min = coordToTilePosition(krijgRelatievePositieTOVachtergrond(0, 0));
		var max = coordToTilePosition(krijgRelatievePositieTOVachtergrond(canvas.canvas.width-1, canvas.canvas.height-1));
		
		
		
		for(var y=min.y; y<=max.y; y++){
			for(var x=min.x; x<=max.x; x++){
				
				// Kijk of er een plaatje is voor die vakje
				if(typeof tegels[level[y][x]].imgObj != 'undefined'){
					// Teken het achtergrondplaatje
					canvas.drawImage(tegels[level[y][x]].imgObj, Math.round(opties.BGposX + opties.vakje*x), Math.round(opties.BGposY + opties.vakje*y));
				} else {
					canvas.fillStyle = tegels[level[y][x]].kleur;
					canvas.fillRect(opties.BGposX + opties.vakje*x, opties.BGposY + opties.vakje*y, opties.vakje, opties.vakje);
				}
			}
		}
		
		// Teken de held ook elke keer
		tekenHeld();		
	}
	
	function krijgAbsolutePositieTOVachtergrond(xC, yC){
		return {
			x: opties.BGposX + xC,
			y: opties.BGposY + yC
		};
	}
	
	function krijgRelatievePositieTOVachtergrond(xC, yC){
		return {
			x: xC - opties.BGposX,
			y: yC - opties.BGposY,
		}
	}
	
	function isZichtbaar(x, y, extra){
		var pos = krijgAbsolutePositieTOVachtergrond(x, y);
		
		if(typeof extra != 'Number'){
			extra = 0;
		}
		
		if(pos.x<-extra || pos.y <-extra){
			return false;
		}
		
		if(pos.x-extra>canvas.canvas.width || pos.y-extra>canvas.canvas.height){
			return false;
		}
		
		return true;
	}
	
	/**
	 * Krijg de coordinaten van de muis relatief aan een element bij een Event
	 */
	function getOffset(e){
		return {
			x: e.pageX - canvas.canvas.offsetLeft,
			y: e.pageY - canvas.canvas.offsetTop
		};
	}
	
	/**
	 * Krijg de tile waar als je coordinaten invult
	 */
	function coordToTilePosition(obj){
		return {
			x: Math.floor(obj.x/opties.vakje),
			y: Math.floor(obj.y/opties.vakje)
		};
	}
	
	function mouseDown(e){
		var offset = getOffset(e);
		var rel = krijgRelatievePositieTOVachtergrond(offset.x, offset.y);
		var vakje = coordToTilePosition(rel);
		
		level[vakje.y][vakje.x] = opties.actieveTexture;
	}
	
	function geladen(){
		if(Lader.plaatjeGeladen()){
			tekenLevel();
			setInterval(tekenLevel, 35);
		}
		voortgangEl.innerHTML = Lader.getVoortgang();
	}
	
	function setActiveTexture(i){
		return function(){
			gereedschapEl.childNodes[opties.actieveTexture].className = 'selector';
			gereedschapEl.childNodes[i].className = 'selector selected';
			opties.actieveTexture = i;
		}
	}
	
	function veranderToetsen(welke, manier){
		switch (welke){
			case 65: case 37: toetsen.links = manier; return true;
			case 87: case 38: toetsen.boven = manier; return true;
			case 68: case 39: toetsen.rechts = manier; return true;
			case 83: case 40: toetsen.onder = manier; return true;
			case 32:          toetsen.schiet = manier; return true;
		}
		return false;
	}
	
	/**
	 * Teken de tiles onder de <canvas> waarmee je de plattegrond kunt aanpassen
	 */
	function gereedschappenMaker(){
		for(var i=0; i < tegels.length; i++){
			var kind = document.createElement('div');
			kind.className = 'selector';
			kind.style.backgroundImage = 'url(' + tegels[i].img + ')';
			kind.onclick = setActiveTexture(i);
			gereedschapEl.appendChild(kind);
		}
	}
	
	
	/**
	 * Initialiseer de klasse
	 * @param {Object} c Een object met opties
	 */
	function init(c){
		// Context - zodat je kunt kleuren
		canvas = c.canvas.getContext('2d');
		
		// Gereedschapselement met plaatjes
		gereedschapEl = c.gereedschapsEl;
		
		// Maak de gereedschappen onder het canvaselement
		gereedschappenMaker();
		
		// setActiveTexture is een closure, vandaar dubbele haakjes
		setActiveTexture(0)();
		
		// Verander de achtergrondkleur van het canvas
		canvas.canvas.style.backgroundColor = 'ForestGreen';
		
		// In dit element komt te staan hoever de plaatjes zijn met downloaden
		voortgangEl = c.voortgangEl;
		
		// In dit element komt het aantal frames/seconde
		Frameteller.init(c.frameTelEl);
		
		// Geef door aan de lader hoeveel plaatjes er zijn
		Lader.voegAantalToe(tegels.length);
		
		// Klikken op het canvas opvangen
		canvas.canvas.onclick = mouseDown;
		
		// Toetsen registreren
		document.onkeydown = function(e){
			if(veranderToetsen(e.keyCode, true)){
				return false;
			}
		};
		
		document.onkeyup = function(e){
			if(veranderToetsen(e.keyCode, false)){
				return false;
			}
		};
		
		// Laad elk plaatje
		for(var i=0; i < tegels.length; i++){
			tegels[i].imgObj = new Image();
			tegels[i].imgObj.onload = geladen;
			tegels[i].imgObj.src = tegels[i].img;
		}
		
		kogelEl = document.getElementById('kogels');

	}
	
	return {
		init: init
	};
}();

window.onload = function(){
	TwoDimensional.init({
		canvas: document.getElementById('canvas'),
		gereedschapsEl: document.getElementById('textuur-selector'),
		voortgangEl: document.getElementById('status'),
		frameTelEl: document.getElementById('fps')
	});
};