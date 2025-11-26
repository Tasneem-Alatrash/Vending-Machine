const images = document.querySelectorAll("img");
const coins5 = document.querySelector(".coins5");
const coins10 = document.querySelector(".coins10");
const Reset = document.querySelector(".Reset");
const price = 25;
let total = 0;
let state = "q0";
let history = ["q0"];
let name = "None";

coins5.addEventListener("click", () => insertcoins(5));
coins10.addEventListener("click", () => insertcoins(10));
Reset.addEventListener("click", () => ResetMachine());

images.forEach((img) => {
  img.addEventListener("click", (e) => {
    name = e.target.alt;
    document.querySelector(".selected-product").textContent = name;
    updateDFA(`Product selected ${name}, Now insert coins.`, "alert-info");
  });
});

const insertcoins = (coins) => {
  if (name === "None") {
    updateDFA("Pleace select a product first ! ", "alert-warning");
    return;
  }
  total += coins;
  recalcState();
  history.push(state);
  if (total < price) {
    updateDFA(
      `Product : ${name}. Not enough. You still need ${price - total} coins `,
      "alert-info"
    );
  } else if (total === price) {
    updateDFA(`Product : ${name}. item dispensed.`, "alert-success");
  } else {
    updateDFA(
      `Product : ${name}. item dispensed. change returend ${total - price}`,
      "alert-success"
    );
  }
  UpdateProgressBar();
};

const UpdateProgressBar = () => {
  const width = (total / price) * 100;
  console.log(width);
  document.querySelector(".progress-bar").style.width = width + "%";
  document.querySelector(".progress-label").textContent = `${total} / ${price}`;
};

const ResetMachine = () => {
  total = 0;
  name = "None";
  history = ["q0"];
  state = "q0";

  document.querySelector(".selected-product").textContent = name;
  updateDFA("Waiting for coins...", "alert-secondry");
  UpdateProgressBar();
};

const updateDFA = (Message, alertClass) => {
  document.querySelector(".AState").textContent = total;
  document.querySelector(".CState").textContent = state;

  document.querySelector(".message").textContent = Message;
  document
    .querySelector(".message")
    .classList.remove("alert-success", "alert-warning", "alert-info");
  document.querySelector(".message").classList.add(`${alertClass}`);

  document.querySelector(".state-history").textContent = history.join(" → ");
};
const recalcState = () => {
  if (total >= price) {
    state = "qpaid";
  } else if (total === 0) {
    state = "q0";
  } else if (total === 5) {
    state = "q5";
  } else if (total === 10) {
    state = "q10";
  } else if (total === 15) {
    state = "q15";
  } else if (total === 20) {
    state = "q20";
  }
};
updateDFA("Waiting for coins...", "alert-secondry");
