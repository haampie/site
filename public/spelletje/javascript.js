var isometrie = function(){
	var ctxVeld, std, interval;
	
	// Wat globale opties
	var opties = {
		snelheid: 5,
		zwaartekracht: 1.4,
		sprongStart: -12.5,
		maximaleSprongSnelheid: 20
	};
	
	// Opties voor een vakje
	var vakje = {
		'breedte': 25,
		'hoogte': 25
	};
	
	// Opties voor het veld
	var veld = {
		'breedte': 800,
		'hoogte': 600
	};
	
	// Opties voor de held
	var held = {
		x: vakje.breedte,
		y: vakje.hoogte,
		kleur: '#A52A2A',
		hoogte: 20,
		breedte: 20,
		springend: false,
		springSnelheid: 0
	};
	
	// Kijk of bepaalde knoppen naar beneden zijn
	var toetsenBord = {
		links: false,
		rechts: false,
		onder: false,
		boven: false,
		spatie: false
	};
	
	// som van veldTypes is 1
	var veldTypes = [
		{
			'kleur': '#FFFAFA', 
			'kans': 0.7,
			'beloopbaar': true
		},
		{
			'kleur': '#B0C4DE',
			'kans': 0.2,
			'beloopbaar': false
		},
		{
			'kleur': '#778899',
			'kans': 0.1,
			'beloopbaar': false
		},
		{
			'kleur': '#F5FFFA',
			'kans': 0.0,
			'beloopbaar': true
		}
	];	
	
	// Er wordt een random veld geproduceerd, dus een standaard is even niet nodig
	var level;
	
	/** 
	 * Kijk of er bepaalde knopjes worden ingedrukt of losgelaten
	 * @param int welke Code van de toets op het toetsenbord
	 * @param bool manier True als die wordt ingedrukt, false als die wordt losgelaten
	 * @return bool True als een toets die in het spel gebruikt wordt werd ingedrukt
	 */
	function veranderKnopjes(welke, manier){
		switch (welke){
			case 65: case 37: toetsenBord.links = manier; return true;
			case 87: case 38: toetsenBord.spatie = manier; return true;
			case 68: case 39: toetsenBord.rechts = manier; return true;
			case 83: case 40: toetsenBord.onder = manier; return true;
			case 32:          toetsenBord.spatie = manier; return true;
		}
		return false;
	}
	
	function nieuwFrame(){
		
		// Kijk of iemand wil springen
		if(toetsenBord.spatie && !held.springend){
			held.springend = true;
			held.springSnelheid = opties.sprongStart;
		}
		
		// Kijk of pijltje naar links is ingedrukt
		if(toetsenBord.links){
			verplaatsHeld(-1, 0);
		}
		
		// Kijk of anders misschien het pijltje naar rechts is ingedrukt
		else if(toetsenBord.rechts){
			verplaatsHeld(1, 0);
		}
		
		if(held.springend){
			spring();
		}
	}
	
	function tekenVeld(){
		var y, x;
		
		for(y=0; y<level.length; y++){
			for(x=0; x<level[y].length; x++){
				ctxVeld.fillStyle = veldTypes[level[y][x]].kleur;
				ctxVeld.fillRect(x*vakje.breedte, y*vakje.hoogte, vakje.hoogte, vakje.breedte);
			}
		}		
	}
	
	function tekenHeld(){
		verplaatsHeld(0, 0);
	}
	
	function verplaatsHeld(rich_x, rich_y, sprong){
		
		var snelheid;
		
		// Kijk of je springt of niet en pas de snelheid daarop aan
		if (Math.abs(sprong) == 1) {
			snelheid = held.springSnelheid * sprong;
		}
		else {
			snelheid = opties.snelheid;
		}
		
		if(rich_x !== 0 || rich_y !== 0){
			
			// Doe alsof je richting Y neemt
			hoeken = krijgHoeken(rich_x, rich_y*snelheid);
			if (rich_y == -1) {
				if (hoeken.linksboven && hoeken.rechtsboven) {
					held.y += snelheid*rich_y;
				} else {
					held.y = hoeken.Yboven*vakje.hoogte+vakje.hoogte;
					held.springSnelheid = 0;
				}
			}
			
			if (rich_y == 1){
				if (hoeken.linksonder && hoeken.rechtsonder) {
					held.y += snelheid*rich_y;
				} else {
					held.y = hoeken.Yonder*vakje.hoogte-held.hoogte;
					held.springend = false;
				}
			}
			
			// Doe alsof je horizontaal gaat
			hoeken = krijgHoeken(rich_x*snelheid, rich_y);
			if (rich_x == -1) {
				if (hoeken.linksboven && hoeken.linksonder) {
					held.x += snelheid*rich_x;
					
					// Kijk of de Held misschien moet vallen
					val();
				} else {
					held.x = (hoeken.Xlinks+1)*vakje.breedte;
				}
			}
			
			if (rich_x == 1){
				if (hoeken.rechtsboven && hoeken.rechtsonder) {
					held.x += snelheid*rich_x;
					
					// Kijk of de Held misschien moet vallen
					val();
				} else {
					held.x = hoeken.Xrechts*vakje.breedte-held.breedte;
				}
			}
			
			leeg(ctxHeld);			
		}
	
		ctxHeld.fillStyle = held.kleur;
		ctxHeld.fillRect(held.x, 
		             held.y, 
					 held.breedte, 
					 held.hoogte);
	}
	
	function val(){
		if (!held.springend) {
			var hoeken = krijgHoeken(0, 1);
			if (!held.linksonder && !held.rechtsonder) {
				held.springSnelheid = 0;
				held.springend = true;
			}
		}
	}
	
	function spring(){
		held.springSnelheid += opties.zwaartekracht;
		
		if(held.springSnelheid > opties.maximaleSprongSnelheid){
			held.springSnelheid = opties.maximaleSprongSnelheid;
		}
		
		if (held.springSnelheid < 0) {
			verplaatsHeld(0, -1, -1);
		}
		else if (held.springSnelheid >= 0) {
			verplaatsHeld(0, 1, 1);
		}
	}
	
	function krijgRandomVeldType(){
		var rand = Math.random();
		var som = 0;
		for(i=0; i<veldTypes.length; i++){
			som += veldTypes[i].kans;
			if(rand <= som){
				return i;
			}
		}
	}
	
	function randomVeld(){
		var rVeld = [];
		
		var y, x, type;
		for(y=0; y<Math.floor(veld.hoogte/vakje.hoogte); y++){
			rVeld[y] = [];
			for(x=0; x<Math.floor(veld.breedte/vakje.breedte); x++){
				if(x===0 || y===0 || y+1==Math.floor(veld.hoogte/vakje.hoogte) || x+1==Math.floor(veld.breedte/vakje.breedte)){
					type = 2;
				} else {
					type = krijgRandomVeldType();
				}
				
				rVeld[y][x] = type;
				//counter[type]++;
			}
		}
		
		rVeld[1][1] = 0;
		
		return rVeld;
	}
	
	function krijgHoeken (x, y) {
		var hoek = {};
		
		
		hoek.Yboven   = Math.floor((held.y + y) / vakje.hoogte);
		hoek.Yonder   = Math.floor((held.y + held.hoogte + y - 1) / vakje.hoogte);
		hoek.Xlinks   = Math.floor((held.x + x) / vakje.breedte);
		hoek.Xrechts  = Math.floor((held.x + held.breedte + x - 1) / vakje.breedte);
		
		hoek.rechtsboven = veldTypes[level[hoek.Yboven][hoek.Xrechts]].beloopbaar;
		hoek.rechtsonder = veldTypes[level[hoek.Yonder][hoek.Xrechts]].beloopbaar;
		hoek.linksboven = veldTypes[level[hoek.Yboven][hoek.Xlinks]].beloopbaar;
		hoek.linksonder = veldTypes[level[hoek.Yonder][hoek.Xlinks]].beloopbaar;
		
		return hoek;
	}
	
	function leeg(ctx){
		ctx.clearRect(0, 0, veld.breedte, veld.hoogte);
	}
	
	function laad(instellingen){
		std = instellingen;
		ctxVeld = std.canvas.getContext('2d');
		ctxHeld = std.held.getContext('2d');
		
		level = randomVeld();
		
		tekenVeld();
		tekenHeld();
		val();
		
		interval = setInterval(nieuwFrame, 30);
		
		document.onkeydown = function(e){
			if(veranderKnopjes((e||window.event).keyCode, true)){
				return false;
			}
		};
		document.onkeyup   = function(e){
			if(veranderKnopjes((e||window.event).keyCode, false)){
				return false;
			}
		};
	}
	
	function vernietig(){
		clearInterval(interval);
		document.onkeydown = null;
		document.onkeyup = null;
	}
	
	return {
		laad: laad,
		vernietig: vernietig
	};
}();

function startNieuwSpel(){
	isometrie.laad({
		'canvas': document.getElementById('spelCanvas'),
		'held': document.getElementById('spelHeld')
	});
}

window.onload = function(){
	startNieuwSpel();
	
	document.getElementById('NieuwVeld').onclick=function(){
		isometrie.vernietig();
		startNieuwSpel();
		return false;
	};
};