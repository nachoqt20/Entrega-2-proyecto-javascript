// ==========================================
// SECCIÓN 1: CALCULADORA BÁSICA
// ==========================================

const calcDisplay = document.getElementById("calc-display");
const calcMessage = document.getElementById("calc-message");
const calcButtonsContainer = document.querySelector(".calc-buttons");

let currentInput = "0";
let previousInput = "";
let operator = null;
let shouldResetDisplay = false;

function updateCalcDisplay(value) {
  calcDisplay.value = value;
}

function showCalcMessage(message) {
  calcMessage.textContent = message;
}

function clearCalculator() {
  currentInput = "0";
  previousInput = "";
  operator = null;
  shouldResetDisplay = false;
  updateCalcDisplay(currentInput);
  showCalcMessage("");
}

function deleteLastChar() {
  if (shouldResetDisplay) {
    clearCalculator();
    return;
  }

  if (currentInput.length > 1) {
    currentInput = currentInput.slice(0, -1);
  } else {
    currentInput = "0";
  }

  updateCalcDisplay(currentInput);
  showCalcMessage("");
}

function appendNumber(num) {
  showCalcMessage("");

  if (shouldResetDisplay) {
    currentInput = num === "." ? "0." : num;
    shouldResetDisplay = false;
    updateCalcDisplay(currentInput);
    return;
  }

  if (num === "." && currentInput.includes(".")) {
    return;
  }

  if (currentInput === "0" && num !== ".") {
    currentInput = num;
  } else {
    currentInput += num;
  }

  updateCalcDisplay(currentInput);
}

function chooseOperator(nextOperator) {
  const currentValue = parseFloat(currentInput);
  showCalcMessage("");

  if (operator && !shouldResetDisplay) {
    const result = calculateOperation(parseFloat(previousInput), currentValue, operator);
    if (result === null) {
      return;
    }
    currentInput = String(result);
    updateCalcDisplay(currentValue === 0 && operator === "/" ? "Error" : currentInput);
  }

  previousInput = currentInput;
  operator = nextOperator;
  shouldResetDisplay = true;
}

function calculateOperation(a, b, op) {
  if (Number.isNaN(a) || Number.isNaN(b)) {
    return null;
  }

  switch (op) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "*":
      return a * b;
    case "/":
      if (b === 0) {
        showCalcMessage("No se puede dividir por cero.");
        updateCalcDisplay("Error");
        shouldResetDisplay = true;
        operator = null;
        previousInput = "";
        return null;
      }
      return a / b;
    default:
      return null;
  }
}

function handleEquals() {
  if (!operator || previousInput === "") {
    return;
  }

  const a = parseFloat(previousInput);
  const b = parseFloat(currentInput);
  const result = calculateOperation(a, b, operator);

  if (result === null) {
    return;
  }

  // Evita decimales largos tipo 0.30000000000000004
  const formattedResult = Number(result.toFixed(10));
  currentInput = String(formattedResult);
  previousInput = "";
  operator = null;
  shouldResetDisplay = true;
  updateCalcDisplay(currentInput);
  showCalcMessage("");
}

function handleCalcButtonClick(event) {
  const button = event.target.closest("button");
  if (!button) {
    return;
  }

  const action = button.dataset.action;
  const value = button.dataset.value;

  if (action === "clear") {
    clearCalculator();
  } else if (action === "delete") {
    deleteLastChar();
  } else if (action === "calculate") {
    handleEquals();
  } else if (value) {
    const isOperator = ["+", "-", "*", "/"].includes(value);
    if (isOperator) {
      chooseOperator(value);
    } else {
      appendNumber(value);
    }
  }
}

calcButtonsContainer.addEventListener("click", handleCalcButtonClick);

// ==========================================
// SECCIÓN 2: LISTA DE TAREAS
// ==========================================

const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");

let tasks = [];

function createTask(text) {
  return {
    id: Date.now(),
    text: text.trim(),
    completed: false
  };
}

function addTask(text) {
  const cleanText = text.trim();
  if (!cleanText) {
    return;
  }

  const newTask = createTask(cleanText);
  tasks.push(newTask);
  renderTasks();
}

function toggleTaskCompleted(taskId) {
  tasks = tasks.map((task) => {
    if (task.id === taskId) {
      return { ...task, completed: !task.completed };
    }
    return task;
  });

  renderTasks();
}

function deleteTask(taskId) {
  tasks = tasks.filter((task) => task.id !== taskId);
  renderTasks();
}

function renderTasks() {
  todoList.innerHTML = "";

  if (tasks.length === 0) {
    const emptyItem = document.createElement("li");
    emptyItem.className = "todo-empty";
    emptyItem.textContent = "Todavía no hay tareas cargadas. ¡Agregá la primera arriba!";
    todoList.appendChild(emptyItem);
    return;
  }

  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = task.completed ? "todo-item completed" : "todo-item";

    const label = document.createElement("label");
    label.className = "todo-label";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "todo-checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", () => toggleTaskCompleted(task.id));

    const span = document.createElement("span");
    span.className = "todo-text";
    span.textContent = task.text;

    label.appendChild(checkbox);
    label.appendChild(span);

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "btn btn-delete";
    deleteBtn.textContent = "Eliminar";
    deleteBtn.addEventListener("click", () => deleteTask(task.id));

    li.appendChild(label);
    li.appendChild(deleteBtn);
    todoList.appendChild(li);
  });
}

function handleTodoSubmit(event) {
  event.preventDefault();
  addTask(todoInput.value);
  todoInput.value = "";
  todoInput.focus();
}

todoForm.addEventListener("submit", handleTodoSubmit);

// Renderizado inicial
renderTasks();