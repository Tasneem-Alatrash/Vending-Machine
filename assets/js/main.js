const images = document.querySelectorAll("img");
const coins5 = document.querySelector(".coins5");
const coins10 = document.querySelector(".coins10");
const Reset = document.querySelector(".Reset");
const price = 25;
let total = 0;
let name = "None";

coins5.addEventListener("click", () => insertcoins(5));
coins10.addEventListener("click", () => insertcoins(10));
Reset.addEventListener("click", () => ResetMachine());

images.forEach((img) => {
  img.addEventListener("click", (e) => {
    name = e.target.alt;
    document.querySelector(".selected-product").textContent = name;
  });
});

const insertcoins = (coins) => {
  if (name === "None") {
    console.log("please enter product");
    return;
  }
  total += coins;
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
  document.querySelector(".selected-product").textContent = name;
  UpdateProgressBar();
};
