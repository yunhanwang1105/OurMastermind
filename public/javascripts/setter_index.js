const btnCodeSelector = document.querySelectorAll(".item");

const codeSelectionSelector = document.querySelector(".code-selection");

const hintColorSelector = document.querySelectorAll(".hint");

const hintSelectionSelector = document.querySelector(".hints-selection");

const guesserCodeSelector = document.querySelector(".guesser-code");

let code = [];

let currentHints = [];

let currentGuessCode = generateGuessCode();


const checkBtnSelector = document.querySelector(".check").addEventListener("click", () => check());

const resetBtnSelector = document.querySelector(".reset").addEventListener("click", () => reset());






console.log(currentGuessCode);

currentGuessCode.forEach(color => {
    const div = document.createElement("div");
    div.classList.add("item");
    div.classList.add(color);
    guesserCodeSelector.appendChild(div);
});


// generate a random code
function generateGuessCode() {
    const colors = ["orange", "yellow", "blue", "green", "red", "purple"];
    const guessArray = [...new Array(4)].map(color => {
        const randomNum = Math.floor(Math.random() * Math.floor(colors.length));
        // each time, return a new random color
        return colors[randomNum];
    });

    return guessArray;
}

// click a color for setting code
btnCodeSelector.forEach(btn => {
    const color = btn.classList[1];
    btn.addEventListener("click", () => selectCodeColor(color));

});

// click a hint for examining guess code
hintColorSelector.forEach(h => {
    const hintType = h.classList[1];
    h.addEventListener("click", () => selecHint(hintType));
});

// each click for selecting a code color
function selectCodeColor(color) {
    console.log(color);
    const div = document.createElement("div");
    div.classList.add("code-selection-item");
    div.classList.add(color);

    codeSelectionSelector.appendChild(div);
    code.push(color);

    if (code.length === 4) {
        btnCodeSelector.forEach(btn => {
            btn.classList.add("inactive");
        });

        hintColorSelector.forEach(h => {
            h.classList.remove("inactive");
        });

    }

}

// each click for selecting a hint
function selecHint(hintType) {
    console.log(hintType);

    const div = document.createElement("div");
    div.classList.add("hint-selection");
    div.classList.add(hintType);

    hintSelectionSelector.appendChild(div);
    currentHints.push(hintType);

    if (currentHints.length === 4) {

        hintColorSelector.forEach(h => {
            h.classList.add("inactive");
        });
    }
}

// examine

function check() {
    const correctHintsGiven = examineHintsAndCode();
    if (!correctHintsGiven) {
        alert("Wrong hints given, try again.");
        hintColorSelector.forEach(h => {
            h.classList.remove("inactive");
        });
        currentHints.length = 0;
        hintSelectionSelector.innerHTML = "";
    } else {

        // replace !!!!!!!!!!!!!!
        currentGuessCode = generateGuessCode();
        // guesserCodeSelector.innerHTML = "";
        currentGuessCode.forEach(color => {
            const div = document.createElement("div");
            div.classList.add("item");
            div.classList.add(color);
            guesserCodeSelector.appendChild(div);
        });
        currentHints.length = 0;
        hintSelectionSelector.innerHTML = "";
    }
}

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
function reset() {
    currentHints.length = 0;
    hintSelectionSelector.innerHTML = "";
    hintColorSelector.forEach(h => {
        h.classList.remove("inactive");
    });
}