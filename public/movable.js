
MovementEnum = {
    UP: 0,
    RIGHT: 1,
    DOWN: 2,
    LEFT: 3,
    STOPPED: 4
}

var pixelsPerTick = 2;

function character(theID, startingX, startingY, gifName) {
    this.theID = theID;  
    this.gifName = gifName;
    this.startingX = startingX;
    this.startingY = startingY;
    this.currentX = startingX;
    this.currentY = startingY;
    this.currentDirection = MovementEnum.STOPPED;
    this.currentInput = null;
    this.tableID = "x_" + this.startingX + "-y_" + this.startingY;
    this.image = null;

    this.distanceToCenter = 0;
	this.isAdjusting = false;
	this.isAdjustingIntersection = false;

	this.imageTop = 0;
	this.imageLeft = 0;

	this.now = +new Date;
    this.lastFrame = this.now;
	this.deltaT = this.now - this.lastFrame;

    this.placeCharacter = function (){
	    var tableData = document.getElementById("x_" + this.startingX + "-y_" + this.startingY);
	    tableData.innerHTML = "<img src=\"assets/" + this.gifName + "\" id=\""+ this.theID +"\">";
	    this.image = document.getElementById(this.theID);
	    this.image.style.width = '80%';
	    this.image.style.height = 'auto';
	};


	this.startMove = function(){
	    this.image.style.position= 'relative';
	    this.image.style.left = '0px';
	    this.image.style.top = '0px';
	    this.moveCharacter();
		//console.log(this);
	};

	this.moveCharacter = function(){

		this.now = +new Date;
    	this.deltaT = this.now - this.lastFrame;

		//console.log(this);
	    this.moveImage();
	    this.checkInput();

	    var square = getSquareForObject(this.theID);

	    this.currentX = square.x;
	    this.currentY = square.y;

	    this.removePellet(square);

	    var isHitting = this.isHittingWall(this.currentDirection);

	    if (isHitting && !this.isAdjusting) {
	        this.getDistanceToCenter(this.theID, square.x, square.y);
	        this.isAdjusting = true;
	    }

		else if (this.currentInput != null && !this.isAdjustingIntersection && !this.isAdjusting && this.isAtIntersection(this.currentX, this.currentY, this.currentDirection)){
			this.getDistanceToCenter(this.theID, this.currentX, this.currentY);
			this.isAdjusting = true;
			this.isAdjustingIntersection = true;
		}

	    animate = setTimeout(function(character){
	    	character.moveCharacter();
	    }, 20, this); 
	    
	    this.lastFrame = this.now;
	};

	this.isAtIntersection = function(currentSquareX, currentSquareY, currentDirection){
		var squareAbove = getNextSquare(currentSquareX, currentSquareY, MovementEnum.UP);
		var squareAboveData = mazeTable[squareAbove.x][squareAbove.y];

		var squareRight = getNextSquare(currentSquareX, currentSquareY, MovementEnum.RIGHT);
		var squareRightData = mazeTable[squareRight.x][squareRight.y];

		var squareBelow = getNextSquare(currentSquareX, currentSquareY, MovementEnum.DOWN);
		var squareBelowData = mazeTable[squareBelow.x][squareBelow.y];

		var squareLeft = getNextSquare(currentSquareX, currentSquareY, MovementEnum.LEFT);
		var squareLeftData = mazeTable[squareLeft.x][squareLeft.y];

		var isAtIntersection = false;

		switch(currentDirection){
			case MovementEnum.UP:
				isAtIntersection = (squareRightData !== WALL_VALUE || squareLeftData !== WALL_VALUE);
				break;
			case MovementEnum.DOWN:
				isAtIntersection = (squareRightData !== WALL_VALUE || squareLeftData !== WALL_VALUE);
				break;
			case MovementEnum.RIGHT:
				isAtIntersection = (squareAboveData !== WALL_VALUE || squareBelowData !== WALL_VALUE);
				break;
			case MovementEnum.LEFT:
				isAtIntersection = (squareAboveData !== WALL_VALUE || squareBelowData !== WALL_VALUE);
				break;
		}

		return isAtIntersection
	};

	this.moveImage = function(){
		/*
	    if (!this.isAdjustingIntersection && this.isAdjusting && this.distanceToCenter <= 0){
	        this.currentDirection = MovementEnum.STOPPED;
	        this.isAdjusting = false;
	        return;
	    }
	    */

	    switch(this.currentDirection){
	        case MovementEnum.UP:
	            this.image.style.top = parseInt(this.image.style.top) - (pixelsPerTick * this.deltaT/20) + 'px';
	            break;
	        case MovementEnum.RIGHT:
	            this.image.style.left = parseInt(this.image.style.left) +  (pixelsPerTick * this.deltaT/20) + 'px';
	            break;
	        case MovementEnum.DOWN:
	            this.image.style.top = parseInt(this.image.style.top) +  (pixelsPerTick * this.deltaT/20) + 'px';
	            break;
	        case MovementEnum.LEFT:
	            this.image.style.left = parseInt(this.image.style.left) -  (pixelsPerTick * this.deltaT/20) + 'px';
	            break;
	    }

	    this.imageTop = this.image.style.top;
	    this.imageLeft = this.image.style.left;

	    if (this.isAdjusting){
	        this.distanceToCenter -= (pixelsPerTick * (this.deltaT / 20));
	        if (this.distanceToCenter <= 0){
	            this.isAdjusting = false;
				if (!this.isAdjustingIntersection) {
					this.currentDirection = MovementEnum.STOPPED;
				}
				else {
					var nextSquare = getNextSquare(this.currentX, this.currentY, this.currentInput);
					var nextSquareData = mazeTable[nextSquare.x][nextSquare.y];
					if (nextSquareData !== WALL_VALUE) {
						this.currentDirection = this.currentInput;
						this.changeImageRotation(this.currentDirection);
						this.currentInput = null;
					}
					this.isAdjustingIntersection = false;
				}
	        }
	    }
	};

	this.checkInput = function(){
	    if (this.currentDirection == MovementEnum.STOPPED) {
			if (this.currentInput != null) {
				//console.log("Changing ghost direction");
				this.currentDirection = this.currentInput;
				this.changeImageRotation(this.currentDirection);
				this.currentInput = null;
			}
		}
	};



	this.setInput = function(input){
		this.currentInput = input;
		//this.moveCharacter();
	};

	this.isHittingWall = function(newDirection){
		// If ghost moves to a new grid square, check to see if the next one is a wall
		if (newDirection != MovementEnum.STOPPED){

		    var nextSquare = getNextSquare(this.currentX, this.currentY, newDirection);
		    if(!nextSquare) return true;

		    // If the next square is a wall, stop ghost from moving
		    if (isNextSquareWall(nextSquare.x, nextSquare.y)){
		        return true;
		    }
		    return false;
		}
		else{
			return false;
		}
	}

	this.getDistanceToCenter = function(pacmanId, squareX, squareY){
	    var pacmanElement = document.getElementById(pacmanId);
	    console.log(pacmanId, squareX, squareY);
	    var gridSquareElement = document.getElementById("x_" + squareX + "-y_" + squareY);
	    if(gridSquareElement == null) return;
	    var pacmanRect = pacmanElement.getBoundingClientRect();
	    //if(pacmanRect == null) return;
	    var gridSquareRect = gridSquareElement.getBoundingClientRect();
	    //if(gridSquareRect == null) return;
	    var pacmanRectCenter = {x: (pacmanRect.left + (pacmanRect.width / 2)), y: pacmanRect.top + (pacmanRect.height / 2)};
	    var squareRectCenter = {x: (gridSquareRect.left + (gridSquareRect.width / 2)), y: gridSquareRect.top + (gridSquareRect.height / 2)};

	    switch (this.currentDirection){
	        case MovementEnum.UP:
	            this.distanceToCenter = pacmanRectCenter.y - squareRectCenter.y;
	            break;
	        case MovementEnum.RIGHT:
	            this.distanceToCenter = squareRectCenter.x - pacmanRectCenter.x;
	            break;
	        case MovementEnum.DOWN:
	            this.distanceToCenter = squareRectCenter.y - pacmanRectCenter.y;
	            break;
	        case MovementEnum.LEFT:
	            this.distanceToCenter = pacmanRectCenter.x - squareRectCenter.x;
	            break;
	    }
	};

	this.changeDirection = function(newDirection){
	    if (!this.isAdjusting || !this.isAdjustingIntersection) {

	        if (!this.isHittingWall(newDirection)) {
	        	//console.log("Here");
	            this.currentDirection = newDirection;
	            this.changeImageRotation(newDirection);
	        }
	    }
	};

	this.changeImageRotation = function(newDirection){
	    if(this.theID === 'pacman-gif'){
		    var pacmanElement = document.getElementById('pacman-gif');
		    switch(newDirection){
		        case MovementEnum.UP:
		            pacmanElement.className = 'rotate-up';
		            break;
		        case MovementEnum.RIGHT:
		            pacmanElement.className = ' rotate-right';
		            break;
		        case MovementEnum.DOWN:
		            pacmanElement.className = ' rotate-down';
		            break;
		        case MovementEnum.LEFT:
		            pacmanElement.className = ' rotate-left';
		            break;
		    }
		}
	};

	this.removePellet = function(pacmanSquare){
		if(this.theID === "pacman-gif" && pacmanSquare.x > -1 && pacmanSquare.y > -1){
		    // Remove the pellet from this square that Pacman is currently in
		    var pacmanSquareData = mazeTable[pacmanSquare.x][pacmanSquare.y];
		    if (pacmanSquareData == PELLET_VALUE) {
		        var squareElement = document.getElementById('x_' + pacmanSquare.x + '-y_' + pacmanSquare.y)
		        var pelletElement = document.getElementById('pellet-x_' + pacmanSquare.x + '-y_' + pacmanSquare.y);
		        if (pelletElement) {
		            squareElement.removeChild(pelletElement);
		            mazeTable[pacmanSquare.x][pacmanSquare.y] = FLOOR_VALUE;
		            //sendNewTableData(pacmanSquare.x, pacmanSquare.y, FLOOR_VALUE);
		            sendBoardUpdate(pacmanSquare.x, pacmanSquare.y, FLOOR_VALUE);
		        }
		    }
		    else if (pacmanSquareData == POWER_PELLET_VALUE){
		        var squareElement = document.getElementById('x_' + pacmanSquare.x + '-y_' + pacmanSquare.y)
		        var pelletElement = document.getElementById('power-pellet-x_' + pacmanSquare.x + '-y_' + pacmanSquare.y);
		        if (pelletElement) {
		            squareElement.removeChild(pelletElement);
		            mazeTable[pacmanSquare.x][pacmanSquare.y] = FLOOR_VALUE;
		            //sendNewTableData(pacmanSquare.x, pacmanSquare.y, FLOOR_VALUE);
		            sendBoardUpdate(pacmanSquare.x, pacmanSquare.y, FLOOR_VALUE);
		        }
		    }
		}
	};

	this.updateCharacter = function(character){
		//console.log(character.image);
		//this.imageTop = character.imageTop;
		//this.imageLeft = character.imageLeft;

		if(this.image){
		    this.image.style.top = character.imageTop;
		    
		    this.image.style.left = character.imageLeft;
		}
	    
		this.setInput(character.currentInput);
		if(this.theID === 'pacman-gif'){
			this.changeDirection(character.currentInput);
		}
	}

}


function isNextSquareWall(nextX, nextY){
    if (nextX < 0 || nextX > mazeTable.length || nextY < 0 || nextY > mazeTable[0].length){
        return true;
    }
    if (mazeTable[nextX][nextY] == WALL_VALUE){
        return true;
    }
    return false;
}

function getNextSquare(currentX, currentY, currentDirection){
    var nextSquare;
    switch(currentDirection){
        case MovementEnum.UP:
            nextSquare = {x: currentX - 1, y: currentY};
            break;
        case MovementEnum.RIGHT:
            nextSquare = {x: currentX, y: currentY + 1};
            break;
        case MovementEnum.DOWN:
            nextSquare = {x: currentX + 1, y: currentY};
            break;
        case MovementEnum.LEFT:
            nextSquare = {x: currentX, y: currentY - 1};
            break;
    }
    return nextSquare;
}

function isCollision(rect1, rect2){
    return !(rect1.right < rect2.left ||
    rect1.left > rect2.right ||
    rect1.bottom < rect2.top ||
    rect1.top > rect2.bottom);
}

function getSquareForObject(elementId){
    var coordinate;
    var givenElement = document.getElementById(elementId);
    for (var i = 0; i < gridWidth; i++){
        for (var j = 0; j < gridHeight; j++){
            var squareElement = document.getElementById("x_" + i + "-y_" + j);
            gridSquare = squareElement.getBoundingClientRect();
            givenRect = givenElement.getBoundingClientRect();
            var givenRectCenter;
            givenRectCenter = {x: (givenRect.left + (givenRect.width / 2)), y: givenRect.top + (givenRect.height / 2)};
            var isElementInSquare = doesRectContainPoint(gridSquare, givenRectCenter);
            if (isElementInSquare){
                var squareCoords = {x: i, y: j};
                return squareCoords;
            }
        }
    }
    var squareCoords = {x: -1, y: -1};
    return squareCoords;
}

function doesRectContainPoint(rect, point){
    if (point.x <= rect.right && point.x >= rect.left && point.y <= rect.bottom && point.y >= rect.top){
        return true;
    }
    return false;
}

function setPixelsPerTick(){

	var tableData = document.getElementById("x_" + this.startingX + "-y_" + this.startingY);
	if(tableData != null){
		pixelsPerTick = tableData.style.width * 0.5;
	}
}

