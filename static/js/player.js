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
	this.image = usr.charImage;
	this.xOffset = 2*window.block_x;
	this.jumpTimeLeft = 0;
	this.floor = canvasHeight - window.block_y;
	this.xSpeedBase = 5;
	this.xSpeedLimit = 25;
	this.animationFrame = 0;
	this.race_progress = 0;
	this.end = new Image();
	this.end.src = "/images/end.png";
	this.points = 0;
	this.hit = 0;

	this.init = function() {
		// Setup touch handler
		$('body').hammer().on("swipeup", function(event) {
			event.gesture.preventDefault();
		    console.log(this, event);
		    if (Math.abs(event.gesture.deltaY) <= 100) {
		    	lowJump();
		    }
		    else {
		    	highJump();
		    }
		});
		$('body').hammer().on("swipeleft", function(event) {
			event.gesture.preventDefault();
		    slowDown();
		});
	}
	
	this.onFloor = function() {
		if (this.y < this.floor)
			return false;
		else
			return true;
	}

	this.draw = function() {
		if(this.hit % 2 === 0){
			ctx.drawImage(this.image, ( 247 * Math.ceil(this.animationFrame)), 0, 247, 475, this.x, this.y - this.height, this.width, this.height);
			if(this.hit > 0){
				this.hit++;
			}
		} else {
			if(this.hit++ > 50){
				this.hit = 0;
			}
		}
		
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
		if (this.speed.x > this.xSpeedBase + 10)
			this.speed.x = this.xSpeedBase + 10;
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
		return terrain[Math.floor(progress/16)][0][progress - (Math.floor(progress/16) * 16) + ((y-1) * 16)];
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
		this.floor = canvasHeight-window.block_y;

		this.checkFloor(y_block, terrain);

		switch(this.checkAhead(y_block, terrain)){
			case 2:
				this.speed.x = this.xSpeedBase;
				if(this.hit === 0){
					this.hit = 1;
				}
				break;
			case 4:
				endGame();
				return;
			case 5:
				this.points += 50;
		}
		
		//Slowly increase player speed
		// Limit horizontal speed
		if (this.speed.x < this.xSpeedLimit) {
			this.speed.x += .2;
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
}