function Fireball(X, Y, playerSpeed,direction, id) {
	this.x = X
	this.y = Y
	this.playerSpeed = playerSpeed;
	this.image = images.fireball;
	this.width = window.block_y;
	this.height = window.block_y;
	this.direction = direction;
	this.speed = direction === "left" ? this.playerSpeed - 15 : this.playerSpeed + 15;
	this.id = id;

	this.draw = function() {
		ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
	}

	this.update = function() {
		this.x += this.speed;
	}
}
