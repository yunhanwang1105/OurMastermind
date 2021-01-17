// These are the numbers to be recorded.
let guesses = 0;
let guesserScore = 0;
let setterScore = 0;
let finished = false;

// These are the arrays.
const colors = ["red","orange","yellow", "green", "blue","purple"];
let colorChosen = [];
let history = [];

// These are the selectors.
const historyEl = document.querySelector(".history");
const currentSelectionEl = document.querySelector(".current-selection");
let code = randomcode();

// Buttons that will appear/disappear when special conditions are met.
document.getElementById('newGames').style.visibility = 'hidden';

// Generate a random set of codes to be the code the code guesser need to guess.
function randomcode() {
  let newcode = [...new Array(4)].map(f => {
    let random = Math.floor(Math.random() * Math.floor(colors.length));
    return colors[random];
  });
  return newcode;
}

// How the code guesser select a colour.
function selectColor(color) {
  colorChosen.push(color);

  const current = document.createElement("div");
  current.classList.add("item");
  current.classList.add(color);

  currentSelectionEl.append(current);
}

function calculateHints(colors) {
  const hints = [];
  const dublicateCheck = [];

  colors.forEach((color, index) => {
    if (code[index] === color) {
      hints.push("full");
      dublicateCheck.push(color);
    }
  });

  colors.forEach((color) => {
    if (!dublicateCheck.includes(color) && code.includes(color)) {
      hints.push("half");
    }
  });

  return hints;
}

const buttons = document.querySelectorAll(".item");
for (let button of buttons) {
  const color = button.classList[1];
  button.addEventListener("click", () => selectColor(color));
}

// Remove all colours selected.
function resetChoices(){
  currentSelectionEl.innerHTML = "";
  colorChosen.length = 0;
}

// Check if the guess given equals to the answer. Will notify the guesser invalid moves.
function checkTheGuesses(){
  if (colorChosen.length < 4){
    document.getElementById("suggestions").innerHTML = "Select 4 colours is compulsory.";
  }

  if (colorChosen.length > 4){
    document.getElementById("suggestions").innerHTML = "You cannot select more than 4 colours.";
    resetChoices();
  }

  if (colorChosen.length === 4){
     history.push(colorChosen);
    currentSelectionEl.innerHTML = "";
    document.getElementById("suggestions").innerHTML = "";

    // dom work
    const historyItem = document.createElement("div");
    historyItem.classList.add("history-item");
    for (const chosen of colorChosen) {
      const el = document.createElement("div");
      el.classList.add("item");
      el.classList.add(chosen);
      historyItem.append(el);
    }
    historyItem.append(document.createElement("hr"));

    //grab hints
    const hints = calculateHints(colorChosen);

    // dom work
    for (const hint of hints) {
      const el = document.createElement("div");
      el.classList.add("keyPegs");
      if (hint === "full") {
        el.classList.add("full");
      } else {
        el.classList.add("half");
      }
      historyItem.append(el);
    }
    historyEl.append(historyItem);
    guesses++;

    colorChosen.length = 0;
    if (hints.length === code.length && hints.every(hint => hint === "full")) {
      window.alert("Correct code! Do you want to start another game?");
      document.getElementById('makeGuess').style.visibility = 'hidden';
      document.getElementById('newGames').style.visibility = 'visible';
      guesserScore++;
      document.getElementsByClassName("scoreboard").innerHTML = setterScore + ": " + guesserScore;
    } else if (guesses > 10) {
      document.getElementById('makeGuess').style.visibility = 'hidden';
      document.getElementById('newGames').style.visibility = 'visible';
      setterScore++;
      document.getElementsByClassName("scoreboard").innerHTML = setterScore + " : " + guesserScore;
    }
    }
  
  }

// To start a new game.
function playAgain(){
  resetChoices();
  code = randomcode();
  guesses = 0;
  history = [];
  colorChosen = [];
  document.getElementById('makeGuess').style.visibility = 'visible';
  document.getElementById('newGames').style.visibility = 'hidden';
  historyEl.innerHTML = "";
}






// (function setup() {
//   var socket = new WebSocket("ws://localhost:3000");
  
//   const gameObj = new gameObject('#game',socket);
//   socket.onmessage = function (event) { 
//       console.log("message recieved");
//       let incomingMessage = JSON.parse(event.data);
//       console.log(incomingMessage);
//       if (incomingMessage.type === "START-GAME") {
//           console.log(incomingMessage);
//       }

//       if (incomingMessage.type === Messages.T_PLAYER_A) {
//           gameObj.setPlayer("CodeSetter");
//           document.getElementsByClassName('Board').innerHTML.append("You are the setter");
//       }

//       if (incomingMessage.type === Messages.T_PLAYER_B) {
//           gameObj.setPlayer("CodeGuesser");
//           document.getElementsByClassName('Board').innerHTML.append("You are the guesser");
//       }
//     }
// });
