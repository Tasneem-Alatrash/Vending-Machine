let state = "Idle";
let history = ["Idle"];
let total = 0;
let selectedProduct = "None";
const price = 25;

const images = document.querySelectorAll("img");
const coins5 = document.querySelector(".coins5");
const coins10 = document.querySelector(".coins10");
const ResetBtn = document.querySelector(".Reset");

setTimeout(() => {
  document.getElementById("qr-wait-screen").style.display = "none";

  history.push("QR-Wait");
  state = "Menu";
  history.push("Menu");

  updateDFA("QR scanned. Select a product.", "alert-info");
  updateProgress();
}, 1500);

images.forEach((img) => {
  img.addEventListener("click", (e) => {
    selectedProduct = e.target.alt;
    document.querySelector(".selected-product").textContent = selectedProduct;

    if (!history.includes("Balance-0")) {
      state = "Balance-0";
      history.push("Balance-0");
      updateDFA(`Selected: ${selectedProduct}. Insert coins.`, "alert-info");
      return;
    }

    updateDFA(
      `Changed product to: ${selectedProduct}. Continue inserting coins.`,
      "alert-info"
    );
  });
});

const insertCoin = (amount) => {
  if (state === "Menu") {
    updateDFA("Please select a product first!", "alert-warning");
    return;
  }

  if (state === "Idle" || state === "QR-Wait") {
    updateDFA("Please scan QR first!", "alert-warning");
    return;
  }

  if (state === "Done") {
    total += amount;
    updateProgress();

    let change = total - price;

    updateDFA(
      `🎉 Product already dispensed! Extra ${amount} coins added. Total now: ${total}. Returned change: ${change}.`,
      "alert-success"
    );
    return;
  }

  total += amount;

  switch (state) {
    case "Balance-0":
      amount === 5 && changeState("Balance-5", "Balance = 5");
      amount === 10 && changeState("Balance-10", "Balance = 10");
      break;

    case "Balance-5":
      amount === 5 && changeState("Balance-10", "Balance = 10");
      amount === 10 && changeState("Balance-15", "Balance = 15");
      break;

    case "Balance-10":
      amount === 5 && changeState("Balance-15", "Balance = 15");
      amount === 10 && changeState("Balance-20", "Balance = 20");
      break;

    case "Balance-15":
      amount === 5 && changeState("Balance-20", "Balance = 20");
      amount === 10 && changeState("Done");
      break;

    case "Balance-20":
      changeState("Done");
      break;
  }

  updateProgress();
};

const changeState = (newState, msg = "") => {
  state = newState;
  history.push(newState);

  if (newState !== "Done") {
    updateDFA(msg, "alert-info");
    return;
  }

  let change = total - price;

  updateDFA(
    `🎉 Product dispensed! Total inserted: ${total} coins. Returned change: ${change} coins.`,
    "alert-success"
  );
};

const updateDFA = (message, alertClass) => {
  document.querySelector(".CState").textContent = state;
  document.querySelector(".AState").textContent = total;

  const box = document.querySelector(".message");
  box.textContent = message;
  box.className = `message alert ${alertClass}`;

  document.querySelector(".state-history").textContent = history.join(" → ");
};

const updateProgress = () => {
  const width = (total / price) * 100;
  document.querySelector(".progress-bar").style.width = `${width}%`;
  document.querySelector(".progress-label").textContent = `${total} / ${price}`;
};

const resetMachine = () => {
  total = 0;
  selectedProduct = "None";

  state = "Menu";
  history = ["Idle", "QR-Wait", "Menu"];

  document.querySelector(".selected-product").textContent = "None";

  updateProgress();
  updateDFA("Machine reset. Select a product.", "alert-secondary");
};

coins5.addEventListener("click", () => insertCoin(5));
coins10.addEventListener("click", () => insertCoin(10));
ResetBtn.addEventListener("click", () => resetMachine());
