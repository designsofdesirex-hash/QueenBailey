document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', () => {
    document.body.dataset.lastAction = link.getAttribute('href');
  });
});

const slideshowPools = {
  hero: 10,
  lifestyle: 13,
  alpha: 8,
  humiliation: 9,
  femsubs: 4,
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
