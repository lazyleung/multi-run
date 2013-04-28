function Player(playerX, playerY) {
	this.x = playerX;
	this.y = playerY;
	this.lastX = playerX;
	this.targetDisplacement = 0;
	this.airFriction = 0;
	this.gravity = 1.2;
	this.width = window.block_y/5 * 6;
	this.height = window.block_y * 2;
	this.speed = {x : 5, y : 0};
	this.image = new Image();
	this.xOffset = 2*window.block_x;
	this.jumpTimeLeft = 0;
	this.floor = canvasHeight - window.block_y;
	this.xSpeedBase = 5;
	this.xSpeedLimit = 25;
	this.animationFrame = 0;
	this.image.src = "/images/dinosaur_animation.png";
	this.race_progress = 0;
	this.end = new Image();
	this.end.src = "/images/end.png";

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
		// Draws player progress on minimap
		ctx.drawImage(this.end, (canvasWidth*.75+ this.xOffset), (canvasHeight*.1), 247/8, 475/8);
		this.drawProgression();

	}

	this.drawProgression = function() {
		ctx.drawImage(this.image, 0, 0, 247, 475,  (this.race_progress * canvasWidth * .8) + this.xOffset - canvasWidth/15 , canvasHeight * .1, 247/8, 475/8);
	}.bind(this)

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

	this.checkFloor = function(y, terrain){
		for(var i = y; i < 8; i++){
			if(terrain[Math.floor(progress/16)][0][progress - (Math.floor(progress/16) * 16) + (i * 16)] === 1){
				this.floor = canvasHeight - (8 - i)*window.block_y;
				break;
			}
		}
	}

	this.checkAhead = function(y, terrain){
		var ahead = terrain[Math.floor(progress/16)][0][progress - (Math.floor(progress/16) * 16) + ((y-1) * 16)];
		if(ahead === 2){
			console.log("hit!");
			this.speed.x = this.xSpeedBase;
		}else if(ahead === 4){
			//end game
			console.log("end");
			endGame();
			return;
		}
	}

	this.update = function(terrain) {
		// advance the animation frame
		if (this.speed.x == 0 || !this.onFloor())
			this.animationFrame = 0;
		this.animationFrame = (this.animationFrame + (this.speed.x / 40)) % 5;

		progress = Math.floor((this.x + this.width)/window.block_x);

		// Update player race progression; -8 accounts for the end being at the mid point
		this.race_progress = (this.x + this.width)/window.block_x / ((level.level_data.length) * 16 - 8);
		var y_block = Math.ceil(this.y/window.block_y);

		//Deals with changing floor height
		this.floor = canvasHeight;

		this.checkFloor(y_block, terrain);
		this.checkAhead(y_block, terrain);
		
		//Slowly increase player speed
		// Limit horizontal speed
		if (this.speed.x < this.xSpeedLimit) {
			this.speed.x += .3;
		}
		
		//Handle jumping
		if (this.jumpTimeLeft > 0) {
			this.speed.y -= 5;
			this.jumpTimeLeft -= 25;
		}
		this.y += this.speed.y;
		this.x += this.speed.x;

		//Add offset to move canvas
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