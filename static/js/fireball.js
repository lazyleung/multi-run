function Fireball(X, Y, direction) {
	this.x = X
	this.y = Y
	this.image = images.fireball;
	this.width = 100;
	this.height = 100;
	this.direction = direction;
	this.speed = direction === "left" ? -5 : 40;


	this.draw = function() {
		ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
	}

	this.update = function() {
		this.x += this.speed;
	}
}