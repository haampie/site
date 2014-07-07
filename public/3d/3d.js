var DrieDimensies = function(){
	
	var ctx;
	
	var opties = {
		canvas: null,
		scherm: {
			breedte: 980,
			hoogte: 660
		},
		vakje: {
			breedte: 150
		},
		midden: {
			x: 490,
			y: 5
		},
		rotatie: 0
	};
	
	var veranderingDitFrame = {
		x: 0,
		y: 0
	}
	
	// Kijk of bepaalde knoppen naar beneden zijn
	var toetsenBord = {
		links: false,
		rechts: false,
		onder: false,
		boven: false,
		spatie: false
	};
	
	
	var veld =
	[[ 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1],
	 [ 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1],
	 [ 1, 1, 1, 2, 2, 2, 2, 0, 1, 1, 1],
	 [ 1, 1, 1, 1, 0, 0, 2, 0, 0, 1, 1],
	 [ 1, 1, 1, 1, 1, 0, 2, 0, 0, 1, 1],
	 [ 1, 1, 1, 1, 1, 0, 2, 2, 0, 0, 1],
	 [ 1, 1, 1, 1, 1, 0, 0, 2, 2, 0, 1],
	 [ 1, 1, 1, 1, 1, 0, 0, 2, 0, 0, 1],
	 [ 1, 1, 1, 1, 1, 0, 2, 2, 0, 1, 1],
	 [ 1, 1, 1, 1, 1, 0, 2, 0, 0, 1, 1],
	 [ 1, 1, 1, 1, 1, 0, 2, 0, 0, 1, 1],
	 [ 1, 1, 1, 1, 1, 0, 2, 2, 0, 0, 1],
	 [ 1, 1, 1, 1, 1, 0, 0, 2, 2, 0, 1],
	 [ 1, 1, 1, 1, 1, 0, 0, 2, 0, 0, 1],
	 [ 1, 1, 1, 1, 1, 0, 2, 2, 0, 1, 1],
	 [ 1, 1, 1, 1, 1, 0, 2, 0, 0, 1, 1],
	 [ 1, 1, 1, 1, 1, 0, 2, 0, 0, 1, 1],
	 [ 1, 1, 1, 1, 1, 0, 2, 2, 0, 0, 1],
	 [ 1, 1, 1, 1, 1, 0, 0, 2, 2, 0, 1],
	 [ 1, 1, 1, 1, 1, 1, 0, 0, 2, 0, 1],
	 [ 1, 1, 1, 1, 1, 1, 1, 0, 2, 0, 1],
	 [ 1, 1, 1, 1, 1, 1, 1, 0, 2, 0, 1]];
	 
	var hoogteMap =
	[[ 3, 4, 5, 5, 1, 1, 0, 1, 1, 1, 2, 2],
	 [ 4, 5, 6, 5, 1, 0, 0, 0, 1, 1, 1, 2],
	 [ 5, 6, 5, 4, 1, 0, 0, 0, 1, 1, 1, 1],
	 [ 4, 5, 5, 4, 1, 0, 0, 0, 0, 1, 1, 1],
	 [ 4, 5, 5, 4, 1, 0, 0, 0, 0, 1, 1, 1],
	 [ 1, 4, 4, 1, 1, 0, 0, 0, 0, 0, 1, 1],
	 [ 1, 3, 3, 1, 1, 0, 0, 0, 0, 0, 1, 1],
	 [ 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1],
	 [ 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1],
	 [ 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1],
	 [ 1, 1, 1, 1, 1, 0, 0, -1, -1, 1, 1, 1],
	 [ 1, 1, 1, 1, 1, 0, 0, -1, -1, 0, 1, 1],
	 [ 1, 1, 1, 1, 1, 0, 0, -1, -1, 0, 1, 1],
	 [ 1, 1, 1, 1, 1, 0, 0, -1, -1, 0, 1, 1],
	 [ 1, 1, 1, 1, 1, 0, 0, -1, -1, 1, 1, 1],
	 [ 1, 1, 1, 1, 1, 0, 0, -1, -1, 1, 1, 1],
	 [ 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1],
	 [ 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1],
	 [ 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1],
	 [ 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1],
	 [ 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1],
	 [ 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1],
	 [ 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1]];
	
	var veldTypes = [
		{
			kleur: '#ADFF2F'
		},
		{
			kleur: '#228B22'
		},
		{
			kleur: '#48D1CC'
		},
		{
			kleur: '#302D2D'
		}
	];
	
	
	/**
	 * Krijg een optie met naam
	 * @param {String} naam Naam van de optie
	 * @return Inhoud van de optie
	 */
	function krijgOptie(naam){
		return opties[naam];
	}
	
	/**
	 * Wijzig bestaande opties
	 * @param {Object} nieuw Een object met opties
	 * @throws String Exceptie als string
	 */
	function wijzigOpties(nieuw, tekenMeteen){
		if(typeof nieuw != 'object'){
			throw "Verkeerd type voor opties gestuurd: " + typeof(nieuw);
		}
		
		// Bekijk elke nieuwe optie
		for(var a in nieuw){
			if(nieuw.hasOwnProperty(a)){
				
				// Kijk of die optie bestaat
				if(opties.hasOwnProperty(a)){
					opties[a] = nieuw[a];
				} else {
					throw "Optie " + a + " bestaat niet";
				}
			}
		}
		
		if(tekenMeteen === true){
			teken();
		}
	}
	
	function veranderKnopjes(welke, manier){
		switch (welke){
			case 65: case 37: toetsenBord.links = manier; return true;
			case 87: case 38: toetsenBord.boven = manier; return true;
			case 68: case 39: toetsenBord.rechts = manier; return true;
			case 83: case 40: toetsenBord.onder = manier; return true;
			case 32: toetsenBord.spatie = manier; return true;
		}
		return false;
	}
	
	function kleurVakje(x, z, type){
		// Achtergrondkleur haal je uit veldTypes
		ctx.fillStyle = veldTypes[type].kleur;
		ctx.beginPath();
		
		// Begin boven
		ctx.moveTo(
			opties.midden.x + x*opties.vakje.breedte/2 - z*opties.vakje.breedte/2, 
			opties.midden.y + x*opties.vakje.breedte/4 + z*opties.vakje.breedte/4 - opties.vakje.breedte/12*hoogteMap[z][x]
		);
		
		// Rechtse hoek
		ctx.lineTo(
			opties.midden.x + (x+1)*opties.vakje.breedte/2 - z*opties.vakje.breedte/2, 
			opties.midden.y + x*opties.vakje.breedte/4 + (z+1)*opties.vakje.breedte/4 - opties.vakje.breedte/12*hoogteMap[z][x+1]
		);
		
		// Onderste hoek
		ctx.lineTo(
			opties.midden.x + x*opties.vakje.breedte/2 - z*opties.vakje.breedte/2, 
			opties.midden.y + x*opties.vakje.breedte/4 + (z+2)*opties.vakje.breedte/4 - opties.vakje.breedte/12*hoogteMap[z+1][x+1]
		);
		
		// Linkse hoek
		ctx.lineTo(
			opties.midden.x + (x-1)*opties.vakje.breedte/2 - z*opties.vakje.breedte/2, 
			opties.midden.y + x*opties.vakje.breedte/4 + (z+1)*opties.vakje.breedte/4 - opties.vakje.breedte/12*hoogteMap[z+1][x]
		);
		
		ctx.fill();
		ctx.closePath();
	}
	
	function relatiefNaarCoordinaten(x, z){
		return {
			x: opties.midden.x + x*opties.vakje.breedte/2 - z*opties.vakje.breedte/2,
			z: opties.midden.y + x*opties.vakje.breedte/4 + (z+1)*opties.vakje.breedte/4 - 5*hoogteMap[z][x]
		};
	}
	
	/**
	 * Teken vlakken op het scherm
	 */
	function teken(){
		
		// Maak het scherm leeg
		ctx.clearRect(0, 0, opties.scherm.breedte, opties.scherm.hoogte);
		
		// Kleur grijze lijnen op de achtergrond
		ctx.strokeStyle = '#CCC';
		var i;
		for(i=0; i<opties.scherm.breedte*2/opties.vakje.breedte; i++){
			ctx.beginPath();  
			ctx.moveTo(i*opties.vakje.breedte-2*opties.scherm.hoogte-20,0);
			ctx.lineTo(i*opties.vakje.breedte-20, opties.scherm.hoogte);
			ctx.stroke();
			
			ctx.beginPath();  
			ctx.moveTo(i*opties.vakje.breedte,0);
			ctx.lineTo(i*opties.vakje.breedte-2*opties.scherm.hoogte, opties.scherm.hoogte);
			ctx.stroke();
		}
		
		var z, x;
		
		// Ondergrond
		for(z=0; z<veld.length; z++){
			for(x=0; x<veld[z].length; x++){
				kleurVakje(x, z, veld[z][x]);
			}
		}
	}
	
	function nieuwFrame(){
		if(!toetsenBord.spatie){
			// Kijk of er een toets ingedrukt is
			var veranderd = false;
			if(toetsenBord.links){ 
				veranderingDitFrame.x+=opties.vakje.breedte;
				veranderd = true;
			} else if(toetsenBord.rechts){ 
				veranderingDitFrame.x-=opties.vakje.breedte;

				veranderd = true;
			} else if(toetsenBord.onder){ 
				veranderingDitFrame.y-=opties.vakje.breedte/2;
				veranderd = true;
			} else if(toetsenBord.boven){ 
				veranderingDitFrame.y+=opties.vakje.breedte/2;
				veranderd = true;
			}
			
			
			opties.midden.x += veranderingDitFrame.x;
			opties.midden.y += veranderingDitFrame.y;
			
			if(veranderd){
				// Teken het veld opnieuw
				teken();
			}
			// Voor het volgende frame dit op nul zetten
			veranderingDitFrame.x = veranderingDitFrame.y = 0;
		}
	}	

	/**
	 * Initialiseer de klasse
	 * @param {Object} nieuw Een object met opties
	 */
	function init(nieuw){
		if(typeof nieuw != 'undefined'){
			wijzigOpties(nieuw, false);
		}
		
		// Verkrijg de context
		ctx = opties.canvas.getContext('2d');
		
		// Stel de Canvas-grootte in
		opties.canvas.style.width = opties.canvas.width = opties.scherm.breedte;
		opties.canvas.style.height = opties.canvas.height = opties.scherm.hoogte;
		
		// Van tevoren de achtergrond tekenen
		teken();
		
		// Teken op het scherm
		setInterval(nieuwFrame, 25);
		
		// Kijk of een bepaald knopje wordt ingedrukt
		document.onkeydown = function(e){
			if (!e) var e = window.event;
			if(veranderKnopjes(e.which||e.keyCode, true)){
				return false;
			}
		};
		
		document.onkeyup   = function(e){
			if (!e) var e = window.event;
			if(veranderKnopjes(e.which||e.keyCode, false)){
				return false;
			}
		};
		
	}
	
	return {
		init: init,
		krijgOptie: krijgOptie,
		wijzigOpties: wijzigOpties
	};
}();

window.onload = function(){
	DrieDimensies.init({
		canvas: document.getElementById('canvas'),
		scherm: {
			breedte: 980,
			hoogte: 500
		}
	});
	
	document.getElementById('form').onsubmit = function(){
		DrieDimensies.wijzigOpties({
			vakje: {breedte: DrieDimensies.krijgOptie('vakje').breedte==60 ? 150 : 60}
		}, true);
		return false;
	};
};