function Fireball(X, Y, direction) {
	this.x = X
	this.y = Y
	this.img;
	this.width = 100;
	this.height = 100;

Fireball.prototype.draw = function() {
	ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
}
}