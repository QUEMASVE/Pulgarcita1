// 🎵 Música y fondo animado al cargar
window.addEventListener('load', () => {
  const music = document.getElementById('bgMusic');
  music.volume = 0.5;
  music.play().catch(() => {}); // intenta reproducir apenas carga
  animateBackground();
});

// Ocultar overlay tras animación
document.getElementById('rotateOverlay').addEventListener('animationend', () => {
  document.getElementById('rotateOverlay').style.display = 'none';
});

// Abrir carta con edad integrada en UI
document.getElementById('enterBtn').addEventListener('click', () => {
  const ageInput = document.getElementById('age');
  const age = ageInput.value;
  if (!age || age < 1) return;
  document.getElementById('displayAge').textContent = age;
  document.getElementById('card').classList.add('hidden');
  document.getElementById('letterModal').classList.remove('hidden');
  document.getElementById('bgMusic').play().catch(()=>{});
  initScratch();
});

// Fondo animado con palabras
function animateBackground() {
  const words = ['Feliz Cumpleaños','Te Amo','🎉','❤️'];
  const bg = document.getElementById('background');
  setInterval(() => {
    const span = document.createElement('div');
    span.className = 'word';
    span.textContent = words[Math.floor(Math.random()*words.length)];
    span.style.left = Math.random()*100 + 'vw';
    span.style.animationDuration = (Math.random()*5 + 3) + 's';
    bg.append(span);
    setTimeout(() => span.remove(), 8000);
  }, 400);
}

// Scratch-off QR que funciona en PC y celular
function initScratch() {
  const canvas = document.getElementById('scratchCanvas');
  const ctx = canvas.getContext('2d');
  const { width, height } = canvas.getBoundingClientRect();
  canvas.width = width;
  canvas.height = height;
  ctx.fillStyle = '#bbb';
  ctx.fillRect(0, 0, width, height);
  ctx.globalCompositeOperation = 'destination-out';

  let scratching = false;
  const total = width * height;

  function updateScratched() {
    const img = ctx.getImageData(0, 0, width, height);
    let cnt = 0;
    for (let i = 3; i < img.data.length; i += 4) {
      if (img.data[i] < 255) cnt++;
    }
    if (cnt > total * 0.5) {
      canvas.remove();
    }
  }

  function draw(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, 25, 0, 2 * Math.PI);
    ctx.fill();
    updateScratched();
  }

  canvas.addEventListener('pointerdown', e => {
    scratching = true;
    const rect = canvas.getBoundingClientRect();
    draw(e.clientX - rect.left, e.clientY - rect.top);
  });

  canvas.addEventListener('pointerup', () => scratching = false);
  canvas.addEventListener('pointerleave', () => scratching = false);

  canvas.addEventListener('pointermove', e => {
    if (!scratching) return;
    const rect = canvas.getBoundingClientRect();
    draw(e.clientX - rect.left, e.clientY - rect.top);
  });
}
