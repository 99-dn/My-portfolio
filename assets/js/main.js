
// ─── PARTICLES ───
(function() {
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function Particle() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = (Math.random() - 0.5) * 0.3;
    this.r = Math.random() * 1.5 + 0.5;
    this.alpha = Math.random() * 0.4 + 0.1;
  }

  function init() {
    resize();
    particles = [];
    for (let i = 0; i < 80; i++) particles.push(new Particle());
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,255,159,${p.alpha})`;
      ctx.fill();
    });
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,255,159,${0.06 * (1 - dist/100)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', init);
  init();
  draw();
})();

// ─── TYPEWRITER ───
(function() {
  const lines = [
    'connecting to dna.engineer...',
    'PING dna.engineer: 0ms latency',
    'connection established ✓',
    '> ready for collaboration'
  ];
  let li = 0, ci = 0;
  const el = document.getElementById('typewriterLine');

  function type() {
    if (li >= lines.length) { li = 0; }
    const line = lines[li];
    if (ci < line.length) {
      el.innerHTML = `<span class="cmd">&gt;</span> <span class="val">${line.slice(0, ci + 1)}<span class="cursor" style="width:7px;height:0.9em;display:inline-block;background:var(--accent);animation:blink 1s step-end infinite;vertical-align:middle;"></span></span>`;
      ci++;
      setTimeout(type, 50 + Math.random() * 30);
    } else {
      setTimeout(() => { li++; ci = 0; type(); }, 1800);
    }
  }
  setTimeout(type, 800);
})();

// ─── FILTER ───
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    document.querySelectorAll('.project-card').forEach(card => {
      if (f === 'all' || card.dataset.cat === f) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// ─── HAMBURGER ───
document.getElementById('hamburger').addEventListener('click', () => {
  document.getElementById('navLinks').classList.toggle('open');
});

document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => {
    document.getElementById('navLinks').classList.remove('open');
  });
});

// ─── PHOTO UPLOAD ───
document.getElementById('photoZone').addEventListener('click', () => {
  document.getElementById('photoInput').click();
});

document.getElementById('photoInput').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    const img = document.getElementById('profilePhoto');
    img.src = ev.target.result;
    img.style.display = 'block';
    document.querySelector('.photo-zone .placeholder-text').style.display = 'none';
    document.querySelector('.photo-zone .photo-icon').style.display = 'none';
  };
  reader.readAsDataURL(file);
});

// ─── MODAL ───
const certData = {
  cert1: { issuer: 'Issuing Body', name: 'Certificate Name Placeholder', date: 'Month YYYY' },
  cert2: { issuer: 'Issuing Body', name: 'Certificate Name Placeholder', date: 'Month YYYY' },
  cert3: { issuer: 'Issuing Body', name: 'Certificate Name Placeholder', date: 'Month YYYY' },
};

function openModal(id) {
  const d = certData[id];
  if (!d) return;
  document.getElementById('modalIssuer').textContent = d.issuer;
  document.getElementById('modalTitle').textContent = d.name;
  document.getElementById('modalDate').textContent = '// Issued: ' + d.date;
  document.getElementById('modalOverlay').classList.add('open');
}

function closeModal(e) {
  if (!e || e.target === document.getElementById('modalOverlay')) {
    document.getElementById('modalOverlay').classList.remove('open');
  }
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') document.getElementById('modalOverlay').classList.remove('open');
});

// ─── FORM — FORMSPREE ───
async function handleFormSubmit(e) {
  e.preventDefault();
  const btn = e.target;
  const form = btn.closest('section').querySelector('.contact-form');
  const data = {
    name: form.querySelector('input[name="name"]').value,
    email: form.querySelector('input[name="email"]').value,
    message: form.querySelector('textarea[name="message"]').value,
  };

  btn.textContent = '[ SENDING... ]';
  btn.disabled = true;

  try {
    const res = await fetch('https://formspree.io/f/mbdqqqjb', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data)
    });

    if (res.ok) {
      btn.textContent = '[ MESSAGE SENT ✓ ]';
      btn.style.borderColor = 'var(--accent)';
      btn.style.background = 'var(--accent-dim)';
      form.querySelector('input[name="name"]').value = '';
      form.querySelector('input[name="email"]').value = '';
      form.querySelector('textarea[name="message"]').value = '';
      setTimeout(() => {
        btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> Send Message';
        btn.style.borderColor = '';
        btn.style.background = '';
        btn.disabled = false;
      }, 3000);
    } else {
      btn.textContent = '[ ERROR — TRY AGAIN ]';
      btn.style.borderColor = '#ff5f57';
      btn.disabled = false;
      setTimeout(() => {
        btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> Send Message';
        btn.style.borderColor = '';
      }, 3000);
    }
  } catch (err) {
    btn.textContent = '[ ERROR — TRY AGAIN ]';
    btn.style.borderColor = '#ff5f57';
    btn.disabled = false;
    setTimeout(() => {
      btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> Send Message';
      btn.style.borderColor = '';
    }, 3000);
  }
}