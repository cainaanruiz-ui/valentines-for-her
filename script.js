const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const buttonsArea = document.getElementById("buttonsArea");
const result = document.getElementById("result");
const title = document.getElementById("title");
const subtitle = document.getElementById("subtitle");
const photoCollage = document.getElementById("photoCollage");

let dodges = 0;
const MAX_DODGES = 5;

/* ====== 10-photo collage ======
   Put your 10 JPG names here exactly as they exist in /assets.
   I added the 8 you sent. Add your last 2 at the bottom.
*/
const photoFiles = [
  "IMG_5719.jpg",
  "IMG_5784.jpg",
  "IMG_5695.jpg",
  "IMG_6140.jpg",
  "IMG_7121.jpg",
  "IMG_7663.jpg",
  "IMG_7733.jpg",
  "IMG_8943.jpg",
  // "YOUR_9TH.jpg",
  // "YOUR_10TH.jpg",
];

// Create scattered placements that avoid the center card zone
function placePhotos() {
  photoCollage.innerHTML = "";

  const vw = window.innerWidth;
  const vh = window.innerHeight;

  // Keep photos away from center where the card sits
  const centerBox = {
    x1: vw * 0.22,
    x2: vw * 0.78,
    y1: vh * 0.22,
    y2: vh * 0.82,
  };

  const taken = [];
  const maxTries = 120;

  photoFiles.forEach((file, i) => {
    const img = document.createElement("img");
    img.className = "float-img";
    img.src = `assets/${file}`;
    img.alt = "";

    // Slightly different float timing so it looks alive
    img.style.animationDelay = `${(i * 0.35) % 2.1}s`;
    img.style.animationDuration = `${6 + (i % 4) * 0.6}s`;

    // Pick a spot
    let x = 0, y = 0;
    const size = Math.max(90, Math.min(170, vw * 0.14));
    const pad = 14;

    for (let t = 0; t < maxTries; t++) {
      x = Math.random() * (vw - size - pad * 2) + pad;
      y = Math.random() * (vh - size - pad * 2) + pad;

      // avoid center card area
      const inCenter =
        x + size > centerBox.x1 && x < centerBox.x2 &&
        y + size > centerBox.y1 && y < centerBox.y2;

      if (inCenter) continue;

      // avoid heavy overlap with other photos
      const tooClose = taken.some(p => {
        const dx = (p.x - x);
        const dy = (p.y - y);
        return Math.hypot(dx, dy) < size * 0.78;
      });

      if (!tooClose) break;
    }

    taken.push({ x, y });

    img.style.left = `${x}px`;
    img.style.top = `${y}px`;

    const rot = (Math.random() * 14) - 7; // -7..7 degrees
    img.style.transform = `rotate(${rot}deg)`;

    photoCollage.appendChild(img);
  });
}

/* ====== YES button: ONLY moves when clicked ====== */
const spots = [
  { x: 10, y: 25 },
  { x: 80, y: 25 },
  { x: 15, y: 75 },
  { x: 82, y: 72 },
  { x: 50, y: 18 },
  { x: 50, y: 84 },
  { x: 25, y: 50 },
  { x: 75, y: 50 },
];

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

let lastSpot = -1;
function getNextSpot() {
  let idx = Math.floor(Math.random() * spots.length);
  if (idx === lastSpot) idx = (idx + 1) % spots.length;
  lastSpot = idx;
  return spots[idx];
}

function moveYesButtonToSpot(spot) {
  const areaRect = buttonsArea.getBoundingClientRect();
  const btnRect = yesBtn.getBoundingClientRect();

  const padding = 10;

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

function teaseLine(count) {
  const lines = [
    "Oops 😇 try again",
    "Hehe nope 😌💗",
    "You’re chasing love 😂",
    "Almosttt 😳",
    "Okay FINE… now you can click it 😘"
  ];
  return lines[Math.min(count - 1, lines.length - 1)];
}

yesBtn.addEventListener("click", (e) => {
  if (dodges < MAX_DODGES) {
    e.preventDefault();
    dodges++;
    subtitle.textContent = teaseLine(dodges);
    moveYesButtonToSpot(getNextSpot());
    return;
  }

  title.textContent = "MY VALENTINEEEE 💘💘💘";
  subtitle.textContent = "You’re stuck with me now 😭💕";
  result.classList.remove("hidden");

  noBtn.disabled = true;
  noBtn.style.opacity = "0.6";
  yesBtn.disabled = true;
  yesBtn.style.opacity = "0.9";
});

noBtn.addEventListener("click", () => {
  subtitle.textContent = "Mmm… incorrect answer 😌💗";
});

/* Run collage */
placePhotos();
window.addEventListener("resize", () => {
  // re-place on resize so it stays pretty on phone/computer
  placePhotos();
});
