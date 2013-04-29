function Coin(coinX, coinY, coinWidth, coinHeight){
	this.x = coinX
	this.y = coinY
	this.img = images.coin;
	this.width = coinWidth;
	this.height = coinHeight;
}

Coin.prototype.draw = function(i){
	ctx.drawImage(this.img, 256 * Math.floor(i/8), 0, 256, 256, this.x, this.y, this.width, this.height);
}

Coin.prototype.hit = function(){

}