$(document).ready(function() {

//Variables to manage the mouse and pointer go here
  var $mouseX = 0;
  var $mouseY = 0;
  var xp = 0
  var yp = 0;
  var interval = 20;
  var steps = 8;
  var $height = $(".square").height();
  var $width = $(".square").width();
  var $screenHeight = $(window).height();
  var $screenWidth = $(window).width();

  var cap = 5;
  var max = 50;
  var tolerance = 50;
  var grow = false;

  var score = 0;

//Actual function to track the mouse's position + debugger
  $(document).on( "mousemove", function(event) {
    $mouseX = event.pageX;
    $mouseY = event.pageY;
  });


  $(document).keydown(function() {
    grow = !grow;
    $(".square").css({"height" : "50px", "width" : "50px" })
  })


//The loop that causes the function to do things
  var followCursor = setInterval(function() {
    xp += ( (($mouseX - xp) / steps)-($width / (2*steps)) );
    yp += ( (($mouseY - yp) / steps)-($height / (2*steps)) );
    $(".square").css({left:xp, top:yp});
  }, interval);



//The function that randomly generates a dot
  function makeDot() {
    var $dot = $("<div>", {"class": "dot"}, );
    var randX = ((Math.random() * ($screenWidth - 200)) + 100);
    var randY = ((Math.random() * ($screenHeight - 200)) + 100);
    $dot.css({left:randX, top:randY});
    $(".field").append($dot);
  }



//The loop that makes the dots
  function createLoop() {
    var rand = Math.round(Math.random() * (700)) + 500;
    setTimeout(function() {
      if ($(".dot").length < cap) {
        makeDot();
      }
      createLoop();
    }, rand);
  };



//The auxiliary function for random dot generation
  var create = setTimeout(function() {
    createLoop();
  }, interval);



//The function that checks for collision
  function dotLogger() {
    for(var i = 0; i < $(".dot").length; i++) {
      var leftCheck = Math.abs((parseInt($(".square").css("left"))) - parseInt($(".dot")[i].style.left) + 50);
      var topCheck = Math.abs((parseInt($(".square").css("top"))) - parseInt($(".dot")[i].style.top) + 50);
      if ((leftCheck <= 30) && (topCheck <= 50)) {
        $(".dot")[i].parentNode.removeChild($(".dot")[i]);
        score++;
        $(".points").text(score);
        if(grow){
        $(".square").css({"height" : ($(".square").height()*1.05), "width" : ($(".square").width()*1.05) })
      }}}
  }



//The looping function that runs the collision check
  var collisionLoop = setInterval(function() {
    dotLogger();
  }, (interval/4) );



//Asynchronus function for waiting
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }



//Function that allows for random movement
  async function randomDotMove() {
    for(var i = 0; i < $(".dot").length; i++) {
      var counter = 0;
      var rand1 = (Math.round(Math.random() * 2) - 1);
      var rand2 = (Math.round(Math.random() * 2) - 1);
      while(counter < 20) {
          $(".dot")[i].style.left = (String(rand1 + parseInt($(".dot")[i].style.left)) + "px");
          $(".dot")[i].style.top = (String(rand2 + parseInt($(".dot")[i].style.top)) + "px");
          await sleep(interval);
          counter += 1;
      }
    }
  }



//Actual function that runs the dots' motion
  var dotMove = setInterval(function() {
    randomDotMove();
  }, 200);



//Randomly alter the cap value on max number of dots
  var changeCap = setInterval(function() {
    unif = Math.random();
    beta = Math.pow(Math.sin(unif*Math.PI/2),2);
    //A distribution skewed to the left(aka 0).
    beta_left = (beta < 0.5) ? 2*beta : 2*(1-beta);
    cap = (beta_left * max);
  }, 3000);



//Makes sure dots don't leave the window by rerouting them if they pass the 50px border
  var dotCheck = setInterval(function() {

    for(var i = 0; i < $(".dot").length; i++) {
      dotTop = parseInt($(".dot")[i].style.top);
      dotLeft = parseInt($(".dot")[i].style.left);
      diffTop = ($screenHeight - dotTop);
      diffLeft = ($screenWidth - dotLeft);

      if (diffLeft < tolerance) {
        $(".dot")[i].style.left = (String(parseInt($(".dot")[i].style.left) - 50) + "px");
      }

      if (diffLeft > ($screenWidth - tolerance)) {
        $(".dot")[i].style.left = (String(parseInt($(".dot")[i].style.left) + 50) + "px");
      }

      if (diffTop < tolerance) {
        $(".dot")[i].style.top = (String(parseInt($(".dot")[i].style.top) -  50) + "px");
      }

      if (diffTop > ($screenHeight - tolerance)) {
        $(".dot")[i].style.top = (String(parseInt($(".dot")[i].style.top) + 50) + "px");
      }
    }
  }, interval);




  });
