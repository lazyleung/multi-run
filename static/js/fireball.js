function Fireball(X, Y, direction) {
	this.x = X
	this.y = Y
	this.image = images.fireball;
	this.width = window.block_y;
	this.height = window.block_y;
	this.direction = direction;
	this.speed = direction === "left" ? -5 : 40;


	this.draw = function() {
		ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
	}

	this.update = function() {
		this.x += this.speed;
	}
}