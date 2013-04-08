//Levels Data
//Each one contains the data in the first index, and allowable pieces to be placed next to it on the second index


//Joins together pieces and returns an array of all the completed pieces. 
function check_level(levels){

	//Check if the pieces can fit together, raise error 
	for (var i = 0, i < levels.length, i++){
		if levels[i+1].indexOf(levels[i]) === -1;{
		 	console.log("Error in Level Design")
		 	return false;
		}
	return true;
	}  
}

function create_level(levels){
	var piece_size = 4;
	var level_array;
	var level_0 = new Array();
	var level_1 = new Array();
	var level_2 = new Array();
	var level_3 = new Array();
	var level_4 = new Array();
	var level_5 = new Array();
	var level_6 = new Array();
	var level_7 = new Array();
	if check_level(levels){
		for (var i = 0, i < levels.length, i++){
			level_0.push(levels[i][1].splice(0, piece_size));
			level_1.push(levels[i][1].splice(4, piece_size+4));
			level_2.push(levels[i][1].splice(8, piece_size+8));
			level_3.push(levels[i][1].splice(12, piece_size+12));
			level_4.push(levels[i][1].splice(16, piece_size+16));
			level_5.push(levels[i][1].splice(20, piece_size+20));
			level_6.push(levels[i][1].splice(24, piece_size+24));
			level_7.push(levels[i][1].splice(28, piece_size+28));
		}
		level_array = concat(level_0, level_1, level_2, level_3, level_4, level_5, level_6, level_7);
		return level_array;
	}

	console.log("Error in creating level");
}

var flat = [[0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			1, 1, 1, 1, 
			1, 1, 1, 1,]["ramp_up", "ramp_flat", "ramp_down", "hole", "underpass", "platform", "step_up", "jump"]];

var ramp_up = [[0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 1,
			0, 0, 1, 1,
			0, 1, 1, 1,
			1, 1, 1, 1, 
			1, 1, 1, 1,]["flat", "hole", "underpass", "platform", "step_up", "step_down", "step_platform" ]];

var ramp_flat = [0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			1, 1, 1, 1,
			1, 1, 1, 1,
			1, 1, 1, 1,
			1, 1, 1, 1, 
			1, 1, 1, 1,];

var ramp_hole = [0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 1, 1, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0, 
			0, 0, 0, 0,];

var ramp_down = [0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			1, 0, 0, 0,
			1, 1, 0, 0,
			1, 1, 1, 0,
			1, 1, 1, 1, 
			1, 1, 1, 1,];

var hole = [0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			1, 0, 0, 1, 
			1, 0, 0, 1,];


var underpass = [0, 0, 0, 0,
				 0, 0, 0, 0,
				 0, 0, 0, 0,
				 1, 1, 1, 1,
				 1, 1, 1, 1,
				 0, 0, 0, 0,
				 1, 1, 1, 1, 
				 1, 1, 1, 1,];


var platform = [0, 0, 0, 0,
				0, 0, 0, 0,
				0, 0, 0, 0,
				0, 0, 0, 0,
				1, 1, 1, 1,
				0, 0, 0, 0,
				1, 1, 1, 1, 
				1, 1, 1, 1,];

var step_up =  [0, 0, 0, 0,
				0, 0, 0, 0,
				0, 0, 0, 0,
				0, 0, 1, 1,
				1, 1, 0, 0,
				0, 0, 0, 0,
				0, 0, 0, 0, 
				0, 0, 0, 0,];

var step_down = [0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			1, 1, 0, 0,
			0, 0, 1, 1,
			0, 0, 0, 0,
			0, 0, 0, 0, 
			0, 0, 0, 0,];



var step_platform = [0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			1, 1, 1, 1,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0, 
			0, 0, 0, 0,];



var jump = [0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 1, 1, 0,
			1, 1, 1, 1, 
			1, 1, 1, 1,];