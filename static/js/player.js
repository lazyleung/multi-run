function Player(playerX, playerY) {
	this.x = playerX;
	this.y = playerY;
	this.airFriction = .05;
	this.gravity = .1;
	this.onFloor = true;
	this.width = 60;
	this.height = 100;
	this.speed = {x : 0, y : 0};
	this.image = new Image();
	this.xSpeedLimit = 20;
	this.xOffset = 0;
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

	this.draw = function(ctx) {
		ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
	}

	var lowJump = function(ctx) {
		this.speed.y = -75;
	}.bind(this);

	var highJump = function(ctx) {
		this.speed.y = -150;
	}.bind(this);

	var slowDown = function(ctx) {

	}.bind(this);

	this.update = function() {
		if (this.speed.x < this.xSpeedLimit) {
			this.speed.x += 1;
		}
		// Check on floor
		if (this.y < 550)
			this.onFloor = false;
		else
			this.onFloor = true;

		this.y += this.speed.y;
		this.x += this.speed.x;
		this.xOffset += this.speed.x;
		if (Math.abs(this.speed.y) < this.airFriction)
			this.speed.y = 0;
		else if (this.speed.y < 0)
			this.speed.y += this.airFriction;
		if (!this.onFloor && this.speed.y >= 0)
			this.speed.y += this.gravity;
		else
			this.speed.y = 0
	}
	this.init();
}