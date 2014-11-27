module App {
    export class Game {
        private elapsedSeconds: number;
        private width: number;
        private height: number; 
        private minesCount: number;
        private interval: number;
        private buttons: any;
        private matrix: number[][];

        constructor(elapsedSeconds: number, width: number, height: number, minesCount: number) {
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

        public initializeTimer() {
            var self = this;
            this.interval = setInterval(() => {
              self.elapsedSeconds++;
              document.getElementById('timer').innerHTML = self.elapsedSeconds.toString();  
            }, 1000);
        }

        public drawMines(elementId: string) {
            var div = document.getElementById(elementId);
            div.innerHTML = '';
            for (var i: number = 0; i < this.height; i++) {
                for (var j: number = 0; j < this.width; j++) {
                    div.innerHTML += '<input type="button" name="btn" id="' + i + '_' + j + '" style="width:25px; height:25px" value=" "/>';
                }
                div.innerHTML += '<br/>';
            } 
        }

        public generateField() {
            var field: number[][] = this.makeMatrix();
            var minesCounter: number = 0;
            var n: number;

            while (minesCounter < this.minesCount) {
                var randomMine: number = this.getRandom(0, 1);
                var randomPosition: number[] = [this.getRandom(0, this.width - 1), this.getRandom(0, this.height - 1)];

                if (!field[randomPosition[0]][randomPosition[1]]) {
                    minesCounter += (randomMine) ? 1 : 0;

                    if (randomMine) {
                        field[randomPosition[0]][randomPosition[1]] = -10;

                        for (var x: number = randomPosition[0] - 1; x <= randomPosition[0] + 1; x++) {

                            for (var y: number = randomPosition[1] - 1; y <= randomPosition[1] + 1; y++) {
                                try {
                                    n = +field[x][y];
                                    if (field[x][y] != -10) {
                                        n += 1;
                                        field[x][y] = n;
                                    }
                                } catch (e) { }//TypeError probablemente 
                            }
                        }
                    }
                }
            }
            this.matrix = field;
        }

        private makeMatrix() {
            var matrix: number[][];
            matrix = new Array(this.height);

            for (var i: number = 0; i < this.height; i++) {
                matrix[i] = new Array(this.width);

                for (var j: number = 0; j < this.width; j++) {
                    matrix[i][j] = 0;
                }
            }
            return matrix;
        }

        private getRandom(min: number, max: number) {
            return Math.floor(Math.random() * (max - min + 1));
        } 

        private initializeGame() {
            var self = this;
            for (var i: number = 0; i < this.buttons.length; i++) {
                document.getElementById(this.buttons[i].id).onclick = (e: any) => {
                    var point = e.target.id.split('_');
                    var value = self.matrix[parseInt(point[0])][parseInt(point[1])];

                    if (self.matrix[parseInt(point[0])][parseInt(point[1])] == -10) {
                        e.target.value = '*';
                        alert('You lose!');
                        location.href = location.href;
                    } else {
                        self.expand(parseInt(point[0]), parseInt(point[1]), this.matrix);
                    }

                    if (self.isWinner(this.width, this.height, this.minesCount)) {
                        alert('You win!');
                        location.href = location.href;
                    }
                }
            }
        }

        public isWinner(width: number, height: number, minesNumber: number) {
            var enabledCounter = 0;
            var btn: any;

            for (var y = 0; y < height; y++) {

                for (var x = 0; x < width; x++) {
                    btn = document.getElementById(x + '_' + y);

                    if (!btn.disabled) {
                        enabledCounter++;
                    }
                }
            }
            return enabledCounter == minesNumber;
        }

        private expand(x: number, y: number, matrix: any) {
            var btn: any;
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

            for (var i: number = 0; i < limits.length; i++) {
                try {

                    if (matrix[limits[i][0]][limits[i][1]] != '*') {
                        this.expand(limits[i][0], limits[i][1], matrix);
                    }
                } catch (e) { }
            }
        } 
    }
}

window.onload = () => {
    var game = new App.Game(0, 10, 10, 10);
};