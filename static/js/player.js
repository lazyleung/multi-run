function Player(playerX, playerY) {
	this.x = playerX;
	this.y = playerY;
	this.lastX = playerX;
	this.targetDisplacement = 0;
	this.airFriction = 0;
	this.gravity = 1.2;
	this.width = window.block_y/5 * 6;
	this.height = window.block_y * 2;
	this.speed = {x : 0, y : 0};
	this.image = new Image();
	this.xOffset = 2*window.block_x;
	this.jumpTimeLeft = 0;
	this.floor = canvasHeight - window.block_y;
	this.xSpeedLimit = 25;
	this.animationFrame = 0;
	this.image.src = "/images/dinosaur_animation.png";

	this.init = function() {

		console.log("floor:" + this.floor);
		// Setup touch handler
		$('body').hammer().on("swipeup", function(event) {
			event.gesture.preventDefault();
		    console.log(this, event);
		    if (Math.abs(event.gesture.deltaY) <= 100) {
		    	console.log("low jump");
		    	lowJump();
		    }
		    else {
		    	console.log("high jump");
		    	highJump();
		    }
		});
		$('body').hammer().on("swipedown", function(event) {
			event.gesture.preventDefault();
		    console.log("swipedown");
		});
		$('body').hammer().on("swipeleft", function(event) {
			event.gesture.preventDefault();
		    console.log("swipeleft");
		});
	}
	this.onFloor = function() {
		if (this.y < this.floor)
			return false;
		else
			return true;
	}

	this.draw = function() {
		ctx.drawImage(this.image, ( 247 * Math.ceil(this.animationFrame)), 0, 247, 475, this.x, this.y - this.height, this.width, this.height);
	}

	var lowJump = function() {
		if (this.onFloor() == true) {
			this.jumpTimeLeft = 100;
		}
	}.bind(this);

	var highJump = function() {
		if (this.onFloor() == true) {
			this.jumpTimeLeft = 130;
		}
	}.bind(this);

	var slowDown = function() {

	}.bind(this);

	this.update = function(terrain) {

		// advance the animation frame
		if (this.speed.x == 0 || !this.onFloor())
			this.animationFrame = 0;
		this.animationFrame = (this.animationFrame + (this.speed.x / 40)) % 5;
		
		progress = Math.floor((this.x + this.width)/window.block_x);

		var y_block = Math.ceil(this.y/window.block_y);

		//Deals with changing floor height
		this.floor = canvasHeight;

		for(var i = y_block; i < 8; i++){
			if(terrain[Math.floor(progress/16)][0][progress - (Math.floor(progress/16) * 16) + (i * 16)] === 1){
				this.floor = canvasHeight - (8 - i)*window.block_y;
				break;
			}
		}

		var player_block_y = Math.floor(this.y/window.block_y);

		//Check if end
		if(terrain[Math.floor(progress/16)][0][progress - (Math.floor(progress/16) * 16) + ((8-player_block_y) * 16)] === 4){
			//end game
			console.log("end");
			endGame();
		}
		
		//Slowly increase player speed
		// Limit horizontal speed
		if (this.speed.x < this.xSpeedLimit) {
			this.speed.x += .3;
		}
		
		//  handle jumping
		if (this.jumpTimeLeft > 0) {
			this.speed.y -= 5;
			this.jumpTimeLeft -= 25;
		}
		this.y += this.speed.y;
		this.x += this.speed.x;

		// add offset to move canvas
		this.xOffset += this.speed.x;

		if (this.onFloor())
			this.speed.y = 0;
		else if (this.y + this.speed.y > this.floor) // make sure it doesnt go past floor
			this.speed.y = this.floor - this.y;
		else if (!this.onFloor()) // whenever in air, add gravity
			this.speed.y += this.gravity;
	}
	this.init();
}