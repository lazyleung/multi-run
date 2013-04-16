function Background() {
	this.BGcolor = "rgb(130,160,230)";
	this.cloud = new Image();
	this.cloud.src = "/images/cloud.png";

	this.update = function() {
		//Move clouds
	}

	this.draw = function() {
		ctx.save();
		//background
		ctx.fillStyle = this.BGcolor;
		ctx.fillRect(0, 0, canvasWidth, canvasHeight);

		//clouds
		ctx.drawImage(this.cloud, 23, 31, 444, 196, 0,0, 444, 196);
		ctx.drawImage(this.cloud, 23, 31, 444, 196, 500,150, 222, 98);

		ctx.restore();
	}
}