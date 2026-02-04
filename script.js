function placePhotos() {
  photoCollage.innerHTML = "";

  const vw = window.innerWidth;
  const vh = window.innerHeight;

  // Match the CSS clamp ranges so placement feels correct
  const size = vw <= 520
    ? Math.max(110, Math.min(170, vw * 0.34))
    : Math.max(120, Math.min(220, vw * 0.18));

  const pad = 12;

  // Keep photos away from the center card region (bigger safety zone on mobile)
  const centerBox = vw <= 520
    ? { x1: vw * 0.12, x2: vw * 0.88, y1: vh * 0.18, y2: vh * 0.88 }
    : { x1: vw * 0.22, x2: vw * 0.78, y1: vh * 0.22, y2: vh * 0.82 };

  const taken = [];
  const maxTries = 160;

  // On mobile, show fewer photos so it doesn’t look crowded
  const filesToUse = vw <= 520 ? photoFiles.slice(0, 6) : photoFiles;

  filesToUse.forEach((file) => {
    const img = document.createElement("img");
    img.className = "float-img";
    img.src = `assets/${file}`;
    img.alt = "";

    // SAME speed for all — only stagger start time so they don’t move in sync
    img.style.animationDelay = `${Math.random() * 2.2}s`;

    let x = 0, y = 0;

    for (let t = 0; t < maxTries; t++) {
      x = Math.random() * (vw - size - pad * 2) + pad;
      y = Math.random() * (vh - size - pad * 2) + pad;

      // avoid center card area
      const inCenter =
        x + size > centerBox.x1 && x < centerBox.x2 &&
        y + size > centerBox.y1 && y < centerBox.y2;
      if (inCenter) continue;

      // avoid overlap (a bit looser on desktop, tighter on mobile)
      const minDist = vw <= 520 ? size * 0.78 : size * 0.70;
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


