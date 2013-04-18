function Mountain(type, size) {
	this.x = canvasWidth;
	this.y = 500;
	this.w;
	this.h;
	this.speed = 10;
	this.img = new Image();
	this.img.src = "/images/mountain_sprites.png"
	this.sx;
	this.sy;
	this.sw;
	this.sh;
	switch(type){
		case 0:
			this.sx = 44;
			this.sy = 142;
			this.sw = 948;
			this.sh = 490;
			break;
		case 1:
			this.sx = 1217;
			this.sy = 103;
			this.sw = 722;
			this.sh = 516;
			break;
		case 2:
			this.sx = 29;
			this.sy = 758;
			this.sw = 1106;
			this.sh = 791;
			break;
	}

	if(size <= 0){
		throw "mountain size is invalid";
	}
	this.w = this.sw/size;
	this.h = this.sh/size;
}

Mountain.prototype.draw = function(){
	ctx.drawImage(this.img, this.sx, this.sy, this.sw, this.sh, this.x,this.y, this.w, this.h);
}

Mountain.prototype.update = function(){
	if((this.x + this.w) >= 0){
		this.x -= this.speed;
	}
}