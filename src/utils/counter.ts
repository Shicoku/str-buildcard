const circle = document.getElementById("countdownCircle") as HTMLElement;
let isLock = false;
let lockDuration = 30;
let countdownInterval: any;

export function counter() {
  const btn = document.getElementById("btn") as HTMLElement;
  const fgCircle = document.querySelector(".fg") as HTMLElement;
  const countText = document.querySelector(".count-text") as HTMLElement;

  isLock = true;
  btn.classList.add("locked");
  let remaining = lockDuration;
  circle.style.display = "flex";

  fgCircle.style.transition = "none";
  fgCircle.style.strokeDashoffset = "0";
  countText.textContent = `${remaining}`;

  setTimeout(() => {
    fgCircle.style.transition = `stroke-dashoffset ${lockDuration}s linear`;
    fgCircle.style.strokeDashoffset = "283";
  }, 50);

  countdownInterval = setInterval(() => {
    remaining--;
    countText.textContent = `${remaining}`;

    if (remaining <= 0) {
      clearInterval(countdownInterval);
      countText.textContent = "";
      fgCircle.style.transition = "none";
      fgCircle.style.strokeDashoffset = "0";
      circle.style.display = "none";

      isLock = false;
      btn.classList.remove("locked");
    }
  }, 1000);
}
