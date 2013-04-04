 $(document).ready(function(){
 	document.getElementById('play_button').addEventListener('touchstart', function(event) {
  		window.open("game.html","_self");
	}, false);

 	$("#play_button").click(function () {
 		window.open("game.html","_self");
 	});

 });