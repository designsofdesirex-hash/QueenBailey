const palettePicker = document.querySelector(".palette-picker");
const paletteButton = document.querySelector("#palette-toggle");
const paletteMenu = document.querySelector("#palette-menu");
const paletteStatus = document.querySelector("#palette-status");
const paletteOptions = [...document.querySelectorAll(".palette-option")];
const themeColors = {
  "original-garnet": "#0B0908",
  "obsidian-gold": "#050505",
  "ivory-ink": "#F0EADF",
  "sapphire-platinum": "#10213B",
  "emerald-brass": "#14241D",
};

function setPalette(name, save = true) {
  const selected = paletteOptions.find((option) => option.dataset.themeChoice === name);
  if (!selected) return;

  document.documentElement.dataset.theme = name;
  paletteOptions.forEach((option) => {
    option.setAttribute("aria-pressed", String(option === selected));
  });
  paletteStatus.textContent = `${selected.dataset.paletteName} is active.`;
  document.querySelector('meta[name="theme-color"]').setAttribute("content", themeColors[name]);

  if (save) {
    try {
      localStorage.setItem("queen-bailey-original-palette", name);
    } catch {
      // The palette still changes when storage is unavailable.
    }
  }
}

function setPaletteMenuOpen(isOpen) {
  paletteButton.setAttribute("aria-expanded", String(isOpen));
  paletteMenu.hidden = !isOpen;
}

paletteButton.addEventListener("click", () => {
  setPaletteMenuOpen(paletteButton.getAttribute("aria-expanded") !== "true");
});

paletteOptions.forEach((option) => {
  option.addEventListener("click", () => {
    setPalette(option.dataset.themeChoice);
    setPaletteMenuOpen(false);
    paletteButton.focus();
  });
});

document.addEventListener("click", (event) => {
  if (!palettePicker.contains(event.target)) setPaletteMenuOpen(false);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && paletteButton.getAttribute("aria-expanded") === "true") {
    setPaletteMenuOpen(false);
    paletteButton.focus();
  }
});

try {
  const savedPalette = localStorage.getItem("queen-bailey-original-palette");
  if (savedPalette) setPalette(savedPalette, false);
} catch {
  // Keep the authored default when storage is unavailable.
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', () => {
    document.body.dataset.lastAction = link.getAttribute('href');
  });
});

const slideshowPools = {
  hero: 10,
  lifestyle: 13,
  alpha: 8,
};

const slideshowElements = document.querySelectorAll('[data-slideshow]');
const slideshowState = new Map();

function slidePath(pool, index) {
  return `assets/slideshow/${pool}/${String(index + 1).padStart(2, "0")}.jpg`;
}

function setSlide(element, pool, index) {
  const nextPath = slidePath(pool, index % slideshowPools[pool]);
  const commit = () => {
    element.classList.add("is-slideshow-fading");
    window.setTimeout(() => {
      if (element.matches("img")) {
        element.src = nextPath;
      } else {
        element.style.backgroundImage = `url("${nextPath}")`;
      }
      element.classList.remove("is-slideshow-fading");
    }, 220);
  };

  if (element.matches("img")) {
    const preload = new Image();
    preload.onload = commit;
    preload.onerror = () => element.classList.remove("is-slideshow-fading");
    preload.src = nextPath;
    return;
  }

  commit();
}

slideshowElements.forEach((element) => {
  const pool = element.dataset.slideshow;
  const offset = Number(element.dataset.slideOffset || 0);
  slideshowState.set(element, offset);

  if (element.matches("img")) {
    element.src = slidePath(pool, offset);
  } else {
    element.style.backgroundImage = `url("${slidePath(pool, offset)}")`;
  }
});

window.setInterval(() => {
  slideshowElements.forEach((element) => {
    const pool = element.dataset.slideshow;
    const nextIndex = (slideshowState.get(element) + 1) % slideshowPools[pool];
    slideshowState.set(element, nextIndex);
    setSlide(element, pool, nextIndex);
  });
}, 6000);
