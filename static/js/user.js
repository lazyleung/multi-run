//Contains info about the user using the app
function User(){
	this.name;
	this.pwd;

	this.highscores;
	this.charImage = images.dino_olive;

	//Variables set for each lobby
	this.lobby_name;
	this.player_id;


	this.charNum;
	this.setChar = function(n){
		switch(n){
			case 1:
				this.charImage = images.dino_green;
				break;
			case 2:
				this.charImage = images.dino_blue;
				break;
			case 3:
				this.charImage = images.dino_red;
				break;
			case 4:
				this.charImage = images.dino_olive;
				break;
		}
	}
}