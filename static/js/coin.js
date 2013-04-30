function Coin(coinX, coinY, coinWidth, coinHeight){
	this.x = coinX
	this.y = coinY
	this.img = images.coin;
	this.width = coinWidth;
	this.height = coinHeight;
}

Coin.prototype.draw = function(){
	ctx.drawImage(this.img, 0, 0, 258, 256, this.x, this.y, this.width, this.height);
}