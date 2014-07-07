var Tekenaar = function(){
	var ctx;
	var opties = {
		breedte: 978,
		hoogte: 600,
		canvas: null,
		geheugen: 50
	};
	
	/**
	 * Hierin staat de diagonale lengte van het scherm, zodat je de 
	 * doorzichtigheidswaarde kunt berekenen van een lijntje dat getekend wordt
	 */
	var diagonaal;
	
	var beneden = {
		lmb: false
	};
	
	var prev = [];
	
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
	function wijzigOpties(nieuw){
		if(typeof nieuw != 'object'){
			throw "Verkeerd type voor opties gestuurd: " + typeof(nieuw);
		}
		
		// Bekijk elke nieuwe optie
		for(var a in nieuw){
			if(nieuw.hasOwnProperty(a)){
				
				// Kijk of die optie bestaat
				if(opties[a] != 'undefined'){
					// Stel de nieuwe optie in
					opties[a] = nieuw[a];
				} else {
					throw "Optie " + a + " bestaat niet";
				}
			}
		}
		
		// Bereken de diagonaal
		diagonaal = Math.floor(Math.sqrt(opties.breedte*opties.breedte+opties.hoogte*opties.hoogte));
		
		// Verander de grootte
		opties.canvas.width = opties.canvas.style.width = opties.breedte;
		opties.canvas.height = opties.canvas.style.height = opties.hoogte;
	}
	
	function wijzigKnoppen(welke, manier){
		if(typeof beneden[welke] != 'undefined'){
			beneden[welke] = manier;
			return true;
		}
		return false;
	}
	
	function teken(e){
		
		// Check waar in de <canvas> werd geklikt
		var offsetX = 0;
		var offsetY = 0;
		
		// Chrome en Firefox
		if (e.pageX || e.pageY){
			offsetX = e.pageX;
			offsetY = e.pageY;
		}
		
		// Internet Explorer
		else if (e.clientX || e.clientY) 	{
			offsetX = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
			offsetY = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
		}
		
		// Krijg muispositie relatief aan het canvas
		offsetX -= opties.canvas.offsetLeft;
		offsetY -= opties.canvas.offsetTop;
		
		// Stop de huidige positie achteraan in de positieonthoudarray
		prev.push([offsetX, offsetY]);
		
		// Kijk of er al genoeg posities zijn onthouden
		if(prev.length > opties.geheugen){
			
			// Haal de vorige positie op en doe die uit de array
			var vorigePositie = prev.shift();
			
			// Teken vanaf het punt waar de muis nu is
			var punt1 = {
				x: prev[prev.length-1][0],
				y: prev[prev.length-1][1]
			}, /* Naar waar hij eerst was: */ punt2 = {
				x: vorigePositie[0],
				y: vorigePositie[1]			
			};
			
			// Bereken de afstand
			var afstand = Math.floor(Math.sqrt(
				Math.pow(punt1.x-punt2.x, 2) +
				Math.pow(punt1.y-punt2.y, 2)
			));
			
			// Bereken de alphawaarde (grotere afstand = lagere alpha)
			var alpha = 1-afstand/diagonaal;
			
			ctx.lineWidth = 1;
			ctx.lineCap = 'round';
			
			// Bereken een random kleur tussen rgb(100, 100, 100) en rgb(200, 200, 200)
			ctx.strokeStyle = 'rgba(' +  Math.floor(Math.random()*100+100) + ', ' + 
										Math.floor(Math.random()*100+100) + ', ' + 
										Math.floor(Math.random()*100+100) + ', ' +
										alpha + ')';
			// Teken de lijn
			ctx.beginPath();
			ctx.moveTo(punt1.x, punt1.y);
			ctx.lineTo(punt2.x, punt2.y);
			ctx.stroke();
		}
	}

	/**
	 * Initialiseer de klasse
	 * @param {Object} nieuw Een object met opties
	 */
	function init(nieuw){
		if(typeof nieuw != 'undefined'){
			wijzigOpties(nieuw);
		}
		
		ctx = opties.canvas.getContext('2d');
		
		opties.canvas.onmousedown = function(e){
			if(wijzigKnoppen('lmb', true)){
				return false;
			}
		};
		
		document.onmouseup = function(e){
			if(wijzigKnoppen('lmb', false)){
				prev = [];
				return false;
			}
		};
		
		opties.canvas.onmousemove = function(e){
			if(beneden.lmb){
				teken(e||window.event);
			}
		};
	}
	
	function krijgOptie(wut){
		return opties[wut];
	}
	
	return {
		init: init,
		wijzigOpties: wijzigOpties,
		krijgOptie: krijgOptie
	};
}();

window.onload = function(){
	var geheugen = document.getElementById('geheugen');

	Tekenaar.init({
		canvas: document.getElementById('canvas')
	});
	
	geheugen.value = Tekenaar.krijgOptie('geheugen');
	
	document.getElementById('form').onsubmit = function(){
		var tmpGeheugen = parseInt(geheugen.value, 10);
		if(tmpGeheugen > 0){
			Tekenaar.wijzigOpties({
				geheugen: tmpGeheugen
			})
		} else {
			alert('Geen goede waarden ingevuld');
		}
		return false;
	};
};