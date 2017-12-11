var calcHistory =[];
var calc = { v1: 0, v2: null, op: null };
var cookieHistoryString = (Cookies.get('calcHistory'));
if (cookieHistoryString == undefined) {
  calcHistory = cookieHistory = [];
} else {
  cookieHistory = JSON.parse(cookieHistoryString);
}

var completedEquation = false;
// Switch statment to interpret what action should be taken Ei. an operator, a number, or action is clicked.
$('.button>div').on('click', function() {
  var screenText = $('.screen').text();
  switch ($(this).attr('data-button')) {
    case 'number':
      var numberPressed = this.innerHTML;
      if (!calc.op) {
        // First variable
        if ((screenText == 0 || completedEquation)) {
        //if ((screenText == 0 || completedEquation) && screenText != '0.') {
          $('.screen').text(numberPressed);
        } else {
          $('.screen').append(numberPressed);
        }
      } else {
        // Second variable
        if (!calc.v2) {
          // First digit
          $('.screen').text(numberPressed);
          calc.v2 = numberPressed;
        } else {
          // Subsequent digits
          $('.screen').append(numberPressed);
          screenText = $('.screen').text();
          calc.v2 = screenText;
        }
      }
      completedEquation = false;
      break;

    case 'operator':
      if (!calc.v2) {
        // Current calculation's operator
        calc.v1 = screenText;
        var operatorString = $(this).attr('data-operator');
        calc.op = operatorString;
      } else if ((calc.v1 && calc.v2) && calc.op) {
        // case scenario for if user is attempting a continual operation (Ex. 9 + 9 + 9)
        calculateResult();
        var operatorString = $(this).attr('data-operator');
        calc.op = operatorString;
      } else {
        // Next operation's operator
        calculateResult();
      }
      break;


    case 'sqrt':
      var numberProcessed = calc.v2 ? calc.v2 : calc.v1;
      setCalcToInit(numberProcessed);
      calc.op = 'sqrt';
      calculateResult();
      break;
    case 'point':
      if (!calc.v2) {
        // Modifying screen (working on v1)
        if (!(screenText.indexOf(".") >= 0)) {
          $('.screen').append('.');
        }
        if (calc.op) {
          $('.screen').text('0.');
          calc.v2 = '0.';
        }
      } else {
        // Modifying v2 and screen (working on v2)
        $('.screen').append('.');
      }
      break;
    case 'clear':
      $('.screen').text(0);
      setCalcToInit(0);
      break;
    case 'memory':
      var prevResult = calcHistory.length == 0 ? 0 : calcHistory.pop();
      setCalcToInit(prevResult);
      $('.screen').text(prevResult);
      saveHistory();
      break;
    case 'equals':
      if (calc.v2) {
        completedEquation = true;
        calculateResult();
      } else {
        calc.v2 = calc.v1;
        calculateResult();
      }
      break;
  }
  console.log('\n\ncalc');
  console.log(calc);
});

function calculateResult() {
  var result;
  var finalSolution;
  switch (calc.op) {
    case 'add':
      result = parseFloat(calc.v1)+parseFloat(calc.v2);
      finalSolution = result.toPrecision();
      break;
    case 'subtract':
      result = parseFloat(calc.v1)-parseFloat(calc.v2);
      finalSolution = result.toPrecision();
      break;
    case 'multiply':
      result = parseFloat(calc.v1)*parseFloat(calc.v2);
      finalSolution = result.toPrecision();
      break;
    case 'divide':
      result = parseFloat(calc.v1)/parseFloat(calc.v2);
      finalSolution = result.toPrecision();
      break;
    case 'exponent':
      result = Math.pow(calc.v1, calc.v2);
      finalSolution = result.toPrecision();
      break;
    case 'sqrt':
      result = Math.sqrt(parseFloat( $('.screen').text() ));
      finalSolution = result.toPrecision();
      break;
  }
  calcHistory.push(finalSolution);
  $('.screen').text(finalSolution);
  setCalcToInit(finalSolution);
  saveHistory();
  console.log('\n\ncalcHistory');
  console.log(calcHistory);
}

function setCalcToInit(v1) {
  calc.v1 = v1;
  calc.v2 = null;
  calc.op = null;
}

function saveHistory() {
  Cookies.set('calcHistory', calcHistory);
}
