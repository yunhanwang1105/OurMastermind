// @ts-check
// These are the numbers to be recorded.
let guesses = 0;
let guesserScore = 0;
let setterScore = 0;
let finished = false;


// this is the code to guess (only for setter)
let code = [];

// this is the current hints given (only for setter)
let currentHints = [];

// this is the current guess code (for setter and guesser)
let currentGuessCode = [];

// this is the role of player
let role;

// this is an inner board for code
let codeInnerBoard = document.createElement("div");

// on connection
// recieve role

const colors = ["red","orange","yellow", "green", "blue","purple"];

// these are selectors
const boardSelector = document.querySelector(".board");
const anouncementSelector = document.querySelector(".anouncement");
anouncementSelector.innerHTML = "wait for opponent...";

const currentSelectionSelector = document.querySelector(".current-selection");

const checkBtnSelector = document.querySelector(".check");
const resetBtnSelector = document.querySelector(".reset");
document.getElementById('new-game').style.visibility = 'hidden';

const scoreboardSelector = document.querySelector(".scoreboard").innerHTML = "0 : 0";

const btnColorSelector = document.querySelectorAll(".item");
const hintSectionSelector = document.getElementsByClassName("setter_hint");

// hint color to select was initialy hidden

const hintColorSelector = document.querySelectorAll(".hint");



var socket = new WebSocket("ws://localhost:3000");

// connection
socket.onmessage = function (msg) { 
    console.log("message recieved");
    console.log(msg);

    let incomingMessage = JSON.parse(msg.data);

    console.log(incomingMessage);

    // assign role to the current HTML user
    if (incomingMessage.role === "CodeSetter") {
        this.role = "CodeSetter";

        checkBtnSelector.addEventListener("click", () => checkHints());
        resetBtnSelector.addEventListener("click", () => resetHints());
        console.log("html set");
        //document.getElementById('new-game').style.visibility = 'visible';

        console.log("add action listener to color btn");
        btnColorSelector.forEach(btn => {
            const color = btn.classList[1];
            btn.addEventListener("click", () => selectCodeColor(color));
        
        });



    } else {
        this.role = "CodeGuesser";

        checkBtnSelector.addEventListener("click", () => checkColor());
        resetBtnSelector.addEventListener("click", () => resetColor());
        console.log("html set");
        //checkBtnSelector.addEventListener("click", )

    }

    // guesser's turn
    if (incomingMessage.type === "GUESS-COLOR" && this.role == "CodeGuesser") {
        anouncementSelector.innerHTML = incomingMessage.data;

        btnColorSelector.forEach(btn => {
            const color = btn.classList[1];
            btn.addEventListener("click", () => selectGuessColor(color));
        
        });


    }

    // setter's turn
    if (incomingMessage.type === "CEHCK-GUESS" && this.role === "CodeSetter") {

        guesses++;

        anouncementSelector.innerHTML = "Setter should make hints";
        currentGuessCode = incomingMessage.data;
        for (let i = 0; i < currentGuessCode.length; i++) {
            const div = document.createElement("div");
            div.classList.add("code-selection-item");
            div.classList.add(currentGuessCode[i]);
            codeInnerBoard.appendChild(div);
        }
        boardSelector.appendChild(codeInnerBoard);

    }

    // guesser's another turn, with hints
    if (incomingMessage.type === "GIVE-HINTS-TO" && this.role === "CodeGuesser") {



        anouncementSelector.innerHTML = "Guess again";
        const hintsInnerBoard = document.createElement("div");
        let hints = incomingMessage.data;
        hintsInnerBoard.classList.add("codeInnerBoard");
        for (let i = 0; i < hints.length; i++) {
            const div = document.createElement("div");
            div.classList.add("hint-selection");
            div.classList.add(hints[i]);
            hintsInnerBoard.appendChild(div);
        }
        boardSelector.appendChild(hintsInnerBoard);

    }

    if (incomingMessage.type === "GUESSER-WIN") {
        anouncementSelector.innerHTML = "Guesser wins!";
        guesserScore++;

        let scoreboardSelector = document.querySelector(".scoreboard").innerHTML = setterScore + " : " + guesserScore;

    }

    if (incomingMessage.type === "SETTER-WIN") {
        anouncementSelector.innerHTML = "Setter wins!";
        setterScore++;
        
        let scoreboardSelector = document.querySelector(".scoreboard").innerHTML = setterScore + " : " + guesserScore;

    }


}


// each click for selecting a code color (setter)
function selectCodeColor(color) {
    console.log(color);
    const div = document.createElement("div");
    div.classList.add("code-selection-item");
    div.classList.add(color);

    this.codeInnerBoard.appendChild(div);

    // make color visible on current selection
    currentSelectionSelector.appendChild(div);

    code.push(color);

    if (code.length === 4) {
        currentSelectionSelector.innerHTML = "";
        boardSelector.appendChild(codeInnerBoard);

        // clear innerboard, reuse
        codeInnerBoard = document.createElement("div");
                
        // !!!!!!!!!!!!
        var request = JSON.stringify({type: "CODE-GIVEN"});
        socket.send(request);

        // 4 colors are set, make color btn inactive
        btnColorSelector.forEach(btn => {
            btn.classList.add("inactive");
        });

        // then make selecting hints possible, visible
        this.hintSectionSelector.classList.remove("invisible");
        
        hintColorSelector.forEach(h => {
            const hintType = h.classList[1];
            h.addEventListener("click", () => selectHint(hintType));
        });
        
    }

}

// each click for selecting a hint
function selectHint(hintType) {
    console.log(hintType);

    const div = document.createElement("div");
    div.classList.add("hint-selection");
    div.classList.add(hintType);



    currentSelectionSelector.appendChild(div);
    currentHints.push(hintType);

    if (currentHints.length === 4) {

        hintColorSelector.forEach(h => {
            h.classList.add("inactive");
        });

    }
}

// check btn, setter version
function checkHints() {
    const correctHintsGiven = examineHintsAndCode();
    if (!correctHintsGiven) {

        alert("Wrong hints given, try again.");
        hintColorSelector.forEach(h => {
            h.classList.remove("inactive");
        });
        currentHints.length = 0;
        currentSelectionSelector.innerHTML = "";

    } else {

        let allCorrect = true;
        for (let i = 0; i < currentHints.length; i++) {
            if ("full" !== currentHints[i]){
                allCorrect = false;
                return;
            }
        }
        if (currentHints.length !== 4) {
            allCorrect = false;
        }

        
        if (allCorrect && guesses <= 10) {
            // guesser wins
            let request = JSON.stringify({type: "GAME-RESULT", data: "CodeGuesser"});
            socket.send(request);
            guesserScore++;
            this.scoreboardSelector.innerHTML = setterScore + " : " + guesserScore;
            return;
        }

        if (!allCorrect && guesses === 10) {
            // setter wins
            let request = JSON.stringify({type: "GAME-RESULT", data: "CodeSetter"});
            socket.send(request);
            setterScore++;
            this.scoreboardSelector.innerHTML = setterScore + " : " + guesserScore;
            return;
        }

        currentSelectionSelector.innerHTML = "";
        anouncementSelector.innerHTML = "Correct hints, sending to guesser";
        // send hints array to server to guesser
        let Msg = JSON.stringify({type: "HINTS-MADE", data: currentHints});
        socket.send(Msg);

        // clear current hints
        currentHints = [];
    }
}

// return true iff given hints (current hints) are correct
function examineHintsAndCode() {

    const realHints = getHints();
    let fullInHints = 0;
    let halfInHints = 0;
    let fullInRealHints = 0;
    let halfInRealHints = 0;

    for (let i = 0; i < currentHints.length; i++) {
        if (currentHints[i] === "half") halfInHints++;
        if (currentHints[i] === "full") fullInHints++;
    }

    for (let i = 0; i < realHints.length; i++) {
        if (realHints[i] === "half") halfInRealHints++;
        if (realHints[i] === "full") fullInRealHints++;
    }
    return (fullInHints === fullInRealHints) && (halfInHints === halfInRealHints);
}

function getHints() {
    let result = [];
    let fullIndexes = [];
    let halfIndexInGuess = [];

    for (let i = 0; i < code.length; i++) {
        if (code[i] === currentGuessCode[i]) {
            result.push("full");
            fullIndexes.push(i);
        }
    }

    for (let i = 0; i < code.length; i++) {
        if (fullIndexes.indexOf(i) > -1) continue;

        for (let a = 0; a < currentGuessCode.length; a++) {
            if (halfIndexInGuess.indexOf(a) > -1) continue;
            if (code[i] === currentGuessCode[a]) {
                halfIndexInGuess.push(a);
                result.push("half");
                break;
            }
        }
    }

    return result;
}


// reset hints choosen
function resetHints() {
    currentHints.length = 0;
    currentSelectionSelector.innerHTML = "";
    hintColorSelector.forEach(h => {
        h.classList.remove("inactive");
    });
}


/////////////////////////

function selectGuessColor(color) {
    
    currentGuessCode.push(color);

    const current = document.createElement("div");
    current.classList.add("item");
    current.classList.add(color);
  
    currentSelectionSelector.append(current);
    codeInnerBoard.appendChild(current);

    if (currentGuessCode.length === 4) {
        btnColorSelector.forEach(btn => {
            btn.classList.add("inactive");
        });
    }

}


function checkColor(){
    if (currentGuessCode.length < 4){
        window.alert("You have to choose 4 colours.");
    } else{

        currentSelectionSelector.innerHTML = "";
        boardSelector.appendChild(codeInnerBoard);

        // clear innerboard, reuse
        codeInnerBoard = document.createElement("div");

       
        let request = JSON.stringify({type: "GUESS-MADE",
                                      data: this.currentGuessCode});
        socket.send(request);
        guesses++;

        currentGuessCode = [];
        anouncementSelector.innerHTML = "waiting code setter to give hints...";

    }
    
}

function resetColor() {
    currentGuessCode.length = 0;
    currentSelectionSelector.innerHTML = "";
    btnColorSelector.forEach(b => {
        b.classList.remove("inactive");
    });
}


// // These are the numbers to be recorded.
// let guesses = 0;
// let guesserScore = 0;
// let setterScore = 0;
// let finished = false;

// // These are the arrays.
// const colors = ["red","orange","yellow", "green", "blue","purple"];
// let colorChosen = [];
// let history = [];

// // These are the selectors.
// const historyEl = document.querySelector(".history");
// const currentSelectionEl = document.querySelector(".current-selection");
// let code = randomcode();

// // Buttons that will appear/disappear when special conditions are met.
// document.getElementById('newGames').style.visibility = 'hidden';

// // Generate a random set of codes to be the code the code guesser need to guess.
// function randomcode() {
//   let newcode = [...new Array(4)].map(f => {
//     let random = Math.floor(Math.random() * Math.floor(colors.length));
//     return colors[random];
//   });
//   return newcode;
// }

// // How the code guesser select a colour.
// function selectColor(color) {
//   colorChosen.push(color);

//   const current = document.createElement("div");
//   current.classList.add("item");
//   current.classList.add(color);

//   currentSelectionEl.append(current);
// }

// function calculateHints(colors) {
//   const hints = [];
//   const dublicateCheck = [];

//   colors.forEach((color, index) => {
//     if (code[index] === color) {
//       hints.push("full");
//       dublicateCheck.push(color);
//     }
//   });

//   colors.forEach((color) => {
//     if (!dublicateCheck.includes(color) && code.includes(color)) {
//       hints.push("half");
//     }
//   });

//   return hints;
// }

// const buttons = document.querySelectorAll(".item");
// for (let button of buttons) {
//   const color = button.classList[1];
//   button.addEventListener("click", () => selectColor(color));
// }

// // Remove all colours selected.
// function resetChoices(){
//   currentSelectionEl.innerHTML = "";
//   colorChosen.length = 0;
// }

// // Check if the guess given equals to the answer. Will notify the guesser invalid moves.
// function checkTheGuesses(){
//   if (colorChosen.length < 4){
//     document.getElementById("suggestions").innerHTML = "Select 4 colours is compulsory.";
//   }

//   if (colorChosen.length > 4){
//     document.getElementById("suggestions").innerHTML = "You cannot select more than 4 colours.";
//     resetChoices();
//   }

//   if (colorChosen.length === 4){
//      history.push(colorChosen);
//     currentSelectionEl.innerHTML = "";
//     document.getElementById("suggestions").innerHTML = "";

//     // dom work
//     const historyItem = document.createElement("div");
//     historyItem.classList.add("history-item");
//     for (const chosen of colorChosen) {
//       const el = document.createElement("div");
//       el.classList.add("item");
//       el.classList.add(chosen);
//       historyItem.append(el);
//     }
//     historyItem.append(document.createElement("hr"));

//     //grab hints
//     const hints = calculateHints(colorChosen);

//     // dom work
//     for (const hint of hints) {
//       const el = document.createElement("div");
//       el.classList.add("keyPegs");
//       if (hint === "full") {
//         el.classList.add("full");
//       } else {
//         el.classList.add("half");
//       }
//       historyItem.append(el);
//     }
//     historyEl.append(historyItem);
//     guesses++;

//     colorChosen.length = 0;
//     if (hints.length === code.length && hints.every(hint => hint === "full")) {
//       window.alert("Correct code! Do you want to start another game?");
//       document.getElementById('makeGuess').style.visibility = 'hidden';
//       document.getElementById('newGames').style.visibility = 'visible';
//       guesserScore++;
//       document.getElementsByClassName("scoreboard").innerHTML = setterScore + ": " + guesserScore;
//     } else if (guesses > 10) {
//       document.getElementById('makeGuess').style.visibility = 'hidden';
//       document.getElementById('newGames').style.visibility = 'visible';
//       setterScore++;
//       document.getElementsByClassName("scoreboard").innerHTML = setterScore + " : " + guesserScore;
//     }
//     }
  
//   }

// // To start a new game.
// function playAgain(){
//   resetChoices();
//   code = randomcode();
//   guesses = 0;
//   history = [];
//   colorChosen = [];
//   document.getElementById('makeGuess').style.visibility = 'visible';
//   document.getElementById('newGames').style.visibility = 'hidden';
//   historyEl.innerHTML = "";
// }





