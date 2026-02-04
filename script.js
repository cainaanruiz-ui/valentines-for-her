// ===== Grab elements =====
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const buttonsArea = document.getElementById("buttonsArea");
const result = document.getElementById("result");
const title = document.getElementById("title");
const subtitle = document.getElementById("subtitle");
const photoCollage = document.getElementById("photoCollage");

// ===== Settings =====
let dodges = 0;
const MAX_DODGES = 5;

// Put your JPG names here EXACTLY as they are in /assets
// I added the 8 you sent. Add your last 2 where noted.
const photoFiles = [
  "IMG_5695.jpg",
  "IMG_5719.jpg",
  "IMG_5784.jpg",
  "IMG_6140.jpg",
  "IMG_7121.jpg",
  "IMG_7663.jpg",
  "IMG_7733.jpg",
  "IMG_8943.jpg",
  // "IMG_XXXX.jpg", // <- add photo 9
  // "IMG_YYYY.jpg", // <- add photo 10
];

// ===== Helpers =====
function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function isMobile() {
  return window.innerWidth <= 520;
}

// ===== Photo Collage Placement =====
function placePhotos() {
  if (!photoCollage) return;

  photoCollage.innerHTML = "";

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const mobile = isMobile();

  // Match the CSS size logic so placement is correct
  const size = mobile
    ? Math.max(110, Math.min(170, vw * 0.34))
    : Math.max(120, Math.min(220, vw * 0.18));

  const pad = 12;

  // Keep photos away from the center card zone (bigger safe zone on mobile)
  const centerBox = mobile
    ? { x1: vw * 0.12, x2: vw * 0.88, y1: vh * 0.18, y2: vh * 0.88 }
    : { x1: vw * 0.22, x2: vw * 0.78, y1: vh * 0.22, y2: vh * 0.82 };

  const maxTries = 180;
  const taken = [];

  // On mobile, fewer photos so it stays pretty
  const filesToUse = mobile ? photoFiles.slice(0, 6) : photoFiles;

  filesToUse.forEach((file) => {
    const img = document.createElement("img");
    img.className = "float-img";
    img.src = `assets/${file}`;
    img.alt = "";

    // same speed for all; different start time so they don't move in sync
    img.style.animationDelay = `${Math.random() * 2.2}s`;

    let x = 0, y = 0;

    for (let t = 0; t < maxTries; t++) {
      x = Math.random() * (vw - size - pad * 2) + pad;
      y = Math.random() * (vh - size - pad * 2) + pad;

      // Avoid center card area
      const inCenter =
        x + size > centerBox.x1 && x < centerBox.x2 &&
        y + size > centerBox.y1 && y < centerBox.y2;
      if (inCenter) continue;

      // Avoid heavy overlap
      const minDist = mobile ? size * 0.80 : size * 0.70;
      const tooClose = taken.some(p => Math.hypot(p.x - x, p.y - y) < minDist);
      if (tooClose) continue;

      break;
    }

    taken.push({ x, y });

    img.style.left = `${x}px`;
    img.style.top = `${y}px`;

    const rot = (Math.random() * 12) - 6; // -6..6 degrees
    img.style.transform = `rotate(${rot}deg)`;

    photoCollage.appendChild(img);
  });
}

// ===== YES Button Movement (ONLY on click) =====
const spots = [
  { x: 10, y: 25 },
  { x: 80, y: 25 },
  { x: 15, y: 78 },
  { x: 85, y: 72 },
  { x: 50, y: 18 },
  { x: 50, y: 84 },
  { x: 25, y: 50 },
  { x: 75, y: 50 },
];

let lastSpot = -1;

function getNextSpot() {
  let idx = Math.floor(Math.random() * spots.length);
  if (idx === lastSpot) idx = (idx + 1) % spots.length;
  lastSpot = idx;
  return spots[idx];
}

function moveYesButtonToSpot(spot) {
  if (!buttonsArea || !yesBtn) return;

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
  yesBtn.style.transform = "translate(0,0)";
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

// ===== Button handlers =====
if (yesBtn) {
  yesBtn.addEventListener("click", (e) => {
    // dodge phase
    if (dodges < MAX_DODGES) {
      e.preventDefault();
      dodges++;

      if (subtitle) subtitle.textContent = teaseLine(dodges);
      moveYesButtonToSpot(getNextSpot());

      return;
    }

    // success phase
    if (title) title.textContent = "MY VALENTINEEEE 💘💘💘";
    if (subtitle) subtitle.textContent = "You’re stuck with me now 😭💕";
    if (result) result.classList.remove("hidden");

    if (noBtn) {
      noBtn.disabled = true;
      noBtn.style.opacity = "0.6";
    }

    yesBtn.disabled = true;
    yesBtn.style.opacity = "0.9";
  });
}

if (noBtn) {
  noBtn.addEventListener("click", () => {
    if (subtitle) subtitle.textContent = "Mmm… incorrect answer 😌💗";
  });
}

// ===== Init =====
placePhotos();

// Re-place on resize so it always looks good
let resizeTimer = null;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(placePhotos, 150);
});




