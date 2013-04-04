//Dynamicly allocate canvas & draw
//TODO add handlers for input

var canvasWidth;
var canvasHeight;

$(document).ready(function(){
	$("body").html("Loaded!");

	canvasWidth = $(window).width();
	canvasHeight = $(window).height();

	var c = $("<canvas>").attr({id:"myCanvas",width:canvasWidth,height:canvasHeight}).html("Cannot Load!");

	$("body").html(c);

	window.canvas = document.getElementById("myCanvas");
	window.ctx = canvas.getContext("2d");

	draw();
});