// ================= SELECTORS =================
const images = document.querySelectorAll("img");
const coins5 = document.querySelector(".coins5");
const coins10 = document.querySelector(".coins10");
const ResetBtn = document.querySelector(".Reset");

let state = "Idle";
let history = ["Idle"];
let total = 0;
let selectedProduct = "None";
const price = 25;

// ============ EVENT LISTENERS ============
images.forEach((img) => {
  img.addEventListener("click", (e) => {
    selectedProduct = e.target.alt;
    document.querySelector(".selected-product").textContent = selectedProduct;

    if (state === "Menu") {
      changeState(
        "Balance-0",
        `Product ${selectedProduct} selected. Insert coins.`,
        "alert-info"
      );
    }
  });
});

coins5.addEventListener("click", () => insertCoin(5));
coins10.addEventListener("click", () => insertCoin(10));
ResetBtn.addEventListener("click", resetMachine);

// ============ STATE MACHINE ============

function insertCoin(amount) {
  if (state === "Idle" || state === "QR-Wait" || state === "Menu") {
    updateDFA("Please select a product first.", "alert-warning");
    return;
  }

  if (state === "Done") {
    updateDFA("Product already dispensed. Reset machine.", "alert-warning");
    return;
  }

  total += amount;

  // ===================== TRANSITIONS BASED ON DRAWN DFA =====================

  switch (state) {
    case "Balance-0":
      if (amount === 5) changeState("Balance-5", "Balance = 5", "alert-info");
      if (amount === 10)
        changeState("Balance-10", "Balance = 10", "alert-info");
      break;

    case "Balance-5":
      if (amount === 5) changeState("Balance-10", "Balance = 10", "alert-info");
      if (amount === 10)
        changeState("Balance-15", "Balance = 15", "alert-info");
      break;

    case "Balance-10":
      if (amount === 5) changeState("Balance-15", "Balance = 15", "alert-info");
      if (amount === 10)
        changeState("Balance-20", "Balance = 20", "alert-info");
      break;

    case "Balance-15":
      if (amount === 5) changeState("Balance-20", "Balance = 20", "alert-info");
      if (amount === 10)
        changeState("Done", `Product dispensed!`, "alert-success");
      break;

    case "Balance-20":
      // Any coin leads to Done
      changeState(
        "Done",
        `Product dispensed! Change = ${total - price}`,
        "alert-success"
      );
      break;
  }

  updateProgress();
}

// ============ CHANGE STATE ============
function changeState(newState, message, alertClass) {
  state = newState;
  history.push(newState);
  updateDFA(message, alertClass);
}

// ============ RESET MACHINE ============
function resetMachine() {
  total = 0;
  selectedProduct = "None";
  state = "Menu";
  history = ["Menu"];

  document.querySelector(".selected-product").textContent = selectedProduct;
  updateProgress();
  updateDFA("Machine reset. Select product.", "alert-secondary");
}

// ============ UPDATE UI ============
function updateProgress() {
  const width = (total / price) * 100;
  document.querySelector(".progress-bar").style.width = width + "%";
  document.querySelector(".progress-label").textContent = `${total} / ${price}`;
}

function updateDFA(msg, alertClass) {
  document.querySelector(".CState").textContent = state;
  document.querySelector(".AState").textContent = total;

  const messageBox = document.querySelector(".message");
  messageBox.textContent = msg;

  messageBox.classList.remove(
    "alert-success",
    "alert-warning",
    "alert-info",
    "alert-secondary"
  );
  messageBox.classList.add(alertClass);

  document.querySelector(".state-history").textContent = history.join(" → ");
}

// ================= INITIAL STATE =================
changeState("Idle", "Scan QR to start the machine", "alert-secondary");
