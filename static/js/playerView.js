function playerView(name, id){
	this.name = name;
	this.id = id;
	this.image = images.dino_olive;
	this.speed;
	this.width = window.block_y/5 * 6;
	this.height = window.block_y * 2;
	this.race_progress = 0;
	this.x;
	this.y;

	this.setChar = function(n){
		switch(n){
			case 1:
				this.image = images.dino_green;
				break;
			case 2:
				this.image = images.dino_blue;
				break;
			case 3:
				this.image = images.dino_red;
				break;
			case 4:
				this.image = images.dino_olive;
				break;
		}
	}

	this.draw = function(offset, x, y, animationFrame) {
		this.x = x;
		this.y = y;
		ctx.drawImage(this.image, 0, 0, 247, 475, (Math.floor((x + this.width)/window.block_x) * canvasWidth * .70) - canvasWidth/15 + offset, 10, 247/8, 475/8);

		ctx.drawImage(this.image, ( 247 * Math.ceil(animationFrame)), 0, 247, 475, x, y - this.height, this.width, this.height);

		ctx.font = "32px Arial";
		ctx.fillStyle = "black";
		ctx.fillText(String(this.name), window.data.data.pos_x+(0.1)*window.block_x, window.data.data.pos_y-2.5*window.block_y);
		this.drawProgression(offset);

	}
	
	this.drawProgression = function(offset) {
		ctx.drawImage(this.image, 0, 0, 247, 475, (this.race_progress * canvasWidth * .70) + offset - canvasWidth/15, 10, 247/8, 475/8);
	}.bind(this)

	this.update = function(terrain) {
	progress = Math.floor((this.x + this.width)/window.block_x);
	// Update player race progression; -8 accounts for the end being at the mid point
	this.race_progress = (this.x + this.width)/window.block_x / ((level.level_data.length) * 16 - 8);
	var y_block = Math.ceil(this.y/window.block_y);
	}
}

//playerView.prototype.playerView = function(){
	//socket.on('update_player')
//}
