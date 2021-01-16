// These are the numbers to be recorded.
let guesses = 0;
let player1Wins = 0;
let player2Wins = 0;

let finished = false;

// These are the arrays.
const colors = ["red","orange","yellow", "green", "blue","purple"];
let colorChosen = [];
let history = [];

// These are the selectors.
const historyEl = document.querySelector(".history");
const currentSelectionEl = document.querySelector(".current-selection");
let final = randomFinal();

// Buttons that will appear/disappear when special conditions are met.
document.getElementById('newGames').style.visibility = 'hidden';

// The playboard object.
const toBeSelected = -1;
const RED = 1;
const ORANGE = 2;
const YELLOW = 3;
const GREEN = 4;
const BLUE = 5;
const PURPLE = 6;

let Game = function(id){
  this.id = id;
  this.setter = null;
  this.guesser = null;
  this.playboard = [[toBeSelected, toBeSelected, toBeSelected, toBeSelected],
                    [toBeSelected, toBeSelected, toBeSelected, toBeSelected],
                    [toBeSelected, toBeSelected, toBeSelected, toBeSelected],
                    [toBeSelected, toBeSelected, toBeSelected, toBeSelected],
                    [toBeSelected, toBeSelected, toBeSelected, toBeSelected],
                    [toBeSelected, toBeSelected, toBeSelected, toBeSelected],
                    [toBeSelected, toBeSelected, toBeSelected, toBeSelected],
                    [toBeSelected, toBeSelected, toBeSelected, toBeSelected],
                    [toBeSelected, toBeSelected, toBeSelected, toBeSelected],
                    [toBeSelected, toBeSelected, toBeSelected, toBeSelected]];
};
// Generate a random set of codes to be the code the code guesser need to guess.
function randomFinal() {
  let newFinal = [...new Array(4)].map(f => {
    let random = Math.floor(Math.random() * Math.floor(colors.length));
    return colors[random];
  });
  return newFinal;
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
    if (final[index] === color) {
      hints.push("full");
      dublicateCheck.push(color);
    }
  });

  colors.forEach((color) => {
    if (!dublicateCheck.includes(color) && final.includes(color)) {
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
    if (hints.length === final.length && hints.every(hint => hint === "full")) {
      window.alert("Correct code! Do you want to start another game?");
      document.getElementById('makeGuess').style.visibility = 'hidden';
      document.getElementById('newGames').style.visibility = 'visible';
      player1Wins++;
      document.getElementsByClassName("scoreboard").innerHTML = player1Wins + " : " + player2Wins;
    } else if (guesses > 10) {
      window.alert("Please go upgrading your brain.");
      document.getElementById('makeGuess').style.visibility = 'hidden';
      document.getElementById('newGames').style.visibility = 'visible';
      player2Wins++;
      document.getElementsByClassName("scoreboard").innerHTML = player1Wins + " : " + player2Wins;
    }
    }
  
  }

// To start a new game.
function playAgain(){
  resetChoices();
  final = randomFinal();
  guesses = 0;
  history = [];
  colorChosen = [];
  document.getElementById('makeGuess').style.visibility = 'visible';
  document.getElementById('newGames').style.visibility = 'hidden';
  historyEl.innerHTML = "";
}

// display the correct answer.
function disPlayTheAnswerCode(){

}