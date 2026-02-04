const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const buttonsArea = document.getElementById("buttonsArea");
const result = document.getElementById("result");
const title = document.getElementById("title");
const subtitle = document.getElementById("subtitle");

let dodges = 0;
const MAX_DODGES = 5;

// Helper: keep the YES button inside the buttons area
function moveYesButton() {
  const areaRect = buttonsArea.getBoundingClientRect();
  const btnRect = yesBtn.getBoundingClientRect();

  const padding = 10;
  const maxX = areaRect.width - btnRect.width - padding;
  const maxY = areaRect.height - btnRect.height - padding;

  const x = Math.max(padding, Math.random() * maxX);
  const y = Math.max(padding, Math.random() * maxY);

  yesBtn.style.left = `${x}px`;
  yesBtn.style.top = `${y}px`;
  yesBtn.style.transform = `translate(0, 0)`;
}

// Make it dodge when she tries to click / hover it (desktop + mobile friendly)
function dodgeIfNeeded() {
  if (dodges < MAX_DODGES) {
    dodges++;
    moveYesButton();

    // little escalating tease
    const lines = [
      "Hehe try again 😇",
      "Not that easy 😌💗",
      "You want it bad huh 😭",
      "Okay okay one more 😳",
      "LAST ONE I PROMISE 😤💕"
    ];
    subtitle.textContent = lines[dodges - 1] || "Try again 💘";

    if (dodges === MAX_DODGES) {
      // After 5 dodges, let her finally click it
      subtitle.textContent = "Okayyyy you can click it now 😘";
    }
  }
}

// Trigger dodging
yesBtn.addEventListener("mouseenter", dodgeIfNeeded);
yesBtn.addEventListener("touchstart", (e) => {
  // stop accidental click on mobile; move it instead (until max)
  if (dodges < MAX_DODGES) e.preventDefault();
  dodgeIfNeeded();
}, { passive: false });

// After 5 dodges, clicking YES works
yesBtn.addEventListener("click", () => {
  if (dodges < MAX_DODGES) return; // still dodging

  title.textContent = "MY VALENTINEEEE 💘💘💘";
  subtitle.textContent = "I love you more than words 😭💕";

  result.classList.remove("hidden");
  noBtn.disabled = true;
  noBtn.style.opacity = "0.6";
  yesBtn.disabled = true;
  yesBtn.style.opacity = "0.85";
});

// Make NO button do something cute
noBtn.addEventListener("click", () => {
  subtitle.textContent = "Nice try 😌💗";
  // give a gentle nudge: increase yes size slightly
  const current = parseFloat(getComputedStyle(yesBtn).fontSize);
  yesBtn.style.fontSize = `${Math.min(current + 1.5, 26)}px`;
});
