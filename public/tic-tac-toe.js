// Your code here
import Board from "./board.js";

// An additional step would be
// When giving up -> reloading -> instead of showing the previous winner
// it says, status in progress. Minor detail.

let board = new Board(); // creates a new game board
const cachedXImage = new Image();
const cachedOImage = new Image();

window.addEventListener('DOMContentLoaded', event => {

    console.log("DOM load.");



    // 1. Create the structure upon load
    // 1.1. Adding the individual divs.
    let parent_div = document.getElementById("parent");

    const dim = 3;
    for (let i = 0; i < dim; i++) {
        for (let j = 0; j < dim; j++) {
            let child_div = document.createElement("div");
            // Add the row/col data as the div id
            child_div.setAttribute("data-id", i.toString() + j.toString());
            child_div.id = i.toString() + j.toString();
            parent_div.append(child_div);
        }
    }

    // 1.2. Load the images once so I don't have to do a bunch of GET requests.
    cachedXImage.src = "/images/player-x.svg";
    cachedOImage.src = "/images/player-o.svg";

    // 1.3 Load the game state if there is one available.
    loadGameState();

    // 2. User clicks a square.
    // Listening on the parent. Can get the div based on the event info? Yes -> event.target.id
    const click_listener = document.getElementById("parent");
    // This click listener is only valid inside the parent world.
    // So we are already JUST listening for clicks in this div -> Doesn't affect the buttons at the bottom.
    click_listener.addEventListener("click", event => {

        // Single variable to stop clicks once the game is over
        // console.log("click: " + event.target.id);
        if (!board.gameOver) {
            console.log("not over");
            // boardState();

            // 1. Parse target data for row and col
            let id = event.target.dataset.id;
            let row = Number(id.charAt(0));
            let col = Number(id.charAt(1));

            // 2. Check the board if it's not occupied.
            if (board.grid[row][col] === "8") {
                // Empty -> Valid Move
                // Add either X or O
                const box = document.getElementById(event.target.dataset.id);
                const newImage = document.createElement("img");

                // Update Graphics
                if (board.playerTurn === "X") {
                    console.log("XXX");
                    newImage.src = cachedXImage.src;
                    box.append(newImage);
                } else {
                    console.log("OOO");
                    newImage.src = cachedOImage.src;
                    box.append(newImage);
                }
                
                // Update variables after the move
                board.movesRemaining--;
                board.placeMove(row, col);

                // Check if the game is over
                if (board.isGameOver() && board.playerTurn != "8") {
                    // "Game Over" writing
                    let text = board.playerTurn + " wins the game";
                    console.log(text);
                    let title = document.getElementById("status");
                    title.innerText = text;
                } else if (board.isGameOver() && board.playerTurn === "8") {
                    let text = "It's a draw";
                    console.log(text);
                    let title = document.getElementById("status");
                    title.innerText = text;
                }

                // Not over. Swap player turn.
                if (board.playerTurn === "X") {board.playerTurn = "O"}
                else {board.playerTurn = "X"}

                saveGameState();
            }
        }

    });

    // New Game button.
    const new_game_listener = document.getElementById("button1");
    new_game_listener.addEventListener("click", event => {

        // The game is over so the button can be clicked
        if (board.gameOver) {

            // Reset everything.
            // 1. Header.
            let text = "Status: in progress";
            console.log(text);
            let title = document.getElementById("status");
            title.innerText = text;

            // 2. Reset the board object.
            board.initializeArray();
            board.playerTurn = "X";
            board.gameOver = false;
            board.movesRemaining = 9;

            // 3. Remove the images from the UI
            // Iterate through the divs and remove <img> element
            const parent_div = document.getElementById("parent");
            // const child_nodes = parent_div.children;
            const child_nodes = Array.from(parent_div.children);

            console.log(child_nodes);

            child_nodes.forEach((e) => {
                e.innerText = '';
            });

            deleteState();

        }

    });

    // Give Up Button.
    const giveup_listener = document.getElementById("button2");
    giveup_listener.addEventListener("click", event => {

        if (!board.gameOver) {
            if (board.playerTurn === "X") {
                let text = "O wins the game";
                console.log(text);
                let title = document.getElementById("status");
                title.innerText = text;
            } else {
                let text = "X wins the game";
                console.log(text);
                let title = document.getElementById("status");
                title.innerText = text;
            }
            
            board.gameOver = true;

            saveGameState();

        }

    });

});

function saveGameState() {

    // Have to save all the board info
    const player = "playerTurn=" + board.playerTurn;
    const gameStatus = "gameOver=" + board.gameOver.toString();
    const moves = "movesRemaining=" + board.movesRemaining.toString();
    let boardAcc = "";

    for (let i = 0; i < board.grid.length; i++) {
        for (let j = 0; j<board.grid[i].length; j++) {
            boardAcc += board.grid[i][j];
        }
    }
    const boardState = "boardState=" + boardAcc;

    document.cookie = player;
    document.cookie = gameStatus;
    document.cookie = moves;
    document.cookie = boardState;
}


function loadGameState() {

    // console.log(document.cookie);
    let cookie_info = document.cookie.split(";");
    console.log("loading");
    console.log(cookie_info);

    // Check if cookie exists
    if (cookie_info[1]) {

        // Cookies are not saving in a consistent order. So have to parse to make
        // sure I'm assigning the correct elements at each step.
        console.log("Have game state to load");

        let player_turn_retrieved;
        let game_over_retrieved;
        let moves_remaining_retrieved;
        let board_state_retrieved;


        // Assign the correct variables.
        for (let i = 0; i < 4; i++) {
            let key = cookie_info[i].split("=")[0].trim();

            if (key === "playerTurn") {
                player_turn_retrieved = cookie_info[i].split("=")[1];
                console.log("playerTurn: " + player_turn_retrieved);

            } else if (key === "gameOver") {
                game_over_retrieved = cookie_info[i].split("=")[1];
                console.log("gameOver: " + game_over_retrieved);

            } else if (key === "movesRemaining") {
                moves_remaining_retrieved = cookie_info[i].split("=")[1];
                console.log("moveRemaining: " + moves_remaining_retrieved);

            } else if (key === "boardState") {
                board_state_retrieved = cookie_info[i].split("=")[1];
                console.log("boardState: " + board_state_retrieved);
            }
        }


        // Set the board variables
        if (game_over_retrieved == "true") {
            // console.log("Setting the game over variable to true");
            board.gameOver = true;
        } else {board.gameOver = false}

        board.playerTurn = player_turn_retrieved.toString();
        board.movesRemaining = Number(moves_remaining_retrieved);

        for (let i = 0; i < board.grid.length; i++) {
            for (let j = 0; j<board.grid[i].length; j++) {
                board.grid[i][j] = board_state_retrieved.charAt((i*3) + j);
            }
        }

        // Have to update the UI
        // let parent_div = document.getElementById("parent");
        for (let i = 0; i < board.grid.length; i++) {
            for (let j = 0; j<board.grid[i].length; j++) {
                
                // Adds all the correct X and O images
                const box = document.getElementById(i.toString() + j.toString());
                const newImage = document.createElement("img");

                if (board_state_retrieved.charAt((i*3) + j) === "X") {
                    newImage.src = cachedXImage.src;
                    box.append(newImage);

                } else if (board_state_retrieved.charAt((i*3) + j) === "O") {
                    newImage.src = cachedOImage.src;
                    box.append(newImage);

                }

            }
        }

    } else {

    }

    console.log("done loading");

}

function deleteState() {
    // Delete the cookies
    document.cookie = "playerTurn=; expires = Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "gameOver=; expires = Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "movesRemaining=; expires = Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "boardState=; expires = Thu, 01 Jan 1970 00:00:00 GMT";
}


function boardState() {
    console.log("Boardstate");
    console.log("board.gameOver: " + board.gameOver);
    console.log("board.playerTurn: " + board.playerTurn);
    console.log("board.movesRemaining: " + board.movesRemaining);
    console.log(board.grid);

}