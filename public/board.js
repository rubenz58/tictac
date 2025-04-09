// Board Obj.
export default class Board {

    constructor() {
        this.numRows = 3;
        this.numCols = 3;
        this.playerTurn = "X";
        this.gameOver = false;

        // Have to initialize a 3x3 grid with nulls.
        this.grid = this.initializeArray();

        // Used to check if the game is over.
        this.movesRemaining = 9;
    }

    // Initalizes 2D array with null values.
    initializeArray() {
        this.grid = new Array(3);

        for (let i = 0; i < 3; i++) {
            this.grid[i] = ["8", "8", "8"];
        }

        return this.grid;
    }

    placeMove(row, col) {
        this.grid[row][col] = this.playerTurn;
    }

    // Checks if the game is over.
    isGameOver() {
        // 0. if checkWinner(); -> Game is Over
        if (this.checkWinner()) {
            this.gameOver = true;
            return true;
        }

        // 1. If movesRemaining > 0 -> not over
        if (this.movesRemaining > 0) {return false}

        // 2. If movesRemaining = 0 -> Game is over and Tie.
        // Tie indicated with playerTurn = "8";
        if (this.movesRemaining === 0) {
            this.playerTurn = "8";
            this.gameOver = true;
            return true;
        }
    }

    // Checks the specific conditions.
    checkWinner() {
        let ret = false;
        if (this.grid[0][0] != "8") {
            // From top left
            // Horizontal
            if (this.grid[0][0] === this.grid[0][1] && this.grid[0][0] === this.grid[0][2]) {ret = true}
            // Vertical
            if (this.grid[0][0] === this.grid[1][0] && this.grid[0][0] === this.grid[2][0]) {ret = true}
        }
        if (this.grid[2][2] != "8") {
            // From bottom right
            // Vertical
            if (this.grid[2][2] === this.grid[2][1] && this.grid[2][2] === this.grid[2][0]) {ret = true}
            // Horizontal
            if (this.grid[2][2] === this.grid[1][2] && this.grid[2][2] === this.grid[0][2]) {ret = true}
        }
        if (this.grid[1][1] != "8") {
            // From middle
            // Horizontal
            if (this.grid[1][1] === this.grid[1][0] && this.grid[1][1] === this.grid[1][2]) {ret = true}

            // Vertical
            if (this.grid[1][1] === this.grid[0][1] && this.grid[1][1] === this.grid[2][1]) {ret = true}

            // Diagonal
            if (this.grid[1][1] === this.grid[0][0] && this.grid[1][1] === this.grid[2][2]) {ret = true}
            if (this.grid[1][1] === this.grid[2][0] && this.grid[1][1] === this.grid[0][2]) {ret = true}
        }

        return ret;

    }


}