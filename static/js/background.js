function Background() {
	this.BGcolor = "rgb(130,160,230)";
	this.clouds = new Array();
	this.cloudSpawnTime = 10;

	this.update = function() {
		//Cloud stuff
		//Check for and delete clouds that have moved off screen
		for(var i = 0; i < this.clouds.length;){
			var c =  this.clouds[i];
			if((c.x + c.w) < 0) {
				this.clouds.splice(this.clouds.indexOf(c),1);
			} else {
				c.update();
				i++;
			}
		}
		//Add clouds at a reasonable frequency
		if(this.clouds.length < 5 && this.cloudSpawnTime === 0 && Math.random() > 0.9) {
			//Random type 0-1
			var type = Math.floor((Math.random()*2));
			//Random size 2-6
			var size = Math.floor((Math.random()*4)+2);
			this.clouds.push(new cloud(type, size));
			this.cloudSpawnTime = 100;
		}
		if(this.cloudSpawnTime > 0){
			this.cloudSpawnTime--;
		}

		//mountain stuff
	}

	this.draw = function() {
		ctx.save();
		//background
		ctx.fillStyle = this.BGcolor;
		ctx.fillRect(0, 0, canvasWidth, canvasHeight);

		//clouds
		for(var i in this.clouds){
			this.clouds[i].draw();
		}

		ctx.restore();
	}
}