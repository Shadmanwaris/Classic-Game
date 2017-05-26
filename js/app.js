var gamestate = true;

// Enemies our player must avoid
var Enemy = function(x, y, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.x = x;
    this.y = y;
    this.speed = Math.floor(Math.random() * 600 + 50);
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x = this.x + (this.speed * dt);
    //Generate enemy off canvas and its goes to end of canvas
    if (this.x > 505) {
        this.x = -50;
        audio.src = 'audio/smb_stomp.wav';
                audio.play();
        //Randomly generate the speed of the enemy
        this.speed = Math.floor(Math.random() * 600 + 100);
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(x, y) {
    this.x = 200; // initial position of Player at X axis.
    this.y = 400; // intial position of Player at Y axis.
    this.speed = Math.floor(Math.random() * 600 + 50); // No need of this
    this.sprite = 'images/char-boy.png'; // Player image
    this.lives = 3; // Player Max Lives
    this.score = 0; // initail score of player
};

Player.prototype.update = function() {
    if(this.y < 20) { // player should return to its inital position when it reaches water
        this.reset(); // brings player to initial position
    }
    if(this.collision()) { // Collision function will initiate when enemy collide with player.
        this.reset(); // When player collide with enemy the player will move back to original position.
    }
    if(this.lives === 0) { // When player lives reaches zero .
        this.reset(); //Player will move back to initial position
        gamestate = false; // Game will end.
    }
    if(this.score===100) {
        gamestate=false;
    }
};

// This function will keep check the collision between enemy and player
// For loop keep track of randomly generated enemy at differen position.
// the player position and the enemy postion is checked wheteher they
// at same postion or not if the botton reaches paticular tile at the
// same time then lives of player will be reduced by one and Player will
// move back to its original position.

Player.prototype.collision = function() {
    for(var i=0; i < allEnemies.length; i++) {
    if(this.x < allEnemies[i].x + 50 && this.x + 50 > allEnemies[i].x && this.y < allEnemies[i].y + 30 && this.y + 30 > allEnemies[i].y) {
        this.lives--;
        audio.src = 'audio/smb_pipe.wav';
        audio.play();
        this.reset();
        break;
        }

    }
};

// This will reset the position of the player, scores and lives.

Player.prototype.reset = function() {
    this.x = 202;
    this.y = 404;
    document.getElementsByClassName('lives')[0].innerHTML = 'Lives: ' + this.lives;
    document.getElementsByClassName('score')[0].innerHTML = 'Score: ' + this.score;
};

Player.prototype.render = function (x, y) {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

    if (this.lives === 0 || this.lives < 0) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(0, 83-31, 505, 606);

        ctx.font ="64px impact";
        ctx.fillStyle = "white";
        ctx.fillText ("YOU LOST", 140, 300);

        ctx.strokestyle = "black";
        ctx.lineWidth = 2;
        ctx.strokeText ("YOU LOST", 140, 300);

        ctx.font ="40px impact";
        ctx.fillStyle = "white";
        ctx.fillText ("Try Again", 180, 400);
        ctx.fillText ("Press Spacebar", 135, 450);

        ctx.strokestyle = "black";
        ctx.lineWidth = 2;
        ctx.strokeText ("Try Again", 180, 400);
        ctx.strokeText ("Press Spacebar", 135, 450);
    }

    if(this.score === 100) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(0, 83-31, 505, 606);

        ctx.font ="64px impact";
        ctx.fillStyle = "white";
        ctx.fillText ("YOU WON", 140, 300);

        ctx.strokestyle = "black";
        ctx.lineWidth = 2;
        ctx.strokeText ("YOU WON", 140, 300);

        ctx.font ="40px impact";
        ctx.fillStyle = "white";
        ctx.fillText ("Play Again", 170, 400);
        ctx.fillText ("Press Spacebar", 135, 450);

        ctx.strokestyle = "black";
        ctx.lineWidth = 2;
        ctx.strokeText ("Play Again", 170, 400);
        ctx.strokeText ("Press Spacebar", 135, 450);
    }
};

//Keyboard input to move the player

Player.prototype.handleInput = function(key) {
    if (gamestate) {
        switch (key) {
            case 'left' :
                if (this.x > 83) {
                    this.x -= 101;
                }
                break;
            case 'up' :
                if (this.y > 101) {
                    this.y -= 83;
                } else {
                    this.score += 20;
                    audio.src = 'audio/smb_coin.wav';
                    audio.play();
                    this.reset();
                }
                break;
            case 'right' :
                if (this.x < 400) {
                    this.x += 101;
                }
                break;
            case 'down' :
                if (this.y < 400) {
                    this.y += 83;
                }
                break;
        }
    }
    else if (gamestate === false) {
        switch (key) {
            case 'reset' :
                audio.src = 'audio/smb_powerup.wav';
                audio.play();
                this.lives = 3;
                this.score = 0;
                this.reset();
                gamestate = true;
                break;
        }
    }
};



// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
var allEnemies = [];
for (var i = 0; i < 3; i++) {
    allEnemies.push(new Enemy(-101,55 + (83*i)));
}
// Place the player object in a variable called player
var player = new Player();

var audio = new Audio();


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        32: 'reset'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
