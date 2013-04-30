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
	this.fireballDefaultCooldown = 2000;
	this.fireballCooldown = 0;
	this.coin_sound = new Audio("sound/coin.mp3");


	this.init = function() {
		// Setup touch handler
		$('body').hammer().on("swipeup", function(event) {
			event.gesture.preventDefault();
		    //console.log(this, event);
		    if (Math.abs(event.gesture.deltaY) <= 120) {
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
		$('body').hammer().on("tap", function(event) { // if tap is on left side, shoot left;
			event.gesture.preventDefault();

			if (getCooldown() === 0) {
				if (event.gesture.center.pageX < $(window).width()/2.5) {  //2.5 is to center it on the player
					shootFireball("left")
				}
				else
					shootFireball("right");
			}
		})
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
		ctx.fillStyle = "#038200";
		ctx.fillRect(this.xOffset - canvasWidth/15, 475/8 + 5, canvasWidth * .70 + 247/8, 5);
		ctx.drawImage(this.end, (canvasWidth*.70+ this.xOffset - canvasWidth/15), 10, 247/8, 475/8);
		this.drawProgression();
	}

	this.drawProgression = function() {
		ctx.drawImage(this.image, 0, 0, 247, 475, (this.race_progress * canvasWidth * .70) + this.xOffset - canvasWidth/15, 10, 247/8, 475/8);
	}.bind(this)

	var lowJump = function() {
		if (this.onFloor() == true) {
			this.jumpTimeLeft = 75;
		}
	}.bind(this);

	var highJump = function() {
		if (this.onFloor() == true) {
			this.jumpTimeLeft = 100;
		}
	}.bind(this);

	var getCooldown = function() {
		return this.fireballCooldown
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

	var shootFireball = function(direction) {
		var startX = direction === "left" ? this.x : this.x + this.width
		// set a cooldown and fire fireball
		this.fireballCooldown = this.fireballDefaultCooldown;
		var fireball = new Fireball(startX, this.y - this.height * .8, this.speed.x, direction, usr.name)
		level.fireballArray.push(fireball);
		socket.emit("player_fireball", {'x': fireball.x, 'y':fireball.y, 'player_speed':fireball.playerSpeed, 'direction': fireball.direction, 'id': fireball.id, 'lobby_name':usr.lobby_name});
		//console.log("fireball =", fireball);
	}.bind(this);

	this.checkAhead = function(y, terrain){
		return terrain[Math.floor(progress/16)][0][progress - (Math.floor(progress/16) * 16) + ((y-1) * 16)];
	}

	this.checkFireball = function() {
		var player = this;
		for (i = 0; i < level.fireballArray.length; i++){
			var fireball = level.fireballArray[i];
		//level.fireballArray.forEach(function(fireball) {
			if (fireball.id !== usr.name &&intersectRect(fireball, player) === true) {
				console.log("burn");
				if(player.hit === 0){
					player.speed.x = player.xSpeedBase
					player.hit = 1;
				}
				//pop out fire ball here
				level.fireballArray.splice(i, 1);
				return true;
			}
		//});
		}
	}

	var intersectRect = function(r1, r2) {
	  return !(r2.x > r1.x + r1.width || 
	           r2.x + r2.width < r1.x || 
	           r2.y - r2.height > r1.y ||
	           r2.y < r1.y - r1.height);
	}.bind(this);

	//Checks for coin pickup
	this.checkCoin = function(y, terrain){
		var ahead = terrain[Math.floor(progress/16)][0][progress - (Math.floor(progress/16) * 16) + ((y-1) * 16)];
		var aheadabove = terrain[Math.floor(progress/16)][0][progress - (Math.floor(progress/16) * 16) + ((y-2) * 16)];
		
		if(ahead !== 5 && aheadabove !== 5){
			return false;
		}
		terrain[Math.floor(progress/16)][0][progress - (Math.floor(progress/16) * 16) + ((y-1) * 16)] = 0;
		terrain[Math.floor(progress/16)][0][progress - (Math.floor(progress/16) * 16) + ((y-2) * 16)] = 0;

		this.points += 50;
		this.coin_sound.play();
		return true;
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

		// Decrement fireball cooldown
		if (this.fireballCooldown > 0)
			this.fireballCooldown -= window.timeInterval;

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
		}

		this.checkCoin(y_block, terrain);
		this.checkFireball();
		
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