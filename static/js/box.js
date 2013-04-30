function Box(boxX, boxY) {
	this.x = boxX;
	this.y = boxY;
	this.width = 60;
	this.height = 100;
	this.image = new Image();
	this.image.src = "/images/wooden_crate.png";
}

Box.prototype.draw = function() {
	ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
}

Box.prototype.hit = function() {
	//Animate hit
}