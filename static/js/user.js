//Contains info about the user using the app
function User(){
	this.name;
	this.pwd;

	this.highscores;
	this.coins;

	this.charImage = new Image();
	this.charImage.src = "/images/dinosaur_animation.png";

	//Variables set for each lobby
	this.lobby_name;
	this.player_id;
}