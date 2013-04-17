//Create different sizes of clouds
//Clouds have different speed depedning on size

function cloud(type, size){
	this.x = canvasWidth;
	this.y = 100;
	this.w;
	this.h;
	this.speed = 6;
	this.bobCount = 0;
	this.img = new Image();
	this.img.src = "/images/cloud.png"
	this.sx;
	this.sy;
	this.sw;
	this.sh;

	switch(type){
		case 0:
			this.sx = 23;
			this.sy = 31;
			this.sw = 444;
			this.sh = 196;
			break;
		case 1:
			this.sx = 68;
			this.sy = 288;
			this.sw = 380;
			this.sh = 121;
			break;
	}

	if(size != 0){
		this.w = this.sw/size;
		this.h = this.sh/size;
		this.speed /= size;
	}
}

cloud.prototype.draw = function(){
	ctx.drawImage(this.img, this.sx, this.sy, this.sw, this.sh, this.x,this.y, this.w, this.h);
}

cloud.prototype.update = function(){
	this.x -= this.speed;
	if(this.bobCount > 16){
		this.bobCount = 0;
	}
	if(this.bobCount === 4){
		this.y++;
	}
	if(this.bobCount === 12){
		this.y--;
	}
	this.bobCount++;
}