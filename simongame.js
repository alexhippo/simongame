var game = {
    colours: ["green", "red", "yellow", "blue"],
    series: [],
    playersTurn: false,
    checkpoint: 0,
    timeToChoose: 0,
    time: 0,
    gameInProgress: false,
    strictMode: false,
    victory: false,
    sound: {
        greenSound: document.getElementById("greenSound"),
        redSound: document.getElementById("redSound"),
        yellowSound: document.getElementById("yellowSound"),
        blueSound: document.getElementById("blueSound"),
        correctSound: document.getElementById("correctSound"),
        wrongSound: document.getElementById("wrongSound"),
        victorySound: document.getElementById("victorySound")
    }
};

//Animation/Sounds/Styling
function buttonPress(id) {
    "use strict";
    document.getElementById(id).className = "navbarcell";
    
    setTimeout(function () {
        document.getElementById(id).className = "dark navbarcell";
    }, 500);
}

function darkColour(id) {
    "use strict";
    document.getElementById(id).className = "dark square";
}

function lightColour(id) {
    "use strict";
    document.getElementById(id).className = "square";
    
    switch (id) {
    case "green":
        game.sound.greenSound.play();
        break;
    case "red":
        game.sound.redSound.play();
        break;
    case "yellow":
        game.sound.yellowSound.play();
        break;
    case "blue":
        game.sound.blueSound.play();
        break;
    }
    
    setTimeout(function () {
        darkColour(id);
    }, 300);
}

function bounceSign(scenario) {
    "use strict";
    document.getElementById(scenario).className = "bounceOutAndUp";
    document.getElementById(scenario).style.visibility = "visible";
    
    setTimeout(function () {
        document.getElementById(scenario).className -= "bounceOutAndUp";
        document.getElementById(scenario).style.visibility = "hidden";
    }, 1500);
}

function winningSeries() {
    "use strict";
    var i = 0;
    for (i = 0; i < game.series.length; i += 1) {
        (function (i) {
            setTimeout(function () {
                document.getElementById(game.series[i]).className = "square";
                setTimeout(function () {
                    darkColour(game.series[i]);
                }, 200);
            }, 300 * i);
        }(i));
    }
}

//Gameplay
function setStrictMode(status) {
    "use strict";
    game.strictMode = status;
    buttonPress("strict");
    if (status === true) {
        document.getElementById("strict").innerHTML = '<i class="fa fa-toggle-on" aria-hidden="true" onclick="setStrictMode(false);"></i>';
    } else {
        document.getElementById("strict").innerHTML = '<i class="fa fa-toggle-off" aria-hidden="true" onclick="setStrictMode(true);"></i>';
    }
}

function chooseSeriesColour() {
    "use strict";
    var id = game.colours[Math.floor(Math.random() * game.colours.length)];
    game.series.push(id);
    document.getElementById("count").textContent = game.series.length;
}

function timeLimit() {
    "use strict";
    game.timeToChoose = setInterval(function () {
        game.time += 1;
        if (game.time === 3) {
            check("wrong");
            clearInterval(game.timeToChoose);
            game.time = 0;
        }
    }, 1000);
}

function victory() {
    "use strict";
    game.sound.victorySound.play();
    game.victory = true;
    game.playersTurn = false;
    game.checkpoint = 0;
    setTimeout(winningSeries, 500);
    setTimeout(function () {
        game.sound.victorySound.pause();
        game.sound.victorySound.currentTime = 0;
        game.series.length = 0;
        document.getElementById("count").textContent = 0;
        game.gameInProgress = false;
        game.victory = false;
    }, 8000);
}

function presentSeries() {
    "use strict";
    var seriesTime = 2000,
        i = 0;
    //decrease time in between colours being presented as series length increases
    if (game.series.length >= 15) {
        seriesTime = 700;
    } else if (game.series.length >= 10) {
        seriesTime = 1000;
    } else if (game.series.length >= 5) {
        seriesTime = 1500;
    }
    
    game.playersTurn = false;
    
    for (i = 0; i < game.series.length; i += 1) {
        (function (i) {
            setTimeout(function () {
                lightColour(game.series[i]);
                if (Number(i) === (game.series.length - 1)) {
                    setTimeout(function () {
                        game.playersTurn = true;
                        timeLimit();
                    }, 1000);
                }
            }, seriesTime * i);
        }(i));
    }
}

function chooseAndPresentSeries() {
    "use strict";
    chooseSeriesColour();
    presentSeries();
}

function reset() {
    "use strict";
    if ((game.series.length === 0) || (game.gameInProgress === false) || (game.victory === true)) {
        return false;
    } else {
        game.series.length = 0;
        game.checkpoint = 0;
        setTimeout(chooseAndPresentSeries, 500);
        clearInterval(game.timeToChoose);
        game.time = 0;
        buttonPress("reset");
    }
}

function wrongPlay() {
    "use strict";
    clearInterval(game.timeToChoose);
    game.time = 0;
    game.playersTurn = false;
    game.checkpoint = 0;
    bounceSign("wrong");
    game.sound.wrongSound.play();
}

function check(id) {
    "use strict";
    if (game.playersTurn === false) {
        return false;
    } else {
        //use checkpoint to check against the last colour pressed and the next point in the series array.
        if (id === game.series[game.checkpoint]) {
        //correct - if checkpoint and last colour pressed matches
            if (game.checkpoint < game.series.length - 1) {
                game.checkpoint += 1;
                game.playersTurn = true;
                setTimeout(timeLimit, 200);
            } else {
                if (game.series.length === 20) {
                    victory();
                    bounceSign("win");
                } else {
                    game.checkpoint = 0;
                    game.playersTurn = false;
                    setTimeout(chooseAndPresentSeries, 2000);
                    bounceSign("correct");
                    setTimeout(function () {
                        game.sound.correctSound.play();
                    }, 500);
                }
            }
        } else {
        //wrong - if checkpoint and last colour pressed doesn't match
            if (game.strictMode === true) {
                setTimeout(reset, 1500);
                wrongPlay();
            } else {
                setTimeout(presentSeries, 1500);
                wrongPlay();
            }
        }
    }
}

function start() {
    "use strict";
    if ((game.playersTurn === true) || (game.gameInProgress === true)) {
        return false;
    } else {
        chooseAndPresentSeries();
        game.gameInProgress = true;
    }
    buttonPress("start");
}

function playerPressColour(id) {
    "use strict";
    if ((game.playersTurn === false) || (game.time === 3)) {
        return false;
    } else {
        clearInterval(game.timeToChoose);
        check(id);
        game.time = 0;
        lightColour(id);
    }
}

//Help section
function showInstructions() {
    "use strict";
    document.getElementById("howtoplay").style.visibility = "visible";
    document.getElementById("overlay").style.visibility = "visible";
    buttonPress("help");
}

function closeInstructions() {
    "use strict";
    document.getElementById("howtoplay").style.visibility = "hidden";
    document.getElementById("overlay").style.visibility = "hidden";
}