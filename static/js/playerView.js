function playerView(name, id){
	this.name = name;
	this.id = id;
	this.image = images.dino_olive;
	this.speed;
	this.width = window.block_y/5 * 6;
	this.height = window.block_y * 2;
	this.animationFrame = 0;
	this.race_progress = 0;

	this.setChar = function(n){
		switch(n){
			case 1:
				this.charImage = images.dino_green;
				break;
			case 2:
				this.charImage = images.dino_blue;
				break;
			case 3:
				this.charImage = images.dino_red;
				break;
			case 4:
				this.charImage = images.dino_olive;
				break;
		}
	}

	this.draw = function() {
		ctx.drawImage(this.image, ( 247 * Math.ceil(this.animationFrame)), 0, 247, 475, this.x, this.y - this.height, this.width, this.height);
		// Draws player progress on minimap
		ctx.drawImage(this.end, (canvasWidth*.75+ this.xOffset), (canvasHeight*.1), 247/8, 475/8);
		this.drawProgression();

	}
	this.drawProgression = function() {
		ctx.drawImage(this.image, 0, 0, 247, 475,  (this.race_progress * canvasWidth * .8) + this.xOffset - canvasWidth/15 , canvasHeight * .1, 247/8, 475/8);
	}.bind(this)

	this.update = function(terrain) {
	// advance the animation frame
	if (this.speed.x == 0 || !this.onFloor())
		this.animationFrame = 0;
		this.animationFrame = (this.animationFrame + (this.speed.x / 40)) % 5;

	progress = Math.floor((this.x + this.width)/window.block_x);
	// Update player race progression; -8 accounts for the end being at the mid point
	this.race_progress = (this.x + this.width)/window.block_x / ((level.level_data.length) * 16 - 8);
	var y_block = Math.ceil(this.y/window.block_y);
	}
}

//playerView.prototype.playerView = function(){
	//socket.on('update_player')
//}
