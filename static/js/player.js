function Player(playerX, playerY) {
	this.x = playerX;
	this.y = playerY;
	this.lastX = playerX;
	this.targetDisplacement = 0;
	this.airFriction = 0;
	this.gravity = 1.2;
	this.width = 60;
	this.height = 100;
	this.speed = {x : 0, y : 0};
	this.image = new Image();
	this.xOffset = 2*window.block_x;
	this.jumpTimeLeft = 0;
	this.floor = canvasHeight- 2*window.block_y;
	this.xSpeedLimit = 25;
	this.image.src = "/images/Dinosaur.png";

	this.init = function() {
		// Setup touch handler
		$('body').hammer().on("swipeup", function(event) {
			event.gesture.preventDefault();
		    console.log(this, event);
		    if (Math.abs(event.gesture.deltaY) <= 300) {
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

	this.draw = function(ctx) {
		ctx.drawImage(this.image, this.x, this.y - this.height, this.width, this.height);
	}

	var lowJump = function(ctx) {
		this.jumpTimeLeft = 100;	
	}.bind(this);

	var highJump = function(ctx) {
		this.jumpTimeLeft = 130;	
	}.bind(this);

	var slowDown = function(ctx) {

	}.bind(this);

	this.update = function(progress, terrain) {
		if(this.x - this.lastX >= window.block_x){
			progress++;
			this.lastX = this.x;
		}

		var x_block = Math.floor(this.x/window.block_x);
		var y_block = Math.floor(this.y/window.block_y);

		// this.floor = canvasHeight;

		// for(var i = y_block; i < 8; i++){
		// 	if(terrain[progress][0][x_block - (progress * 16) + (i * 8)] === 1){
		// 		console.log("floor change:" + (x_block - (progress * 16) + (i * 8)));
		// 		this.floor = canvasHeight- (i + 1)*window.block_y;
		// 		break;
		// 	}
		// }
		
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