let calculationArea = document.querySelector('.calculation_area')
console.log(calculationArea)

// history array to store past calculations
let history = [];
let historyList = document.querySelector('.history-list');

// clear history
let clearHistory = function () {

    history = [];
    localStorage.removeItem("calculatorHistory");
    historyList.innerHTML = '';

}

// load history from localStorage on page load
let savedHistory = JSON.parse(localStorage.getItem("calculatorHistory")) || [];

history = savedHistory;

history.forEach(item => {
    let li = document.createElement("li");
    li.textContent = item;
    historyList.appendChild(li);
});

// toggle history visibility
let toggleHistory = function () {

    let historyBox = document.getElementById("historyBox");

    if (historyBox.style.display === "block") {
        historyBox.style.display = "none";
    } else {
        historyBox.style.display = "block";
    }
}

// showvalue function
let showValue = function (val) {
    calculationArea.value += val
}

// clearvalue function
let clearValue = function () {
    calculationArea.value = ''
}

// backspace function
let backspace = function () {
    calculationArea.value = calculationArea.value.slice(0, -1);
}

// percentage function
let percentage = function () {
    try {
        calculationArea.value = eval(calculationArea.value) / 100
    } catch {
        alert('Invalid Expression')
    }
}

// calculate function
let calculate = function () {
    try {

        let expression = calculationArea.value;
        if (expression.trim() === "") {
            return;
        }
        if (
            expression.endsWith("+") ||
            expression.endsWith("-") ||
            expression.endsWith("*") ||
            expression.endsWith("/")
        ) {
            throw new Error();
        }

        let result = eval(expression);
        history.push(`${expression} = ${result}`);
        localStorage.setItem("calculatorHistory", JSON.stringify(history));
        let li = document.createElement('li');
        li.textContent = `${expression} = ${result}`;
        historyList.appendChild(li);
        calculationArea.value = result;

        console.log(history);

    } catch {
        alert('Invalid Expression');
    }
}

// positive negative toggle function
let toggleSign = function () {

    if (calculationArea.value === "") {
        return;
    }

    if (calculationArea.value.startsWith("-")) {
        calculationArea.value = calculationArea.value.slice(1);
    } else {
        calculationArea.value = "-" + calculationArea.value;
    }
}

// keyboard support
document.addEventListener("keydown", function (event) {

    event.preventDefault();

    if (
        (event.key >= "0" && event.key <= "9") ||
        event.key === "+" ||
        event.key === "-" ||
        event.key === "*" ||
        event.key === "/" ||
        event.key === "."
    ) {
        calculationArea.value += event.key;
    }

    else if (event.key === "Enter") {
        calculate();
    }

    else if (event.key === "Backspace") {
        backspace();
    }

    else if (event.key === "Escape") {
        clearValue();
    }
});