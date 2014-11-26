var App;
(function (App) {
    var Game = (function () {
        function Game(elapsedSeconds, width, height, minesCount) {
            this.elapsedSeconds = elapsedSeconds;
            this.width = width;
            this.height = height;
            this.minesCount = minesCount;

            this.initializeTimer();

            this.drawMines('mines');
            this.generateField();
            this.buttons = document.getElementsByName('btn');

            this.initializeGame();
        }
        Game.prototype.initializeTimer = function () {
            var self = this;
            this.interval = setInterval(function () {
                self.elapsedSeconds++;
                document.getElementById('timer').innerHTML = self.elapsedSeconds.toString();
            }, 1000);
        };

        Game.prototype.drawMines = function (elementId) {
            var div = document.getElementById(elementId);
            div.innerHTML = '';
            for (var i = 0; i < this.height; i++) {
                for (var j = 0; j < this.width; j++) {
                    div.innerHTML += '<input type="button" name="btn" id="' + i + '_' + j + '" style="width:25px; height:25px" value=" "/>';
                }
                div.innerHTML += '<br/>';
            }
        };

        Game.prototype.generateField = function () {
            var field = this.makeMatrix();
            var minesCounter = 0;
            var n;

            while (minesCounter < this.minesCount) {
                var randomMine = this.getRandom(0, 1);
                var randomPosition = [this.getRandom(0, this.width - 1), this.getRandom(0, this.height - 1)];

                if (!field[randomPosition[0]][randomPosition[1]]) {
                    minesCounter += (randomMine) ? 1 : 0;

                    if (randomMine) {
                        field[randomPosition[0]][randomPosition[1]] = -10;

                        for (var x = randomPosition[0] - 1; x <= randomPosition[0] + 1; x++) {
                            for (var y = randomPosition[1] - 1; y <= randomPosition[1] + 1; y++) {
                                try  {
                                    n = +field[x][y];
                                    if (field[x][y] != -10) {
                                        n += 1;
                                        field[x][y] = n;
                                    }
                                } catch (e) {
                                }
                            }
                        }
                    }
                }
            }
            this.matrix = field;
        };

        Game.prototype.makeMatrix = function () {
            var matrix;
            matrix = new Array(this.height);

            for (var i = 0; i < this.height; i++) {
                matrix[i] = new Array(this.width);

                for (var j = 0; j < this.width; j++) {
                    matrix[i][j] = 0;
                }
            }
            return matrix;
        };

        Game.prototype.getRandom = function (min, max) {
            return Math.floor(Math.random() * (max - min + 1));
        };

        Game.prototype.initializeGame = function () {
            var _this = this;
            var self = this;
            for (var i = 0; i < this.buttons.length; i++) {
                document.getElementById(this.buttons[i].id).onclick = function (e) {
                    var event;
                    event = e;
                    var point = event.target.id.split('_');
                    var value = self.matrix[parseInt(point[0])][parseInt(point[1])];

                    if (self.matrix[parseInt(point[0])][parseInt(point[1])] == -10) {
                        event.target.value = '*';
                        alert('You lose!');
                        location.href = location.href;
                    } else {
                        self.expand(parseInt(point[0]), parseInt(point[1]), _this.matrix);
                    }

                    if (self.isWinner(_this.width, _this.height, _this.minesCount)) {
                        alert('You win!');
                        location.href = location.href;
                    }
                };
            }
        };

        Game.prototype.isWinner = function (width, height, minesNumber) {
            var enabledCounter = 0;
            var btn;

            for (var y = 0; y < height; y++) {
                for (var x = 0; x < width; x++) {
                    btn = document.getElementById(x + '_' + y);

                    if (!btn.disabled) {
                        enabledCounter++;
                    }
                }
            }
            return enabledCounter == minesNumber;
        };

        Game.prototype.expand = function (x, y, matrix) {
            var btn;
            btn = document.getElementById(x + '_' + y);
            var value = matrix[x][y];

            if (btn.disabled) {
                return false;
            }

            if (value && value != '*') {
                btn.value = value;
                btn.disabled = 'true';
                return false;
            }

            if (!value) {
                btn.value = ' ';
                btn.disabled = 'true';
            }

            var limits = [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1], [x - 1, y - 1], [x + 1, y - 1], [x - 1, y + 1], [x + 1, y + 1]];

            for (var i = 0; i < limits.length; i++) {
                try  {
                    if (matrix[limits[i][0]][limits[i][1]] != '*') {
                        this.expand(limits[i][0], limits[i][1], matrix);
                    }
                } catch (e) {
                }
            }
        };
        return Game;
    })();
    App.Game = Game;
})(App || (App = {}));

window.onload = function () {
    var game = new App.Game(0, 10, 10, 10);
};
//# sourceMappingURL=app.js.map
