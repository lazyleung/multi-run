function Slow(X, Y) {
	this.x = X;
	this.y = Y;
	this.width = 60;
	this.height = 100;
	this.image = new Image();
	this.image.src = "/images/slow.png";
}

Slow.prototype.draw = function(ctx) {
	ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
}

function Flash(X, Y) {
	this.x = X;
	this.y = Y;
	this.width = 60;
	this.height = 100;
	this.image = new Image();
	this.image.src = "/images/flash.png";
}

Flash.prototype.draw = function(ctx) {
	ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
}

function Boost(X, Y) {
	this.x = X;
	this.y = Y;
	this.width = 60;
	this.height = 100;
	this.image = new Image();
	this.image.src = "/images/boost.png";
}

Boost.prototype.draw = function(ctx) {
	ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
}