const display = document.getElementById('display');
const buttons = document.querySelectorAll('button');

let lastPressedEquals = false;  // flag to track if last input was '='

// Button clicks
buttons.forEach(button => {
  button.addEventListener('click', () => {
    const value = button.getAttribute('data-value');
    if (value) {
      handleInput(value);
    }
  });
});

document.getElementById('clear').addEventListener('click', () => {
  display.value = '';
  lastPressedEquals = false;
});

document.getElementById('backspace').addEventListener('click', () => {
  backspace();
  lastPressedEquals = false;
});

// Keyboard input
document.addEventListener('keydown', (e) => {
  const allowedKeys = "0123456789+-*/.=EnterBackspace%";

  if (allowedKeys.includes(e.key)) {
    if (e.key === 'Enter') {
       e.preventDefault(); 
      handleInput('=');
    } else if (e.key === 'Backspace') {
      backspace();
      lastPressedEquals = false;
      e.preventDefault();
    } else {
      handleInput(e.key);
    }
  }
});

function handleInput(value) {
  // If last action was '=' and new input is digit, reset display
  if (lastPressedEquals) {
    if (/[0-9]/.test(value)) {
      display.value = value;
      lastPressedEquals = false;
      return;
    } else if (['+', '-', '*', '/', '%', '.'].includes(value)) {
      // continue with the existing result if operator pressed
      lastPressedEquals = false; // reset flag to continue
    } else if (value === 'C') {
      display.value = '';
      lastPressedEquals = false;
      return;
    }
  }

  if (value === '=') {
    let expr = display.value;

    expr = expr.replace(/([\d.]+)\s*([\+\-])\s*([\d.]+)%/g, (match, a, operator, b) => {
      return `${a} ${operator} (${a} * ${b} / 100)`;
    });

    expr = expr.replace(/([\d.]+)\s*([\*\/])\s*([\d.]+)%/g, (match, a, operator, b) => {
      return `${a} ${operator} (${b} / 100)`;
    });

    expr = expr.replace(/([\d.]+)%/g, (match, a) => {
      return `(${a} / 100)`;
    });

    try {
      display.value = eval(expr);
    } catch {
      display.value = 'Error';
    }
    lastPressedEquals = true;
  } else if (value === 'C') {
    display.value = '';
    lastPressedEquals = false;
  } else {
    display.value += value;
  }
}

function backspace() {
  display.value = (display.value || '').toString().slice(0, -1);
}
