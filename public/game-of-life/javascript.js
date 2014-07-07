var $table         = null,
	$generaties    = null,
	generationNo   = 0,
    busy           = false,
    delay          = 50,
    coords         = [],
    mapactual      = [],
    tempmapactual  = [],
	levelNumber    = 1,
	levelStyles    = [],
	width          = 50,
	height         = 50;

function setLevelNumber(val){
	var val = parseInt(val, 10);
	console.log(val);
	if(!isNaN(val) && val>0){
		levelNumber = val;
	}
}

function initGame(){
	coords = [-width-1, -width, -width+1, -1, 1, width-1, width, width+1];
	levelStyles = [];
	var gap = 255/levelNumber;
	
	for(var i=0; i<=levelNumber; i++){
		levelStyles[i] = 'rgb(' + i*gap + ', ' + i*gap + ', ' + i*gap + ')';
    //levelStyles[i] = (i==levelNumber ? '#FFF' : '#000');
	}
}

function init(){
	$table = $('#conwaysgameoflife');
	$generaties = $('#generaties');
	
	initGame();
	
	// create new rows with cells
	for(var j=0; j<height; ++j) {
		var row = $('<tr>');
		for(var i=0; i<width; ++i){
			row.append($('<td style="background-color:' + levelStyles[0] + '" />'));
			mapactual[j*width+i] = 0;
		}
		
		$table.append(row);
	}
	

	$table.delegate('td', 'click', function(e){
		if(!busy) {
			var posX = $(this).index();
			var posY = $(this).parent().index();
			var nieuw = mapactual[posY*width+posX] == 0;
			mapactual[posY*width+posX] = (nieuw ? levelNumber : 0);
			$(this).css('backgroundColor', (nieuw ? levelStyles[levelNumber] : levelStyles[0]));
		}
	});

	$('#startbutton').click(function(){
		if(!busy){
			$(this).addClass('active').find('.info').text('Stop');
			setLevelNumber($('#levensniveaus').val());
			delay = $('#snelheid').val() || delay;
			busy = true;
			
			initGame();
			run();
		} else {
			$(this).removeClass('active').find('.info').text('Start');
			busy = false;
			stop(false);
		}
		return false;
	});
	
	$('#clearbutton').click(function(){
		if(!busy){
			clear();
		}
		return false;
	});
}

function generation(){
	var neighbours=0;
	
	generationNo++;
	$generaties.text(generationNo);
	
	for(var i=0; i<width*height; i++){ 
		tempmapactual[i]=mapactual[i];
	}
	
	for (var g=0; g<width*height; g++){
		neighbours=0;
		for (h=0;h<8;h++){
			if (g+coords[h]>0 && g+coords[h]<width*height-1) {
				if (mapactual[g+coords[h]]>0) {
					neighbours += mapactual[g+coords[h]];
				}
			} else if (g+coords[h]<1) {
				if (mapactual[width*height+g+coords[h]]>0) {
					neighbours += mapactual[width*height+g+coords[h]];
				}
			} else if (g+coords[h]>width*height-2) {
				if (mapactual[g+coords[h]-width*height]>0) {
					neighbours += mapactual[g+coords[h]-width*height];
				}
			}
		}

		if (neighbours >= 4*levelNumber || neighbours < 2*levelNumber) {
			tempmapactual[g]--;
		} else if (neighbours >= 3*levelNumber && neighbours < 4*levelNumber) {
			tempmapactual[g]++;
		}
		
		if(tempmapactual[g] < 0) tempmapactual[g]=0;
		else if(tempmapactual[g] > levelNumber) tempmapactual[g]=levelNumber;
	}

	for(var y3=0; y3<width*height; ++y3) {
		if (mapactual[y3] !== tempmapactual[y3]){
			mapactual[y3] = tempmapactual[y3];
			$table[0].childNodes[Math.floor(y3/width)].childNodes[y3%width].style.backgroundColor = levelStyles[mapactual[y3]];
		}
	}
}

function clear(){
	for(var x=0; x<width*height; x++){
		mapactual[x] = 0;
		$table[0].childNodes[Math.floor(x/width)].childNodes[x%width].style.backgroundColor = levelStyles[0];
	}
	generationNo = 0;
	$generaties.text(0);
}


function run(){
	if(busy){
		setTimeout(run, delay);  
		generation();
	}
}

function stop(wannaClear) {
	
	busy=false;
}