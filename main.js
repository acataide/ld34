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
  
  $(".slot").each(function (index, item){
    var row = $(item).attr('row');
    var col = $(item).attr('col');

    dist = fromCenter(row,col);
    $(item).text(dist);
    if (dist > 3) {$(item).addClass("hidden")};
    
  });
})

function fromCenter(row, col) {
    var x = col - (row - (row&1)) / 2 ;
    var z = row ;
    var y = -x-z ;
    
    var dist = (Math.abs(x) + Math.abs(y) + Math.abs(z)) / 2;
    
    return dist;
}
