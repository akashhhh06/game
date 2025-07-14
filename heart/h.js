const heart = document.getElementById('heart');
let scale = 1;
let growing = true;

function animateHeart() {
  if (growing) {
    scale += 0.01;
    if (scale >= 1.13) growing = false;
  } else {
    scale -= 0.01;
    if (scale <= 1.0) growing = true;
  }
  heart.style.transform = `rotate(-45deg) scale(${scale})`;
  heart.style.boxShadow = `0 0 ${(scale-1)*80 + 15}px rgba(255,0,0,0.3)`;
  requestAnimationFrame(animateHeart);
}

animateHeart();