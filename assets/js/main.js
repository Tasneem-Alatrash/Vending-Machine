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

// ================= QR WAIT SEQUENCE =================
setTimeout(() => {
  document.getElementById("qr-wait-screen").style.display = "none";

  history.push("QR-Wait");
  state = "Menu";
  history.push("Menu");

  updateDFA("QR scanned. Select a product.", "alert-info");
  updateProgress();
}, 1500);

// ================= PRODUCT SELECTION =================
images.forEach((img) => {
  img.addEventListener("click", (e) => {
    selectedProduct = e.target.alt;
    document.querySelector(".selected-product").textContent = selectedProduct;

    // When user selects a product
    images.forEach((img) => {
      img.addEventListener("click", (e) => {
        selectedProduct = e.target.alt;
        document.querySelector(".selected-product").textContent =
          selectedProduct;

        // أول اختيار بعد Menu → Balance-0
        if (history.includes("Menu") && !history.includes("Balance-0")) {
          state = "Balance-0";
          history.push("Balance-0");
          updateDFA(
            `Selected: ${selectedProduct}. Insert coins.`,
            "alert-info"
          );
          return;
        }

        // أي تغيير لاحق للمنتج → لا نغير الـ state ولا الـ total
        updateDFA(
          `Changed product to: ${selectedProduct}. Continue inserting coins.`,
          "alert-info"
        );
      });
    });
  });
});

// ================= COINS =================
coins5.addEventListener("click", () => insertCoin(5));
coins10.addEventListener("click", () => insertCoin(10));
ResetBtn.addEventListener("click", resetMachine);

// ================= STATE MACHINE LOGIC =================
function insertCoin(amount) {
  if (state === "Menu") {
    updateDFA("Please select a product first!", "alert-warning");
    return;
  }

  if (state === "Idle" || state === "QR-Wait") {
    updateDFA("Please scan QR first!", "alert-warning");
    return;
  }

  total += amount;

  switch (state) {
    case "Balance-0":
      if (amount === 5) changeState("Balance-5", "Balance = 5");
      if (amount === 10) changeState("Balance-10", "Balance = 10");
      break;

    case "Balance-5":
      if (amount === 5) changeState("Balance-10", "Balance = 10");
      if (amount === 10) changeState("Balance-15", "Balance = 15");
      break;

    case "Balance-10":
      if (amount === 5) changeState("Balance-15", "Balance = 15");
      if (amount === 10) changeState("Balance-20", "Balance = 20");
      break;

    case "Balance-15":
      if (amount === 5) changeState("Balance-20", "Balance = 20");
      if (amount === 10) changeState("Done", "");
      break;

    case "Balance-20":
      changeState("Done", "");
      break;
  }

  updateProgress();
}

// ================= CHANGE STATE =================
function changeState(newState, message) {
  state = newState;
  history.push(newState);

  if (newState !== "Done") {
    updateDFA(message, "alert-info");
    return;
  }

  // ================= DONE STATE =================
  let change = total - price;

  if (change > 0) {
    updateDFA(
      `🎉 Product dispensed! Total inserted: ${total} coins. Returned change: ${change} coins.`,
      "alert-success"
    );
  } else if (change === 0) {
    updateDFA(
      `🎉 Product dispensed! Exact payment (${total} coins).`,
      "alert-success"
    );
  } else {
    updateDFA(`🎉 Product dispensed!`, "alert-success");
  }
}

// ================= RESET MACHINE =================
function resetMachine() {
  total = 0;
  selectedProduct = "None";

  state = "Menu";
  history = ["Idle", "QR-Wait", "Menu"];

  document.querySelector(".selected-product").textContent = "None";

  updateProgress();
  updateDFA("Machine reset. Select a product.", "alert-secondary");
}

// ================= UI FUNCTIONS =================
function updateProgress() {
  const width = (total / price) * 100;
  document.querySelector(".progress-bar").style.width = width + "%";
  document.querySelector(".progress-label").textContent = `${total} / ${price}`;
}

function updateDFA(msg, alertClass) {
  document.querySelector(".CState").textContent = state;
  document.querySelector(".AState").textContent = total;

  const box = document.querySelector(".message");
  box.textContent = msg;

  box.classList.remove(
    "alert-success",
    "alert-warning",
    "alert-info",
    "alert-secondary"
  );
  box.classList.add(alertClass);

  document.querySelector(".state-history").textContent = history.join(" → ");
}
