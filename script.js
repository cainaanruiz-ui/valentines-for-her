const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const buttonsArea = document.getElementById("buttonsArea");
const result = document.getElementById("result");
const title = document.getElementById("title");
const subtitle = document.getElementById("subtitle");

let dodges = 0;
const MAX_DODGES = 5;

// A set of spread-out "landing spots" (percent-based)
const spots = [
  { x: 12, y: 25 },
  { x: 78, y: 28 },
  { x: 18, y: 72 },
  { x: 80, y: 70 },
  { x: 50, y: 20 },
  { x: 50, y: 82 },
  { x: 25, y: 50 },
  { x: 75, y: 50 },
];

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function moveYesButtonToSpot(spot) {
  const areaRect = buttonsArea.getBoundingClientRect();
  const btnRect = yesBtn.getBoundingClientRect();

  // Convert spot percent -> px, then clamp within bounds
  const padding = 8;
  const xPx = (spot.x / 100) * areaRect.width;
  const yPx = (spot.y / 100) * areaRect.height;

  const maxX = areaRect.width - btnRect.width - padding;
  const maxY = areaRect.height - btnRect.height - padding;

  const x = clamp(xPx, padding, maxX);
  const y = clamp(yPx, padding, maxY);

  yesBtn.style.left = `${x}px`;
  yesBtn.style.top = `${y}px`;
  yesBtn.style.transform = `translate(0,0)`;
}

// Pick a spot that's not the same as last time
let lastIndex = -1;
function getNextSpot() {
  let idx = Math.floor(Math.random() * spots.length);
  if (idx === lastIndex) idx = (idx + 1) % spots.length;
  lastIndex = idx;
  return spots[idx];
}

function teaseLine(count) {
  const lines = [
    "Oops 😇 try again",
    "Hehe nope 😌💗",
    "You’re chasing reina 😂",
    "Almosttt 😳",
    "Okay FINE… now you can click it 😘"
  ];
  return lines[Math.min(count - 1, lines.length - 1)];
}

// CLICK to dodge (up to 5). After that, click works.
yesBtn.addEventListener("click", (e) => {
  if (dodges < MAX_DODGES) {
    e.preventDefault();
    dodges++;

    subtitle.textContent = teaseLine(dodges);

    // Move to a spread-out location
    moveYesButtonToSpot(getNextSpot());

    return;
  }

  // Success state
  title.textContent = "MY VALENTINEEEE 💘💘💘";
  subtitle.textContent = "You’re stuck with me now 😭💕";

  result.classList.remove("hidden");
  noBtn.disabled = true;
  noBtn.style.opacity = "0.6";
  yesBtn.disabled = true;
  yesBtn.style.opacity = "0.9";
});

// NO button: cute response
noBtn.addEventListener("click", () => {
  subtitle.textContent = "Mmm… incorrect answer 😌💗";
});

