var Timer = function(minutes) {
	this.timer = minutes * 60 *1000; // Convert to milliseconds	

	this.draw = function(ctx, offsetX) {
		var str = prefixZero(0, parseInt(this.timer / 60000), parseInt(this.timer / 1000) % 60);
    	ctx.font = "60px Arial";
		ctx.fillStyle = "white";
		ctx.fillText(str, 90 + offsetX, 90);
	}

	this.update = function() {
		if(this.timer % 1000 == 0)
		this.timer -= 25;
	}
}

// Author: Anthoniraj Amalanathan
function prefixZero(hour, min, sec)
{
	var curTime;
	if(hour < 10)
	   curTime = "0"+hour.toString();
	else
	   curTime = hour.toString(); 
	 if(min < 10)
	   curTime += ":0"+min.toString();                           
	else
	   curTime += ":"+min.toString();  

	if(sec < 10)
	   curTime += ":0"+sec.toString();                           
	else
	   curTime += ":"+sec.toString();  
	return curTime;
}
