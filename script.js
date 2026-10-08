const $ = id => document.getElementById(id);
const cakeStage = $('cakeStage'), giftStage = $('giftStage'), cardStage = $('cardStage');
let blown = false, opened = false;

//Tiup lilin
$('hit').addEventListener('click', () => {
  if (blown) return;
  blown = true;
  $('cake').classList.add('out');
  $('cakeHint').textContent = 'Yeay! 🎉';
  setTimeout(() => {
    cakeStage.classList.remove('show');
    giftStage.classList.add('show');
  }, 1800);
});

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
