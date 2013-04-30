//Create different sizes of clouds
//Clouds have different speed depedning on size

//Type 0 is the white cloud
//Type 1 is the grey cloud

function Cloud(type, size){
	this.x = canvasWidth;
	this.y = 80;
	this.w;
	this.h;
	this.speed = 10;
	this.bobCount = 0;
	this.img = new Image();
	this.img.src = "/images/cloud.png"
	this.sx;
	this.sy;
	this.sw;
	this.sh;

	switch(type){
		case 0:
			this.sx = 5;
			this.sy = 6;
			this.sw = 112;
			this.sh = 50;
			break;
		case 1:
			this.sx = 17;
			this.sy = 71;
			this.sw = 96;
			this.sh = 32;
			break;
	}

	if(size <= 0){
		throw "cloud size is invalid";
	}
	this.w = this.sw*size;
	this.h = this.sh*size;
	this.speed *= size;
}

Cloud.prototype.draw = function(){
	ctx.drawImage(this.img, this.sx, this.sy, this.sw, this.sh, this.x,this.y, this.w, this.h);
}

Cloud.prototype.update = function(){
	if((this.x + this.w) >= 0){
		this.x -= this.speed;
	}
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