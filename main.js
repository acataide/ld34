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
      $(item).attr("id","slot:"+row+":"+col);
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
  if (moment=="player") {
    endTurn();
  }
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
      $(item).text(parseInt($(item).text())+1);
    })
  }

  $(".stem_cell").each(function(index, item){
     var is_hard = $(item).parent().find(".VH_tissue").length;
     if (is_hard) {
       $(item).text(parseInt($(item).text())+1);
     }
  })
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
