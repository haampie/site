var Doolhof = function(){
	
	var opties = {
		breedte: 80,
		hoogte: 80,
    grootte: 10
	};
	var doolhof;
	var richtingenAlsTekst = {
		1: 'LINKS',
		2: 'RECHTS',
		3: 'ONDER',
		4: 'BOVEN',
	}

	Array.prototype.shuffle = function (){ 
		for(var rnd, tmp, i=this.length; i; rnd=parseInt(Math.random()*i), tmp=this[--i], this[i]=this[rnd], this[rnd]=tmp);
	};

	function tekenDoolhof(){
		var canvas = document.getElementById('result');
		canvas.height = canvas.style.height = opties.grootte*opties.hoogte;
		canvas.width = canvas.style.width = opties.grootte*opties.breedte;
		var ctx = canvas.getContext('2d');
		ctx.clearRect(0,0,canvas.width,canvas.height);
		
		for(y=0; y < opties.hoogte; y++){
			for(x=0; x < opties.breedte; x++){
				if((x == 0 && y == 1) || (x+1==opties.breedte && y+2 == opties.hoogte)){
					ctx.fillStyle = 'white';
				} else if(doolhof[y][x] == 1){
					ctx.fillStyle = 'black';
				} else {
					ctx.fillStyle = 'white';
				}
				ctx.fillRect(opties.grootte*x, opties.grootte*y, opties.grootte, opties.grootte);
			}
		}
	}

	function isMogelijk(x, y){
		
		// Je mag niet een open vakje maken op de randen van het doolhof
		if(x==0 || y==0 || x+1 == opties.breedte || y+1 == opties.hoogte) return false;
		
		
		// Kijk of vakje (x, y) twee open vakjes als buren heeft
		var som = parseInt(doolhof[y][x-1], 10) + parseInt(doolhof[y][x+1], 10) + parseInt(doolhof[y-1][x], 10) + parseInt(doolhof[y+1][x], 10);			
		if(som <= 2) return false;
		
		return true;
	}

	function maakDoolhof(xcoor, ycoor, diepte){

		doolhof[ycoor][xcoor] = 0;

		// Zet de richtingen in een Array en gooi ze door elkaar
		var richtingen = [1, 2, 3, 4];
		var i;
		
		richtingen.shuffle();
					
		for(i=0; i < richtingen.length; i++){
			switch(richtingen[i]) {
				case 1:
					if(isMogelijk(xcoor-1, ycoor)){
						diepte++;
						maakDoolhof(xcoor-1, ycoor, diepte);
						diepte--;
					}
				break;
				case 2:
					if(isMogelijk(xcoor+1, ycoor)){
						diepte++;
						maakDoolhof(xcoor+1, ycoor, diepte);
						diepte--;
					}					
				break;
				case 3:
					if(isMogelijk(xcoor, ycoor+1)){
						diepte++;
						maakDoolhof(xcoor, ycoor+1, diepte);
						diepte--;
					}					
				break;
				case 4:
					if(isMogelijk(xcoor, ycoor-1)){
						diepte++;
						maakDoolhof(xcoor, ycoor-1, diepte);
						diepte--;
					}					
				break;
			}
		}
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
				if(opties.hasOwnProperty(a)){
					opties[a] = nieuw[a];
				} else {
					throw "Optie " + a + " bestaat niet";
				}
			}
		}
	}

	function initDoolhof(nieuw){
		if(typeof nieuw != 'undefined'){
			wijzigOpties(nieuw);
		}
		doolhof = new Array(opties.hoogte);
		
		for(y=0; y < opties.hoogte; y++){
			doolhof[y] = new Array(opties.breedte);
			for(x=0; x < opties.breedte; x++){
				doolhof[y][x] = 1;
			}
		}
	}
	
	function krijgOptie(wut){
		return opties[wut];
	}
	
	return {
		initDoolhof: initDoolhof,
		maakDoolhof: maakDoolhof,
		tekenDoolhof: tekenDoolhof,
		krijgOptie: krijgOptie
	};
	
}();


window.onload = function(){
	Doolhof.initDoolhof();
	Doolhof.maakDoolhof(1, 1, 0);
	Doolhof.tekenDoolhof();
	
	var br = document.getElementById('breedte');
	var ho = document.getElementById('hoogte');
	var gr = document.getElementById('grootte');
	
	br.value = Doolhof.krijgOptie('breedte');
	ho.value = Doolhof.krijgOptie('hoogte');
	gr.value = Doolhof.krijgOptie('grootte');
	
	
	document.getElementById('form').onsubmit = function(){
		var tmpBreedte = parseInt(br.value, 10);
		var tmpHoogte = parseInt(ho.value, 10);
		var tmpGrootte = parseInt(gr.value, 10);
		if(!isNaN(tmpGrootte) && tmpGrootte > 0 && !isNaN(tmpBreedte) && !isNaN(tmpHoogte) && tmpBreedte > 2 && tmpHoogte > 2){
			Doolhof.initDoolhof({
				breedte: tmpBreedte,
				hoogte: tmpHoogte,
        grootte: tmpGrootte
			});
			Doolhof.maakDoolhof(1, 1, 0);
			Doolhof.tekenDoolhof();
		} else {
			alert('Ongeldige invoer');
		}
		return false;
	};
}