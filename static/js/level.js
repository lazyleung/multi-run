//Handle level generation

function Level(seed){
	this.terrain_data;
	this.level_data;
	this.ground = new Image();
	this.ground.src = "/images/ground.png";
	this.end = new Image();
	this.end.src = "/images/end.png";
	this.powerup = new Image();
	this.powerup.src = "/images/powerup.png";
	this.box = new Image();
	this.box.src = "/images/wooden_crate.png";
	this.coinArray = new Array();
	this.boxArray = new Array();
	this.animationFrame = 0;

	//assign terrain data
	this.make_level = function(levels) {
		levels.push(end);
		this.terrain_data = levels;
		this.level_data = new Array();
		for(var i = 0; i < levels.length; i++) {
			this.level_data[i] = levels[i][1][0];
		}
	}

	//Draw all the correct level terrain
	//Draws one section before and after in addition to current section
	this.draw = function(pos) {
		Math.floor(this.y/window.block_y);
		var i = Math.floor(pos/window.block_x/16) - 1;
		for(var count = 0;i < this.level_data.length && count < 3; count++){
			if (this.level_data[i] === "flat") {
				for(var j = 0; j < 16; j++){
					ctx.drawImage(this.ground, i*canvasWidth + j*window.block_x, canvasHeight - window.block_y, window.block_x, window.block_y);
				}
			}else if (this.level_data[i] === "flat_obstacle"){
				for(var j = 0; j < 16; j++){
					if(j === 9){
						ctx.drawImage(this.box, i*canvasWidth + j*window.block_x, canvasHeight - 3*window.block_y, 2*window.block_y, 2*window.block_y);
						if(this.coinArray[pos + j + i] === undefined){
							this.coinArray[pos + j + i] = new Coin(i*canvasWidth + j*window.block_x, canvasHeight-5*window.block_y, window.block_x, window.block_y);
						}
					}
					if(j === 10 && this.coinArray[pos + j + i] === undefined){
						this.coinArray[pos + j + i] = new Coin(i*canvasWidth + j*window.block_x, canvasHeight-5*window.block_y, window.block_x, window.block_y);
					}
					ctx.drawImage(this.ground, i*canvasWidth + j*window.block_x, canvasHeight - window.block_y, window.block_x, window.block_y);
				}
			}else if (this.level_data[i] === "flat_coin"){
				for(var j = 0; j < 16; j++){
					if((j === 3 || j === 11) && this.coinArray[pos + j + i] === undefined){
						this.coinArray[pos + j + i] = new Coin(i*canvasWidth + j*window.block_x, canvasHeight-2*window.block_y, window.block_x, window.block_y);
					}
					if((j === 7 || j === 15) && this.coinArray[pos + j + i] === undefined){
						this.coinArray[pos + j + i] = new Coin(i*canvasWidth + j*window.block_x, canvasHeight-5*window.block_y, window.block_x, window.block_y);
					}
					ctx.drawImage(this.ground, i*canvasWidth + j*window.block_x, canvasHeight - window.block_y, window.block_x, window.block_y);
				}
			}else if (this.level_data[i] === "platform_powerup"){
				//Need to modify
				for(var j = 0; j < 16; j++){
					//Draw platform
					if(j > 0 && j < 15){
						ctx.drawImage(this.ground, i*canvasWidth + j*window.block_x, canvasHeight - 4*window.block_y, window.block_x, window.block_y/4);
					}
					//Draw powerup box
					if(j === 5){
						ctx.drawImage(this.powerup, i*canvasWidth + j*window.block_x, canvasHeight - 6*window.block_y, 2*window.block_y, 2*window.block_y);
					}
					ctx.drawImage(this.ground, i*canvasWidth + j*window.block_x, canvasHeight - window.block_y, window.block_x, window.block_y);
				}
			}else if (this.level_data[i] === "platform_coin"){
				for(var j = 0; j < 16; j++){
					if(j > 0 && j < 15){
						ctx.drawImage(this.ground, i*canvasWidth + j*window.block_x, canvasHeight - 4*window.block_y, window.block_x, window.block_y/4);
						if (j % 3 === 0 && this.coinArray[pos + j + i] === undefined){
							this.coinArray[pos + j + i] = new Coin(i*canvasWidth + j*window.block_x, canvasHeight - 5*window.block_y, window.block_x, window.block_y);
						}
					}
					ctx.drawImage(this.ground, i*canvasWidth + j*window.block_x, canvasHeight - window.block_y, window.block_x, window.block_y);
				}
			}else if (this.level_data[i] === "end") {
				for(var j = 0; j < 22; j++){
					if(j === 8){
						ctx.drawImage(this.end, i*canvasWidth + j*window.block_x, canvasHeight - 5*window.block_y, 8*window.block_y/5, 4*window.block_y);
					}
					ctx.drawImage(this.ground, i*canvasWidth + j*window.block_x, canvasHeight - window.block_y, window.block_x, window.block_y);
				}
			}
			i++;
		}
		for(var c in this.coinArray){
			if(this.coinArray[c] !== undefined){
				this.coinArray[c].draw(this.animationFrame);
			}
		}
		this.animationFrame = (this.animationFrame + 1)%32;
	}

	//generate premade or radnom level
	switch(seed) {
		case 1:
			this.make_level([flat, flat, platform, flat, flat, flat_obstacle]);
			break;
		case 2:
			this.make_level([flat, flat, flat_obstacle, flat_coin, flat_coin, flat_coin, flat_coin, platform_coin, flat, flat, platform_powerup, flat, flat, platform_coin, flat, flat, platform_coin, flat]);
			break;
		default:
			
			//random level
	}
}

//Levels Data
//Each one contains the data in the first index, and allowable pieces to be placed next to it on the second index
// 1: flat terrain
// 2: obstacle
// 3: powerup
// 4: end
// 5: coin

var flat = new Array();
flat[0] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,];
flat[1] = ["flat"];

var flat_obstacle = new Array();
flat_obstacle[0] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0,
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,];
flat_obstacle[1] = ["flat_obstacle"];

var flat_powerup = new Array();
flat_powerup[0] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,];
flat_powerup[1] = ["flat_powerup"];

var flat_coin = new Array();
flat_coin[0] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 5,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0,
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,];
flat_coin[1] = ["flat_coin"];


var platform_coin = new Array();
platform_coin[0] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 5, 0, 0, 5, 0, 0, 5, 0, 0, 5, 0, 0, 0,
			0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,];
platform_coin[1] = ["platform_coin"];		

var platform = new Array();
platform[0] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,];
platform[1] = ["platform"];

var platform_powerup = new Array();
platform_powerup[0] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,];
platform_powerup[1] = ["platform_powerup"];

var platform_coin = new Array();
platform_coin[0] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 5, 0, 0, 5, 0, 0, 5, 0, 0, 5, 0, 0, 0,
			0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,];
platform_coin[1] = ["platform_coin"];

var end = new Array();
end[0] = [0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4,
			0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4,
			0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4,
			0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4,
			0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4,
			0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4,
			0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4,
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,];
end[1] = ["end"];