function Player(playerX, playerY) {

	this.init = function() {
		this.x = playerX;
		this.y = playerY;
		this.speed = (0,0);
		this.image = new Image()
		this.image.src = "../../Art\ assets/wooden_crate.png"
	}

	this.draw = function(ctx) {
		ctx.drawImage(this.image, 281, 5, 14, 14, this.x, this.y, 25, 25);
	}
}