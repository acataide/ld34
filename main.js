$(function(){

  //Init board div elements
  for (var row=-3; row <= 3; row++) {
    for (var col=-3; col <= 3; col++){
      if (row % 2) {
        var c = "slot";
      } else {
        var c = "slot odd";
      }
      $("#board").append("<div class='"+c+"' row='"+row+"' col='"+col+"'></div>");
    }
  }
  
  //Init board contents
  $(".slot").each(function (index, item){
    var row = $(item).attr('row');
    var col = $(item).attr('col');

    dist = fromCenter(row,col);
    if (dist > 3) {
      // Hide hexagons further from the center
      $(item).addClass("hidden");
    } else {
      // Give visible hexagons unique id
      $(item).attr("id","slot_"+row+"_"+col);
      $(item).addClass("show");
      $(item).on("click", boardClick);
    } 
  });

  //Initialize Areas
  $(".show").each(function (index,item){
    var tissues = ["VH_tissue","S_tissue","H_tissue"];
    var tissue = tissues[Math.round(Math.random()*2)];  
    
    $(item).append("<div class='tissue "+tissue+"'></div>");
    $(item).append("<div class='cell'></div>");
  })
  
  //Setup Turn Button
  $("#turn").on("click", turnClick);
  
  // Set moment to first
  moment = "first";
  updateMsg("first");
  
})

// Treats click on the board
function boardClick (e) {
  if (moment == "first") {
    var c = $(this).find(".cell")
    c.attr("class", "cell stem_cell");
    c.text("0");
    moment = "player";
    updateMsg("first_01");
  }
  
}

function turnClick (e) {
  endTurn();
}

//End player turn
function endTurn() {
    
  //GROW CANCER !!!!!!
  //First malignant cell
  if ($(".cancer").length == 0) {
    var item = Math.round(Math.random() * $(".S_tissue").length);
    var elem = $($(".S_tissue")[item])
    elem.attr("class","tissue cancer");
    elem.text("0");
  } else {
    //keep growing
    $(".cancer").each(function(index, item){
      var ATP = parseInt($(item).text()); 
      $(item).text(ATP + 1);
      //Big enough, will reproduce 
      if (ATP >= 3) {
        var src = getHex(item);
        var dest = src.randNeighbor();
        
        //No Cell Present
        if (getItem(dest).find(".cell").text() == 0) {
          var dest_t = getItem(dest)
                       .find(".tissue")
                       .attr("class")
                       .replace("tissue ","");

          //Soft Tissue 
          if (dest_t == "S_tissue" || dest_t == "H_tissue1" || dest_t == "VH_tissue2") {
            divideCell(src, dest);
          };
          //Hard Tissue 
          if (dest_t == "H_tissue") {
            getItem(dest).find(".tissue").attr("class","tissue H_tissue1");
          }
          //Very Hard Tissue
          if (dest_t == "VH_tissue") {
            getItem(dest).find(".tissue").attr("class","tissue VH_tissue1");
          }
          if (dest_t == "VH_tissue1") {
            getItem(dest).find(".tissue").attr("class","tissue VH_tissue2");
          }
        } else {
      //Cell Present
          var dest_cell = getItem(dest).find(".cell");
          var dest_ATP = parseInt(dest_cell.text());
          
          var atk = dest_ATP - Math.floor(ATP/2);
          if (atk > 0 ) {
            dest_cell.text(atk);
          } else {
            dest_cell.text("");
            dest_cell.attr("class","cell");
          }
        } 
      }
    })
  }  

  $(".stem_cell").each(function(index, item){
     var is_hard = $(item).parent().find(".VH_tissue").length;
     if (is_hard) {
       $(item).text(parseInt($(item).text())+2);
     } else {
       $(item).text(parseInt($(item).text())+1);
     }
  })
}


//Cell Mitosis
function divideCell(src, des) {
  var src_e = $("#slot_"+src.row+"_"+src.col);
  var src_t = src_e.find(".tissue");
  var ATP = Math.floor(parseInt(src_t.text()) / 2);
  
  var des_e = $("#slot_"+des.row+"_"+des.col);
  var des_t = des_e.find(".tissue");
  
  src_t.text(ATP);
  des_t.text(ATP);
  des_t.attr("class", "tissue cancer");
}

//Get Hex from Element
function getHex(item) {
  var src = new Hex(parseInt($(item).parent().attr('row')),
                    parseInt($(item).parent().attr('col')));
  return src;
}
//Get Element from Hex
function getItem(hex) {
  var item = $("#slot_"+hex.row+"_"+hex.col);
  return item;
}



// Updates Help Message
function updateMsg(id) {
  $("#inst").html($("#messages #"+id).html());
};

// Return hexagon distance from center
function fromCenter(row, col) {
  var x = col - (row - (row&1)) / 2 ;
  var z = row ;
  var y = -x-z ;
  
  var dist = (Math.abs(x) + Math.abs(y) + Math.abs(z)) / 2;
  
  return dist;
}


//Debug Stuff
function hilite(hex){
  $("#slot_"+hex.row+"_"+hex.col).addClass("hilite");
}

function hiliteN(hex){
  var n = hex.neighbors();
  for (a in n) {
    var item = $
  }
}
