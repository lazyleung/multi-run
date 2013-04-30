function Mountain(type, size) {
	this.x = canvasWidth;
	this.y = canvasHeight;
	this.w;
	this.h;
	this.speed = 7;
	this.img = new Image();
	this.img.src = "/images/mountain_sprites.png"
	this.sx;
	this.sy;
	this.sw;
	this.sh;
	switch(type){
		case 0:
			this.sx = 13;
			this.sy = 41;
			this.sw = 276;
			this.sh = 143;
			break;
		case 1:
			this.sx = 355;
			this.sy = 30;
			this.sw = 211;
			this.sh = 151;
			break;
		case 2:
			this.sx = 9;
			this.sy = 222;
			this.sw = 321;
			this.sh = 230;
			break;
	}

	if(size <= 0){
		throw "mountain size is invalid";
	}
	this.w = this.sw*size;
	this.h = this.sh*size;
}

Mountain.prototype.draw = function(){
	ctx.drawImage(this.img, this.sx, this.sy, this.sw, this.sh, this.x,this.y - this.h, this.w, this.h);
}

Mountain.prototype.update = function(){
	if((this.x + this.w) >= 0){
		this.x -= this.speed;
	}
}