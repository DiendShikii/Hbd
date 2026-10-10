const $ = id => document.getElementById(id);
const cakeStage = $('cakeStage'), giftStage = $('giftStage'), cardStage = $('cardStage');
let blown = false, opened = false;

//Tiup lilin
const NS = 'http://www.w3.org/2000/svg';
const flames = [...document.querySelectorAll('.flameG')];
const glows  = [...document.querySelectorAll('.gl')];
const OUT_AT = [620, 470, 780];

$('hit').addEventListener('click', () => {
  if (blown) return;
  blown = true;
  cakeStage.classList.add('blown');
  $('cake').classList.add('blowing');
  $('cakeHint').textContent = '💨';
  whoosh();
  flames.forEach((f, i) => setTimeout(() => extinguish(f, i), OUT_AT[i]));
  setTimeout(() => { $('cakeHint').textContent = '🎉'; }, 1100);
  setTimeout(() => {
    cakeStage.classList.remove('show');
    giftStage.classList.add('show');
  }, 3600);
});

function extinguish(f, i) {
  f.classList.add('dead');
  glows[i].classList.add('off');
  smoke(+f.dataset.x, +f.dataset.y);
}

//Asap melayang & meliuk
function smoke(x, y) {
  const layer = $('smokeLayer');
  for (let i = 0; i < 14; i++) {
    const c = document.createElementNS(NS, 'circle');
    c.setAttribute('cx', x);
    c.setAttribute('cy', y);
    c.setAttribute('r', 3 + Math.random() * 3);
    c.setAttribute('fill', '#e8e8e8');
    c.setAttribute('filter', 'url(#smokeBlur)');
    c.style.transformBox = 'fill-box';
    c.style.transformOrigin = 'center';
    layer.appendChild(c);

    const rise  = 120 + Math.random() * 70;
    const sway  = 8 + Math.random() * 14;
    const drift = 20 + Math.random() * 25;
    const phase = Math.random() * 6.28;
    const steps = 10, kf = [];
    for (let s = 0; s <= steps; s++) {
      const t = s / steps;
      const dx = Math.sin(t * 5 + phase) * sway * (.3 + t) + drift * t * t;
      const op = t < .15 ? (t / .15) * .45 : .45 * Math.pow(1 - (t - .15) / .85, 1.4);
      kf.push({
        transform: `translate(${dx}px, ${-rise * t}px) scale(${.6 + t * 3.2})`,
              opacity: op
      });
    }
    c.animate(kf, {
      duration: 2600 + Math.random() * 1200,
              delay: i * 90 + Math.random() * 60,
              easing: 'ease-out',
              fill: 'both'
    }).onfinish = () => c.remove();
  }
}

//Suara tiupan
function whoosh() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    const ctx = new AC(), t = ctx.currentTime;
    const len = Math.floor(ctx.sampleRate * 1.1);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.Q.value = .7;
    bp.frequency.setValueAtTime(1000, t);
    bp.frequency.linearRampToValueAtTime(2200, t + .6);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(.25, t + .08);
    g.gain.exponentialRampToValueAtTime(.001, t + .9);
    src.connect(bp).connect(g).connect(ctx.destination);
    src.start(t);
    src.onended = () => ctx.close();
  } catch (e) {}
}

//Buka kado
$('gift').addEventListener('click', () => {
  if (opened) return;
  opened = true;
  $('gift').classList.add('opened');
  $('giftHint').style.opacity = 0;
  burst();
  setTimeout(() => {
    giftStage.classList.remove('show');
    cardStage.classList.add('show');
  }, 2200);
});

//Bintang & konfeti
function burst() {
  const r = $('gift').getBoundingClientRect();
  const cx = r.left + r.width / 2, cy = r.top + r.height * 0.4;
  const cols = ['#ffd45a', '#e8591f', '#d23a2e', '#fff', '#f5a623', '#9fb3d9'];
  for (let i = 0; i < 46; i++) {
    const p = document.createElement('div');
    p.className = 'pop';
    const star = i % 3 === 0;
    p.textContent = star ? '★' : '';
    p.style.cssText =
    `left:${cx}px;top:${cy}px;color:${cols[i % cols.length]};font-size:${14 + Math.random() * 16}px;` +
    (star ? '' : `width:8px;height:14px;background:${cols[i % cols.length]};`) +
    `--dx:${(Math.random() - .5) * Math.min(innerWidth, 700)}px;` +
    `--dy:${-80 - Math.random() * Math.min(innerHeight * .6, 380)}px;` +
    `--r:${Math.random() * 720 - 360}deg;animation-delay:${Math.random() * .25}s`;
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 1900);
  }
}
