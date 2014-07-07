var BruggenBouwen = function(){
  var puzzel, cells = [], $overlay, $wrap;
  var mode = {geselecteerd: false, cell: null, buren: []};
  var afmetingen;
  var opties = {
    straal: 20,
    celgrootte: 40
  };
  
  function Cell(x,y){
    this.pos = {x: x, y:y};
    this.stad = false;
    this.weg = false;
    this.aantalBruggen = 0;
    this.capaciteit = 0;
    this.verbondenMet = [];
  }
  
  // Krijg de cel rechts van de huidige
  Cell.prototype.rechts = function(){
    if(this.pos.x + 1 < afmetingen.x) return cells[this.pos.y][this.pos.x+1];
    return false;
  };
  
  // Krijg de cel links van de huidige
  Cell.prototype.links = function(){
    if(this.pos.x - 1 >= 0) return cells[this.pos.y][this.pos.x-1];
    return false;
  };
  
  // Krijg de cel onder de huidige
  Cell.prototype.onder = function(){
    if(this.pos.y + 1 < afmetingen.y) return cells[this.pos.y+1][this.pos.x];
    return false;
  };
  
  // Krijg de cel boven van de huidige
  Cell.prototype.boven = function(){
    if(this.pos.y - 1 >= 0) return cells[this.pos.y-1][this.pos.x];
    return false;
  };
  
  // Kijk of twee cellen dezelfde zijn
  Cell.prototype.is = function(cell){
    return this.pos.x === cell.pos.x && this.pos.y === cell.pos.y;
  };
  
  // Kijk of twee steden al verbonden zijn
  Cell.prototype.isVerbondenMet = function(cell){
    for(var i=0; i<this.verbondenMet.length; i++){
      if(this.verbondenMet[i].cell.is(cell)) return this.verbondenMet[i];
    }
    return false;
  };
  
  Cell.prototype.opCapaciteit = function(){
    return this.aantalBruggen >= this.capaciteit;
  }
  
  Cell.prototype.nieuweBrug = function(cell, bruggen){
    var verbonden = this.isVerbondenMet(cell);
    
    if(verbonden){
      this.aantalBruggen+=bruggen-verbonden.aantal;
      verbonden.aantal = bruggen;
    } else {
      this.aantalBruggen+=bruggen;
      this.verbondenMet.push({aantal: bruggen, cell: cell});
    }
    
    if(this.aantalBruggen === this.capaciteit){
      this.element.addClass('vol');
    }
  };
  
  /**
   * Teken de puzzel op het canvas
   */
  function teken(){
    // hier begint de tekenmagie
    // padding + breedte van vakje * aantal vakjes
    var breedte = afmetingen.x*opties.celgrootte;
    var hoogte = afmetingen.y*opties.celgrootte;
    var startPositie = positieX = positieY = 0;
    
    $overlay.css({width: breedte, height: hoogte});
    $wrap.css({width: breedte, height: hoogte});

    // Teken alle vakjes
    for(var y=0; y<afmetingen.y; y++){
      cells[y] = [];
      for(var x=0; x<afmetingen.x; x++){
        // Maak een nieuwe cell
        cells[y][x] = new Cell(x, y);
        cells[y][x].cell = $('<div class="cell"></div>').offset({top: positieY, left: positieX}).appendTo($overlay).data({x:x, y:y});
        
        // Kijk of hier een stad is
        if(puzzel[y][x] > 0){
          cells[y][x].stad = true;
          cells[y][x].capaciteit = puzzel[y][x];
          cells[y][x].element = $('<div class="city"></div>').text(puzzel[y][x]).appendTo(cells[y][x].cell).data({x: x, y: y});
          cells[y][x].element.before('<div class="r"></div><div class="o"></div><div class="l"></div><div class="b"></div>');
        }

        // Schuif de x-positie op
        positieX += opties.celgrootte;
      }
      
      // Schuif de x- en y-positie op
      positieY += opties.celgrootte;
      positieX = startPositie;
    }
  }
  
  function krijgCellUitElement(el){
    return cells[parseInt(el.data('y'), 10)][parseInt(el.data('x'), 10)];
  }
  
  /**
   * Verander de opties
   */
  function veranderOpties(opt){
    
    // Ga elke optie bij na
    for(x in opt){
      if(opt.hasOwnProperty(x)){
        // Verander deze.
        opties[x] = opt[x];
      }
    }
  }
  
  /**
   * Geeft alle directe buren boven/onder/rechts/links van cell
   */
  function krijgMogelijkheden(cell){
    var buren = [], pointer;
    
    // boven
    for(pointer = cell.boven(); pointer; pointer = pointer.boven()){
      if(pointer.stad){
        if(kanVerbinden(cell, pointer)) buren.push(pointer);
        break;
      }
    }
    
    // onder
    for(pointer = cell.onder(); pointer; pointer = pointer.onder()){
      if(pointer.stad){
        if(kanVerbinden(cell, pointer)) buren.push(pointer);
        break;
      }
    }
    
    // links
    for(pointer = cell.links(); pointer; pointer = pointer.links()){
      if(pointer.stad){
        if(kanVerbinden(cell, pointer)) buren.push(pointer);
        break;
      }
    }
    
    // rechts
    for(pointer = cell.rechts(); pointer; pointer = pointer.rechts()){
      if(pointer.stad){
        if(kanVerbinden(cell, pointer)) buren.push(pointer);
        break;
      }
    }
    
    return buren;
  }
  
  /**
   * Kijkt of cell a en b directe buren zijn
   */
  function kanVerbinden(a, b){
    if(a.is(b)) return false;
    if(a.opCapaciteit() || b.opCapaciteit()) return false;
    var verbinding = a.isVerbondenMet(b);
    if(verbinding){
      if(verbinding.aantal === 2) return false;
      return true;
    }
    
    if(a.pos.x === b.pos.x){
      // Kijk tussen de beide cellen in
      for(var i=Math.min(a.pos.y,b.pos.y)+1; i<Math.max(a.pos.y,b.pos.y); i++){
        if(cells[i][a.pos.x].stad || cells[i][a.pos.x].weg) return false;
      }
      return true;
    } else if(a.pos.y === b.pos.y){
      // Kijk tussen de beide cellen in
      for(var i=Math.min(a.pos.x,b.pos.x)+1; i<Math.max(a.pos.x,b.pos.x); i++){
        if(cells[a.pos.y][i].stad || cells[a.pos.y][i].weg) return false;
      }
      return true;
    }
    
    return false;
  }
  
  /**
   * Bouwt een brug tussen twee dircte buren
   * (Zit geen controle op)
   */
  function verbind(a, b){
    var verbonden = a.isVerbondenMet(b), verbindingen = '';
    
    if(verbonden){
      verbindingen = 'dubbel';
      a.nieuweBrug(b, 2);
      b.nieuweBrug(a, 2);
    } else {
      a.nieuweBrug(b, 1);
      b.nieuweBrug(a, 1);
    }
    
    if(a.pos.x === b.pos.x){
      // Geef de steden een stukje brug mee
      var min = Math.min(a.pos.y,b.pos.y);
      var max = Math.max(a.pos.y,b.pos.y);
      cells[min][a.pos.x].cell.addClass('onder-brug ' + (verbindingen ? 'onder-' + verbindingen : ''));
      cells[max][a.pos.x].cell.addClass('boven-brug ' + (verbindingen ? 'boven-' + verbindingen : ''));
      
      // Kijk tussen de beide cellen in
      for(var i=min+1; i<max; i++){
        cells[i][a.pos.x].cell.addClass('v-brug ' + verbindingen);
        cells[i][a.pos.x].weg = true;
      }
      
    } else if(a.pos.y === b.pos.y){
      // Geef de steden een stukje brug mee
      var min = Math.min(a.pos.x,b.pos.x);
      var max = Math.max(a.pos.x,b.pos.x);
      cells[a.pos.y][min].cell.addClass('rechts-brug ' + (verbindingen ? 'rechts-' + verbindingen : ''));
      cells[a.pos.y][max].cell.addClass('links-brug ' + (verbindingen ? 'links-' + verbindingen : ''));
      // Kijk tussen de beide cellen in
      for(var i=min+1; i<max; i++){
        cells[a.pos.y][i].cell.addClass('h-brug ' + verbindingen);
        cells[a.pos.y][i].weg = true;
      }
    }
  }
  
  /**
   * Initializeer de bruggenbouwer
   */
  function init(puz, opt, overl, wrap){
    
    // 2D-array met puzzel
    puzzel = puz;
    
    afmetingen = {x: puz[0].length, y: puz.length};
    
    // Overlay is een DIV
    $overlay = overl;
    $wrap = wrap;
    
    // Verander de opties.
    veranderOpties(opt);
    
    // Als er op een stad wordt geklikt
    $overlay.delegate('.city', 'click', function(){
      var cell = krijgCellUitElement($(this));
      
      if(mode.geselecteerd){
        if(kanVerbinden(mode.cell, cell, true)){
          verbind(mode.cell, cell);
        }
        
        mode.cell.element.removeClass('selected');
        mode.geselecteerd = false;
        // Haal de kleurtjes weg van de buren
        for(var i=0; i<mode.buren.length; i++){
          mode.buren[i].element.removeClass('mogelijk');
        }
      } else if(cell.aantalBruggen < cell.capaciteit) {
        mode.cell = cell;
        mode.cell.element.addClass('selected');
        mode.geselecteerd = true;
        mode.buren = krijgMogelijkheden(cell);
        
        for(var i=0; i<mode.buren.length; i++){
          mode.buren[i].element.addClass('mogelijk');
        }
      }
      
    });
  }
  
  return {
    init: init,
    teken: teken,
    veranderOpties: veranderOpties
  }
}();

$(document).ready(function(){
  var opties = {
    straal: 20,
    lettertype: '20px Arial',
    celgrootte: 60,
  }
  var puzzel = [[2, 3, 0, 0, 1, 0, 4, 0, 2],
                [0, 0, 3, 3, 0, 3, 0, 0, 0],
                [3, 0, 0, 0, 0, 0, 0, 3, 3],
                [0, 0, 3, 0, 3, 0, 3, 3, 0],
                [3, 6, 0, 1, 0, 0, 0, 0, 0],
                [0, 0, 3, 0, 3, 0, 4, 0, 4],
                [2, 3, 0, 2, 0, 3, 0, 2, 0],
                [3, 0, 5, 0, 3, 0, 4, 3, 0]];
  BruggenBouwen.init(puzzel, opties, $('#overlay'), $('#canvas-wrap'));
  BruggenBouwen.teken();
});