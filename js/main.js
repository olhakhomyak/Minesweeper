/**
 * Set field size
 * @type {{rows: number, cols: number, width: number, height: number}}
 */
var field = {
    rows: 10,
    cols: 10,
    width: 51,
    height: 51
};
var ctx, bg, mX, mY, clickedX, clickedY, count, none, sign;
var bombs = [];
var openedBoxes = [];


window.onload = function () {
    var canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    init()
};


/**
 * Define (X, Y) coordinates for selected box
 */
window.onclick = function (e) {
    mX = e.pageX;
    mY = e.pageY;

    if (Math.floor(mX / field.width) < field.cols && Math.floor(mY / field.height) < field.rows) {
        clickedX = Math.floor(mX / field.width);
        clickedY = Math.floor(mY / field.height);
    }


    /**
     * If was clicked (X, Y) coordinates of bomb
     */
    var chosenBomb = false;
    for (var i = 0; i < 10; i++) {
        if (clickedX == bombs[i][0] && clickedY == bombs[i][1]) {
            chosenBomb = true;
            lose();
        }
    }

    /**
     * If was clicked (X, Y) coordinates of empty box
     */
    if (chosenBomb == false && mX < field.rows * field.width && mY < field.cols * field.height) {
        var allClicks = rOpenedBoxes.length + openedBoxes.length;
        if (allClicks == 100) {
            win();
        }

        nextStep(clickedX, clickedY);
    }
};


/**
 * Set sign for box with bomb with right click
 */
var rClickedX, rClickedY;
var rClick = 0;
var rOpenedBoxes = [];

window.oncontextmenu = function (e) {
    e.preventDefault();

    /**
     * Define (X, Y) coordinates for selected by right click box
     */
    mX = e.pageX;
    mY = e.pageY;

    if (Math.floor(mX / field.width) < field.cols && Math.floor(mY / field.height) < field.rows) {
        rClickedX = Math.floor(mX / field.width);
        rClickedY = Math.floor(mY / field.height);
    }

    var inROpenedBoxes = [false, 0];
    for (i in rOpenedBoxes) {
        if (rOpenedBoxes[i][0] == rClickedX && rOpenedBoxes[i][1] == rClickedY) {
            inROpenedBoxes = [true, i];
        }
    }

    /**
     * Count red signs for boxes with bomb, only 10 are allowed
     * Count opened boxes
     */
    if (inROpenedBoxes[0] == false) {
        if (rOpenedBoxes.length < 10) {
            rClick++;
            var n = rOpenedBoxes.length;
            rOpenedBoxes[n] = [];
            rOpenedBoxes[n][0] = rClickedX;
            rOpenedBoxes[n][1] = rClickedY;

            var allClicks = rOpenedBoxes.length + openedBoxes.length;

            if (allClicks == 100) {
                win();
            }
        }
    } else {
        rOpenedBoxes.splice(inROpenedBoxes[1], 1);
    }

    draw();
};


/**
 * Initialize
 */
function init() {
    bg = new Image();
    count = new Image();
    none = new Image();
    sign = new Image();
    bg.src = "img/plain.jpg";
    count.src = "img/closeToBomb.png";
    none.src = "img/empty.png";
    sign.src = "img/sign.jpg";


    /**
     * Set bombs (X, Y) coordinate on the game field
     */
    for (var i = 0; i < 10; i++) {
        bombs[i] = [
            Math.floor(Math.random() * 10),
            Math.floor(Math.random() * 10)
        ]
    }

    draw();
}


/**
 * Setup the game field
 */
function draw() {
    ctx.clearRect(0, 0, 400, 400);
    for (var i = 0; i < field.rows; i++) {
        for (var k = 0; k < field.cols; k++) {
            var x = k * field.width;
            var y = i * field.height;

            var wasOpened = [0, false];
            if (openedBoxes.length > 0) {
                for (var n = 0; n < openedBoxes.length; n++) {
                    if (openedBoxes[n][0] == k && openedBoxes[n][1] == i) {
                        wasOpened = [n, true];
                    }
                }
            }
            if (wasOpened[1] == true) {
                if (openedBoxes[(wasOpened[0])][2] > 0) {
                    ctx.drawImage(count, x, y);
                } else {
                    ctx.drawImage(none, x, y);
                }
            } else {
                var rWasOpened = [0, false];
                if (rOpenedBoxes.length > 0) {
                    for (var n = 0; n < rOpenedBoxes.length; n++) {
                        if (rOpenedBoxes[n][0] == k && rOpenedBoxes[n][1] == i) {
                            rWasOpened = [n, true];
                        }
                    }
                }

                if (rWasOpened[1] == true) {
                    ctx.drawImage(sign, x, y);
                } else {
                    ctx.drawImage(bg, x, y);
                }
            }
        }
    }

    for (i in openedBoxes) {
        if (openedBoxes[i][2] > 0) {
            ctx.font = "24px arial";
            ctx.fillText(openedBoxes[i][2], openedBoxes[i][0] * field.width + 10, openedBoxes[i][1] * field.height + 20);
        }
    }
}


function nextStep(x, y) {
    var boxesAround = [
        [-1, -1],
        [0, -1],
        [1, -1],
        [1, 0],
        [1, 1],
        [0, 1],
        [-1, 1],
        [-1, 0]
    ];

    var bombsCount = 0;
    for (var i  in boxesAround) {
        for (var k = 0; k < 10; k++) {
            if (checkAround(k, x + boxesAround[i][0], y + boxesAround[i][1]) == true) {
                bombsCount++;
            }
        }
    }


    for (m in rOpenedBoxes) {
        if (rOpenedBoxes[m][0] == x && rOpenedBoxes[m][1] == 1) {
            rOpenedBoxes.splice(m, 1);
        }
    }

    var clicked = false;

    for (p in openedBoxes) {
        if (openedBoxes[p][0] == x && openedBoxes[p][1] == y) {
            clicked = true;
        }
    }

    if (clicked == false) {
        openedBoxes[(openedBoxes.length)] = [x, y, bombsCount];
    }


    if (bombsCount == 0) {
        for (i in boxesAround) {
            if (x + boxesAround[i][0] >= 0 && x + boxesAround[i][0] <= 9 &&
                y + boxesAround[i][1] >= 0 && y + boxesAround[i][1] <= 9) {
                var x1 = x + boxesAround[i][0];
                var y1 = y + boxesAround[i][1];

                var alreadyOpened = false;
                for (n in openedBoxes) {
                    if (openedBoxes[n][0] == x1 && openedBoxes[n][1] == y1) {
                        alreadyOpened = true;
                    }
                }
                if (alreadyOpened == false) {
                    nextStep(x1, y1);
                }
            }
        }
    }

    draw();
}


/**
 * @param i
 * @param x
 * @param y
 * @returns {boolean}
 */
function checkAround(i, x, y) {
    if (bombs[i][0] == x && bombs[i][1] == y) {
        return true;
    }
}


/**
 * If all fields were opened
 */
function win() {
    alert("Congratulations! You won!");

    restart();
}


/**
 *Finish the game if bomb was selected,
 * Open new game
 */
function lose() {
    alert("Bomb! Game over");

    restart();
}


/**
 * Start the new game
 */
function restart() {
    bombs = [];
    openedBoxes = [];
    rOpenedBoxes = [];

    init();
}