

var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');

var x = canvas.width / 2;
var y = canvas.height - 30;
var dx = 1;
var dy = -1;
var i = 60;
var ballRadius = 10;

var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = ((canvas.width - paddleWidth) / 2);

var rightPressed = false;
var leftPressed = false;

var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

var score = 0;

var bricks = [];

for (c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (var r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

function drawBricks() {
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {

            var brick = bricks[c][r];

            if (brick.status == 1) {

                var brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                var brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;

                brick.x = brickX;
                brick.y = brickY;

                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#551A8B";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function collisionDetection() {
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            var b = bricks[c][r];
            if (b.status == 1) {
                if ((x > b.x) && (x < b.x + brickWidth) && (y < b.y) && (y < b.y + brickHeight)) {
                    dy = -dy;
                    b.status = 0;
                    score++;

                    if (score == brickRowCount * brickColumnCount) {
                        document.getElementById("myCanvas").style.background = "Green";
                        alert("YOU WIN!");
                        document.location.reload();
                    }
                }
            }
        }
    }
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("SCORE: " + score, 8, 20);

}

function keyDownHandler(e) {
    if (e.keyCode === 39) {
        rightPressed = true;
    } else if (e.keyCode === 37) {
        leftPressed = true
    }
}

function keyUpHandler(e) {
    if (e.keyCode === 39) {
        rightPressed = false;
    } else if (e.keyCode === 37) {
        leftPressed = false
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = animateColors(i);
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = getRandomColor();
    ctx.fill();
    ctx.closePath();
}

function getHue(i) {
    return 1 / 0.2 * (i) * 210;
}


function animateColors(i) {
    var j = i + 60;
    var k = i + 120;
    var val = getHue(i);
    var col = 'hsla(' + val + ', 90%, 60%, 1)';
    var c2 = 'hsla(' + getHue(j) + ', 90%, 60%, 1)';
    var c3 = 'hsla(' + getHue(k) + ', 90%, 60%, 1)';
    i = (i < 180) ? i + 1 : 0;
    j = (j < 180) ? j + 1 : 0;
    k = (k < 180) ? k + 1 : 0;
    return col;
}


function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    collisionDetection();

    if (y + dy < ballRadius) {
        dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {

        if ((x > paddleX) && (x < (paddleX + paddleWidth))) {
            dy = -dy;
        }
        else {
            document.getElementById("myCanvas").style.background = "Red";
            document.location.reload();
        }
    }

    if ((x + dx > canvas.width - ballRadius) || (x + dx < ballRadius)) {
        dx = -dx;
    }

    if (rightPressed && (paddleX < (canvas.width - paddleWidth))) {
        paddleX += 3;
    }
    else if (leftPressed && (paddleX > 0)) {
        paddleX -= 3;
    }

    x += dx;
    y += dy;
}

document.addEventListener("mousemove", mouseMoveHandler);

function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    var halfPaddleWidth = paddleWidth / 2;
    if ((relativeX > halfPaddleWidth) && (relativeX < (canvas.width - halfPaddleWidth))) {
        paddleX = relativeX - halfPaddleWidth;
    }
}

setInterval(draw, 5);