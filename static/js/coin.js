function Coin(coinX, coinY){
	this.x = coinX
	this.y = coinY
	this.img = new Image();
	this.img.src = "/images/coin1.png"
	this.points = 100;
	this.width = 100;
	this.height = 100;
	this.animationFrame = 0;
}

Coin.prototype.draw = function(){
	
	if (this.animationFrame === 0) {
		ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
	} else if (this.animationFrame === 1) {
		this.img.src = "/images/coin2.png";
		ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
	} else if (this.animationFrame === 2) {	
		this.img.src = "/images/coin3.png";
		ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
	} else {
		this.img.src = "/images/coin4.png";
		ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
	}
	this.animationFrame = (this.animationFrame + 1)%4;
	console.log(this.animationFrame);
}