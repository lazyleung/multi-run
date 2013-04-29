function Box(boxX, boxY) {
	this.x = boxX;
	this.y = boxY;
	this.width = 60;
	this.height = 100;
	this.image = new Image();
	this.image.src = "/images/wooden_crate.png";
}

box.prototype.draw = function(ctx) {
	ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
}

box.prototype.hit = function() {
	//Animate hit
}