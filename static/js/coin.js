function Coin(coinX, coinY){
	this.x = coinX
	this.y = coinY
	this.img = new Image();
	this.img.src = "/images/coin1.png"
	this.img2 = new Image();
	this.img2.src = "/images/coin2.png"
	this.img3 = new Image();
	this.img3.src = "/images/coin3.png"
	this.img4 = new Image();
	this.img4.src = "/images/coin4.png"
	this.points = 100;
	this.width = 100;
	this.height = 100;
	this.animationFrame = 0;
}

Coin.prototype.draw = function(){
	console.log(this.animationFrame);
	if (this.animationFrame === 0) {
		console.log("A");
		ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
	} else if (this.animationFrame === 1) {
		console.log("B");
		ctx.drawImage(this.img2, this.x, this.y, this.width, this.height);
	} else if (this.animationFrame === 2) {	
		console.log("C");
		ctx.drawImage(this.img3, this.x, this.y, this.width, this.height);
	} else {
		console.log("D");
		ctx.drawImage(this.img4, this.x, this.y, this.width, this.height);
	}
	this.animationFrame = (this.animationFrame + 1)%4;
	console.log(this.animationFrame);
}