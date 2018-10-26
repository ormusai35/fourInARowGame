var main = (function() {
    var canvas, context,currentPlayer, boardGame, winner, settings;
    
    settings = {
        disk: {
            diameter: 'default',
            padding: 8
        },
        target: 4,
        pageBackground: 'white'
    };
    
    function initGame() {
        currentPlayer = 'blue';
        boardGame = [
        ['', '', '', '', '', '', ''],
        ['', '', '', '', '', '', ''],
        ['', '', '', '', '', '', ''],
        ['', '', '', '', '', '', ''],
        ['', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '']
        ];
        winner = '';   
    }
    
    initGame();

    canvas = document.getElementById('board');
    context = canvas.getContext('2d');
    canvas.style.background = 'pirple';

    if (settings.disk.diameter == 'default')
    settings.disk.diameter = (canvas.width / 7) - (settings.disk.padding * 2);

    function updateCircles(x, y, fill) {
        context.beginPath();
        context.arc(x, y, settings.disk.diameter / 2, 0, 2 * Math.PI, false);
        context.fillStyle = fill;
        context.fill();
        context.lineWidth = 2;
    }
    
    function updateCircle(col, row, name) {
        var x = (canvas.width / 7) * (col + 1) - settings.disk.diameter / 2 - settings.disk.padding,
                y = canvas.height - ((canvas.height / 6) * (row + 1) - settings.disk.diameter / 2 - settings.disk.padding);
        switch (name) {
            case 'blue':
                updateCircles(x, y, 'blue');
                break;

            case 'yellow':
                updateCircles(x, y, 'yellow');
                break;

            default:
                updateCircles(x, y, settings.pageBackground);
        }

    }
    
    function updateScreen() {
        for (var row = 0; row < boardGame.length; row++) {
            for (var col = 0; col < boardGame[row].length; col++) {
                updateCircle(col, row, boardGame[row][col]);
            }
        }
    }

    function addDisk(col, name) {
        for (var row = 0; row < boardGame.length; row++) {
            if (boardGame[row][col] == '') {
                boardGame[row][col] = name;
                return true;
            }
        }
        return false;
    }
    
    function getCol(evt) {
        var rect = canvas.getBoundingClientRect(),
                x = evt.clientX - rect.left;
        return Math.floor(x / (settings.disk.diameter + (settings.disk.padding * 2)));
    }

    function reset() {
        context.clearRect(0, 0, canvas.width, canvas.height);
    }
    
    canvas.addEventListener('click', function(evt) {
            reset();
            if (winner != '') {
                    initGame();
            } else {
                if (currentPlayer == 'blue') {
                    addDisk(getCol(evt), 'blue');
                    currentPlayer = 'yellow';
                } else {
                    addDisk(getCol(evt), 'yellow');
                    currentPlayer = 'blue';
                }
            }
        updateScreen();
            boardChecking();
            AnnounceTheWinner();
    });
    
    function boardChecking() {
        for (var row = 0; row < boardGame.length; row++) {
            for (var col = 0; col < boardGame[row].length; col++) {
                if (row + settings.target <= boardGame.length)
                    checkUp(row, col);
                if (col + settings.target <= boardGame[row].length)
                    checkRight(row, col);
                if (row + settings.target <= boardGame.length && col >= settings.target - 1)
                    checkUpLeft(row, col);
                if (row + settings.target <= boardGame.length && col + settings.target - 1 <= boardGame.length)
                    checkUpRight(row, col);
            }
        }
    }

    function checkUp(row, col) {
        var count = 0;
        if (boardGame[row][col] != '') {
            for (var offset = 1; offset < settings.target; offset++) {
                if (boardGame[row + offset][col] != boardGame[row][col])
                    return;
                count++;
            }
        }
        if (count == settings.target - 1)
            {
                winner = boardGame[row][col]; 
            }
        }

    function checkRight(row, col) {
        var count = 0;
        if (boardGame[row][col] != '') {
            for (var offset = 1; offset < settings.target; offset++) {
                if (boardGame[row][col + offset] != boardGame[row][col])
                    return;
                count++;
            }
        }
        if (count == settings.target - 1)
            {
                winner = boardGame[row][col]; 
            }
    }

    function checkUpRight(row, col) {
        var count = 0;
        if (boardGame[row][col] != '') {
            for (var offset = 1; offset < settings.target; offset++) {
                if (boardGame[row + offset][col + offset] != boardGame[row][col])
                    return;
                count++;
            }
        }
        if (count == settings.target - 1)
            {
                winner = boardGame[row][col]; 
            }
    }

    function checkUpLeft(row, col) {
        var count = 0;
        if (boardGame[row][col] != '') {
            for (var offset = 1; offset < settings.target; offset++) {
                if (boardGame[row + offset][col - offset] != boardGame[row][col])
                    return;
                count++;
            }
        }
        if (count == settings.target - 1)
            {
                winner = boardGame[row][col]; 
            }
    }

    function editContext(text) {
        context.fillStyle = "black";
        context.font = 70 + "px " + "Ariel";
        context.fillText("Yellow is winning",canvas.width / 8, y = canvas.height / 8);
        var again = "Play again";
        context.fillText(again, (canvas.width - context.measureText(again).width) / 2, canvas.height - 8)
    }

    function AnnounceTheWinner() {
        if (winner == "blue")
            editContext("Blue is winning");
        else if (winner == "yellow")
            editContext("Yellow is winning");
    }
    
    updateScreen();
})();