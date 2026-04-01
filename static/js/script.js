// ─── CUSTOM CURSOR ───────────────────────────────────────────────
const cursor     = document.querySelector('.cursor');
const cursorRing = document.querySelector('.cursor-ring');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
  if (cursor) { cursor.style.left = mouseX + 'px'; cursor.style.top = mouseY + 'px'; }
});
function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  if (cursorRing) { cursorRing.style.left = ringX + 'px'; cursorRing.style.top = ringY + 'px'; }
  requestAnimationFrame(animateRing);
}
animateRing();

document.querySelectorAll('a, button, .feature-card, .form-control, .atag').forEach(el => {
  el.addEventListener('mouseenter', () => {
    if (!cursor || !cursorRing) return;
    cursor.style.width = '16px'; cursor.style.height = '16px';
    cursor.style.background = 'var(--accent-blue)';
    cursorRing.style.width = '50px'; cursorRing.style.height = '50px';
    cursorRing.style.opacity = '1';
  });
  el.addEventListener('mouseleave', () => {
    if (!cursor || !cursorRing) return;
    cursor.style.width = '12px'; cursor.style.height = '12px';
    cursor.style.background = 'var(--accent-cyan)';
    cursorRing.style.width = '36px'; cursorRing.style.height = '36px';
    cursorRing.style.opacity = '0.6';
  });
});

// ─── NEURAL NETWORK CANVAS ────────────────────────────────────────
const canvas = document.getElementById('neural-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  const NODE_COUNT = 75, MAX_DIST = 155, MOUSE_RANGE = 190;
  let nodes = [], frame = 0, packets = [];
  let cmx = innerWidth / 2, cmy = innerHeight / 2;

  function resize() { canvas.width = innerWidth; canvas.height = innerHeight; }
  resize();
  window.addEventListener('resize', () => { resize(); initNodes(); });
  window.addEventListener('mousemove', e => { cmx = e.clientX; cmy = e.clientY; });

  class Node {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * canvas.width;
      this.y  = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.45;
      this.vy = (Math.random() - 0.5) * 0.45;
      this.r  = Math.random() * 2.2 + 0.8;
      this.p  = Math.random() * Math.PI * 2;
    }
    update() {
      this.p += 0.018;
      const dx = cmx - this.x, dy = cmy - this.y;
      const d = Math.sqrt(dx*dx + dy*dy);
      if (d < MOUSE_RANGE) {
        const f = (MOUSE_RANGE - d) / MOUSE_RANGE * 0.014;
        this.vx -= dx * f; this.vy -= dy * f;
      }
      this.x += this.vx; this.y += this.vy;
      this.vx *= 0.996; this.vy *= 0.996;
      if (this.x < 0 || this.x > canvas.width)  this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      this.x = Math.max(0, Math.min(canvas.width, this.x));
      this.y = Math.max(0, Math.min(canvas.height, this.y));
    }
    draw() {
      const a = 0.45 + Math.sin(this.p) * 0.28;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,212,255,${a})`;
      ctx.shadowBlur = 7; ctx.shadowColor = '#00d4ff';
      ctx.fill(); ctx.shadowBlur = 0;
    }
  }

  function initNodes() { nodes = Array.from({length: NODE_COUNT}, () => new Node()); }
  initNodes();

  function spawnPacket() {
    const i = Math.floor(Math.random() * nodes.length);
    let best = -1, bestD = Infinity;
    for (let j = 0; j < nodes.length; j++) {
      if (j === i) continue;
      const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
      const d = Math.sqrt(dx*dx + dy*dy);
      if (d < MAX_DIST && d < bestD) { bestD = d; best = j; }
    }
    if (best !== -1) packets.push({ from: i, to: best, t: 0, color: Math.random() > 0.5 ? '#00ffcc' : '#7b2fff' });
  }

  function updatePackets() {
    packets = packets.filter(p => p.t < 1);
    packets.forEach(p => {
      p.t += 0.022;
      const x = nodes[p.from].x + (nodes[p.to].x - nodes[p.from].x) * p.t;
      const y = nodes[p.from].y + (nodes[p.to].y - nodes[p.from].y) * p.t;
      ctx.beginPath(); ctx.arc(x, y, 3.2, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.shadowBlur = 14; ctx.shadowColor = p.color;
      ctx.fill(); ctx.shadowBlur = 0;
    });
  }

  function drawNeural() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    frame++;
    for (let i = 0; i < nodes.length; i++) {
      nodes[i].update();
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
        const d = Math.sqrt(dx*dx + dy*dy);
        if (d < MAX_DIST) {
          const a = (1 - d / MAX_DIST) * 0.5;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          if (d < 75) {
            const pulse = (Math.sin(frame * 0.035 + i) + 1) / 2;
            ctx.strokeStyle = `rgba(0,255,204,${a * pulse})`;
            ctx.lineWidth = 0.9;
          } else {
            ctx.strokeStyle = `rgba(0,90,160,${a * 0.55})`;
            ctx.lineWidth = 0.5;
          }
          ctx.stroke();
        }
      }
    }
    nodes.forEach(n => n.draw());
    if (frame % 55 === 0) spawnPacket();
    updatePackets();
    requestAnimationFrame(drawNeural);
  }
  drawNeural();
}

// ─── INTERSECTION OBSERVER — feature cards ────────────────────────
const io = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.feature-card').forEach((card, i) => {
  card.style.transitionDelay = `${i * 0.09}s`;
  io.observe(card);
});

// ─── GLITCH TITLE ────────────────────────────────────────────────
const titleLine1 = document.querySelector('.hero-title .line1');
if (titleLine1) {
  setInterval(() => {
    if (Math.random() < 0.1) {
      const ox = (Math.random() - 0.5) * 7;
      titleLine1.style.textShadow = `${ox}px 0 #00d4ff, ${-ox}px 0 #7b2fff`;
      setTimeout(() => { titleLine1.style.textShadow = ''; }, 75);
    }
  }, 900);
}

// ─── TYPING EYEBROW ──────────────────────────────────────────────
const eyebrow = document.querySelector('.hero-eyebrow');
if (eyebrow) {
  const text = eyebrow.textContent;
  eyebrow.textContent = '';
  let idx = 0;
  setTimeout(() => {
    const iv = setInterval(() => {
      eyebrow.textContent += text[idx++];
      if (idx >= text.length) clearInterval(iv);
    }, 50);
  }, 500);
}

// ─── FORM FIELD ACTIVE GLOW ──────────────────────────────────────
document.querySelectorAll('.form-control').forEach(el => {
  el.addEventListener('focus', () => {
    el.closest('.field-group')?.classList.add('field-active');
  });
  el.addEventListener('blur', () => {
    el.closest('.field-group')?.classList.remove('field-active');
  });
});

// ─── SUBMIT BUTTON LOADING ───────────────────────────────────────
const submitBtn = document.querySelector('.submit-btn');
const formEl    = document.querySelector('form');
if (submitBtn && formEl) {
  formEl.addEventListener('submit', () => {
    submitBtn.textContent = '⚙  PROCESSING…';
    submitBtn.style.opacity = '0.75';
  });
}