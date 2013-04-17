function Background() {
	this.BGcolor = "rgb(130,160,230)";
	this.clouds = new Array();
	this.cloudSpawnTime = 10;

	this.update = function() {
		for(var i = 0; i < this.clouds.length;){
			this.clouds[i].update();
			if(this.clouds[i].x + this.clouds[i].w < 0) {
				this.clouds.splice(i,1);
			} else {
				i++;
				if(i == this.clouds.length){
					break;
				}
			}
		}
		if(this.clouds.length < 5 && this.cloudSpawnTime === 0 && Math.random() > 0.9) {
			var type = Math.floor((Math.random()*2));
			var size = Math.floor((Math.random()*3));
			this.clouds.push(new cloud(type, size));
			this.cloudSpawnTime = 100;
		}
		if(this.cloudSpawnTime > 0){
			this.cloudSpawnTime--;
		}
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