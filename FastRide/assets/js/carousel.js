let currentIndex = 0;

function showImage(index) {
  const images = document.querySelectorAll('.carousel-img');
  if (!images.length) return;
  images.forEach((img, i) => {
    img.classList.toggle('active', i === index);
  });
}

function prevImage() {
  const images = document.querySelectorAll('.carousel-img');
  if (!images.length) return;
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  showImage(currentIndex);
}

function nextImage() {
  const images = document.querySelectorAll('.carousel-img');
  if (!images.length) return;
  currentIndex = (currentIndex + 1) % images.length;
  showImage(currentIndex);
}

document.addEventListener('DOMContentLoaded', () => {
  showImage(currentIndex);
});
