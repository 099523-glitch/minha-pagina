/* ============================================================
   $5,000 CASH DRAW WHEEL — premium prize wheel logic (vanilla JS)
   Public API:  spinWheel("US$ 1.000")     -> always lands exactly there
                spinWheel()                -> system picks a weighted prize
   Unlocks at 90% progress (or 30 days).
   ============================================================ */
(function () {
  'use strict';

  /* ---------- 1. Prize data ---------------------------------- */
  // color keys map to CSS palette; icon uses emoji (no dependencies)
  var C = { green: '#10b981', blue: '#3b82f6', purple: '#8b5cf6', orange: '#f59e0b', red: '#ef4444', gold: '#f4c025' };

  // order = clockwise from the top. weight = relative chance for system pick.
  var PRIZES = [
    { name: '+1 Draw Entry',         short: '+1 Entry', icon: '🎟️', color: C.blue,   weight: 20 },
    { name: 'US$ 10 Bonus',          short: 'US$ 10',   icon: '💵', color: C.green,  weight: 16 },
    { name: 'Try Again',             short: 'Again',    icon: '❌', color: C.red,    weight: 16 },
    { name: '+3 Draw Entries',       short: '+3 Entries',icon: '🎫', color: C.purple, weight: 10 },
    { name: 'US$ 25 Bonus',          short: 'US$ 25',   icon: '💵', color: C.green,  weight: 12 },
    { name: 'Extra Spin',            short: 'Extra Spin',icon: '🔄', color: C.blue,   weight: 10 },
    { name: 'US$ 50 Bonus',          short: 'US$ 50',   icon: '💵', color: C.green,  weight: 8  },
    { name: 'Mystery Box',           short: 'Box',      icon: '🎁', color: C.orange, weight: 6  },
    { name: '+5 Draw Entries',       short: '+5 Entries',icon: '🎫', color: C.purple, weight: 6  },
    { name: 'US$ 100 Bonus',         short: 'US$ 100',  icon: '💵', color: C.green,  weight: 5  },
    { name: 'Try Again',             short: 'Again',    icon: '❌', color: C.red,    weight: 14 },
    { name: 'US$ 250 Bonus',         short: 'US$ 250',  icon: '💵', color: C.red,    weight: 3  },
    { name: 'Double Entry',          short: '2× Entry', icon: '✨', color: C.blue,   weight: 4  },
    { name: 'US$ 500 Bonus',         short: 'US$ 500',  icon: '💰', color: C.orange, weight: 2  },
    { name: '+10 Draw Entries',      short: '+10 Entries',icon: '🎫', color: C.purple, weight: 2 },
    { name: 'US$ 1.000 Bonus',       short: 'US$ 1K',   icon: '💰', color: C.red,    weight: 2  },
    { name: 'VIP Draw Entry',        short: 'VIP Entry',icon: '⭐', color: C.gold,   weight: 2  },
    { name: 'US$ 2.500 Bonus',       short: 'US$ 2.5K', icon: '💎', color: C.purple, weight: 1  },
    { name: 'Priority Entry',        short: 'Priority', icon: '🚀', color: C.orange, weight: 2  },
    { name: 'iPhone Pro',            short: 'iPhone',   icon: '📱', color: C.blue,   weight: 1  },
    { name: 'Golden Ticket',         short: 'Golden',   icon: '🎖️', color: C.green,  weight: 1  },
    { name: '$5,000 Draw Entry',     short: '$5K DRAW', icon: '🏆', color: C.gold,   weight: 1  }
  ];

  var N = PRIZES.length;              // 22
  var SEG = 360 / N;                  // segment angle

  /* ---------- 2. DOM refs ----------------------------------- */
  var wheel = document.getElementById('wheel');
  var labels = document.getElementById('labels');
  var ledRing = document.getElementById('ledRing');
  var shell = document.getElementById('wheelShell');
  var pointer = document.getElementById('pointer');
  var spinBtn = document.getElementById('spinBtn');
  var hubText = document.getElementById('hubText');
  var locked = document.getElementById('locked');
  var lockSub = document.getElementById('lockSub');
  var legend = document.getElementById('legend');
  var modal = document.getElementById('modal');
  var modalPrize = document.getElementById('modalPrize');
  var modalEmoji = document.getElementById('modalEmoji');
  var closeModal = document.getElementById('closeModal');
  var claimBtn = document.getElementById('claimBtn');
  var muteBtn = document.getElementById('muteBtn');
  var fx = document.getElementById('fx');

  /* ---------- 3. Build the wheel ---------------------------- */
  // colored wedges via conic-gradient with hard stops
  (function buildWheel() {
    var stops = [];
    for (var i = 0; i < N; i++) {
      var a0 = (i * SEG).toFixed(3) + 'deg';
      var a1 = ((i + 1) * SEG).toFixed(3) + 'deg';
      // slight radial shading per wedge for depth
      stops.push(PRIZES[i].color + ' ' + a0 + ' ' + a1);
    }
    wheel.style.background = 'conic-gradient(from 0deg, ' + stops.join(', ') + ')';
    // subtle inner darkening + separators
    wheel.style.boxShadow = 'inset 0 0 70px rgba(0,0,0,.35)';

    // thin separator lines between wedges (overlay)
    var sep = document.createElement('div');
    sep.style.position = 'absolute'; sep.style.inset = '0'; sep.style.borderRadius = '50%';
    var seps = [];
    for (var s = 0; s < N; s++) seps.push('rgba(0,0,0,.28) ' + (s * SEG).toFixed(3) + 'deg ' + (s * SEG + 0.6).toFixed(3) + 'deg, transparent ' + (s * SEG + 0.6).toFixed(3) + 'deg ' + ((s + 1) * SEG).toFixed(3) + 'deg');
    sep.style.background = 'conic-gradient(from 0deg, ' + seps.join(', ') + ')';
    wheel.appendChild(sep);

    // labels (spokes)
    for (var j = 0; j < N; j++) {
      var seg = document.createElement('div');
      seg.className = 'seg';
      seg.style.transform = 'rotate(' + (j * SEG + SEG / 2) + 'deg)';
      seg.innerHTML = '<span class="ico">' + PRIZES[j].icon + '</span><span class="nm">' + PRIZES[j].short + '</span>';
      labels.appendChild(seg);
    }
  })();

  // LED ring dots
  (function buildLeds() {
    var count = 32, r = 50; // percent radius
    for (var i = 0; i < count; i++) {
      var ang = (i / count) * Math.PI * 2;
      var x = 50 + Math.cos(ang) * r;
      var y = 50 + Math.sin(ang) * r;
      var d = document.createElement('div');
      d.className = 'led';
      d.style.left = x + '%'; d.style.top = y + '%';
      d.style.transform = 'translate(-50%,-50%)';
      d.style.animationDelay = (i * 0.03) + 's';
      ledRing.appendChild(d);
    }
  })();

  // legend (categories by colour)
  (function buildLegend() {
    var cats = [
      ['Cash bonus', C.green], ['Draw entries', C.blue], ['Bonus entries', C.purple],
      ['Specials', C.orange], ['Big cash', C.red], ['Grand draw', C.gold]
    ];
    legend.innerHTML = cats.map(function (c) {
      return '<span class="lg"><span class="sw" style="background:' + c[1] + '"></span>' + c[0] + '</span>';
    }).join('');
  })();

  /* ---------- 4. Sound (WebAudio tick) ---------------------- */
  var audioCtx = null, muted = false;
  function ensureAudio() { if (!audioCtx) { try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} } }
  function tick(freq) {
    if (muted || !audioCtx) return;
    var t = audioCtx.currentTime;
    var o = audioCtx.createOscillator(), g = audioCtx.createGain();
    o.type = 'triangle'; o.frequency.value = freq || 620;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.12, t + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);
    o.connect(g); g.connect(audioCtx.destination); o.start(t); o.stop(t + 0.07);
  }
  function fanfare() {
    if (muted || !audioCtx) return;
    [523, 659, 784, 1047].forEach(function (f, i) {
      setTimeout(function () {
        var t = audioCtx.currentTime, o = audioCtx.createOscillator(), g = audioCtx.createGain();
        o.type = 'triangle'; o.frequency.value = f;
        g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.18, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.4);
        o.connect(g); g.connect(audioCtx.destination); o.start(t); o.stop(t + 0.42);
      }, i * 110);
    });
  }
  muteBtn.addEventListener('click', function () { muted = !muted; muteBtn.classList.toggle('muted', muted); });

  /* ---------- 5. Unlock state (login + 70% progress) -------- */
  // mirrors js/progress.js so the wheel gates consistently
  function computeProgress() {
    var raw; try { raw = JSON.parse(localStorage.getItem('lc_progress') || 'null'); } catch (e) {}
    if (!raw || !raw.signupDate) return { percent: 0, days: 0 };
    var days = Math.floor((Date.now() - raw.signupDate) / 86400000);
    var steps = ['login', 'map', 'smartpick', 'statepage'].filter(function (k) { return raw.steps && raw.steps[k]; }).length;
    var percent = Math.min(100, steps * 15 + Math.min(days, 40));
    return { percent: percent, days: days };
  }
  function isLoggedIn() { try { return !!localStorage.getItem('member_email'); } catch (e) { return true; } }

  var eyebrowEl = document.querySelector('.eyebrow');
  var subEl = document.querySelector('.sub');

  var unlocked = false;
  function refreshLock() {
    var pr = computeProgress();
    unlocked = pr.percent >= 90 || pr.days >= 30;
    if (unlocked) {
      locked.hidden = true;
      shell.classList.remove('is-locked');
      shell.classList.add('ready');
      spinBtn.disabled = false;
      eyebrowEl.innerHTML = '<i class="dot"></i> Reward unlocked';
      subEl.textContent = 'You reached 90% of your journey. Take your exclusive VIP spin — secure your draw entry or claim a consolation reward.';
    } else {
      locked.hidden = false;
      shell.classList.add('is-locked');
      shell.classList.remove('ready');
      spinBtn.disabled = true;
      lockSub.textContent = 'You are at ' + pr.percent + '% — reach 90% to spin';
      eyebrowEl.innerHTML = '<i class="dot" style="background:var(--gold);box-shadow:0 0 10px var(--gold)"></i> Reward locked';
      eyebrowEl.style.color = 'var(--gold)';
      eyebrowEl.style.background = 'rgba(244,192,37,.12)';
      eyebrowEl.style.borderColor = 'rgba(244,192,37,.3)';
      subEl.textContent = 'Almost there! You are at ' + pr.percent + '% — reach 90% of your journey to unlock the $5,000 Cash Draw spin.';
    }
  }
  // Not logged in? send to login.
  if (!isLoggedIn()) { window.location.replace('../'); }
  refreshLock();

  /* ---------- 6. Spin animation ---------------------------- */
  var currentRotation = 0;   // accumulated degrees
  var spinning = false;
  var lastWinIdx = -1;       // last resolved prize index
  var isWelcomeSpin = false; // the one-time onboarding free spin

  function easeOutQuint(t) { return 1 - Math.pow(1 - t, 5); }

  function indexAtTop(rot) {
    // wheel-coord angle currently under the top pointer
    var a = ((-rot) % 360 + 360) % 360;
    return Math.floor(a / SEG) % N;
  }

  function pointerBounce() {
    pointer.classList.add('tick');
    setTimeout(function () { pointer.classList.remove('tick'); }, 60);
  }

  function spinWheel(prizeName) {
    if (spinning || !unlocked) return;
    // resolve target index by prize name (or system pick)
    var idx;
    if (prizeName == null) { idx = pickSystemPrize(); }
    else {
      idx = -1;
      for (var i = 0; i < N; i++) if (PRIZES[i].name.toLowerCase() === String(prizeName).toLowerCase()) { idx = i; break; }
      if (idx < 0) { console.warn('Prize not found:', prizeName, '— using a system pick.'); idx = pickSystemPrize(); }
    }
    spinToIndex(idx);
  }

  function spinToIndex(idx) {
    if (spinning || !unlocked) return;
    ensureAudio();
    spinning = true;
    spinBtn.disabled = true;
    hubText.textContent = '...';
    shell.classList.remove('ready'); // stop idle pulse during spin

    // target resting rotation so segment idx center sits under the top pointer
    var segCenter = idx * SEG + SEG / 2;
    var jitter = (Math.random() - 0.5) * SEG * 0.62;          // stays inside the wedge
    var restMod = ((360 - segCenter + jitter) % 360 + 360) % 360;
    var spins = 6 + Math.floor(Math.random() * 3);            // 6..8 full turns
    var base = currentRotation - (currentRotation % 360);
    var target = base + spins * 360 + restMod;
    if (target <= currentRotation + spins * 360) target += 360;

    var start = currentRotation;
    var delta = target - start;
    var duration = 6400 + Math.random() * 1400;               // 6.4 – 7.8s
    var t0 = performance.now();
    var lastIdx = indexAtTop(start);
    var lastTickTime = 0;

    function frame(now) {
      var t = Math.min(1, (now - t0) / duration);
      var eased = easeOutQuint(t);

      // micro-stops / tension in the final stretch: tiny stepped hold near end
      if (t > 0.86) {
        var localT = (t - 0.86) / 0.14;                        // 0..1 in the tail
        var steps = 6;
        var stepped = Math.floor(localT * steps) / steps;      // quantized crawl
        eased = easeOutQuint(0.86) + (1 - easeOutQuint(0.86)) * (0.35 * stepped + 0.65 * localT);
      }

      currentRotation = start + delta * eased;
      wheel.style.transform = 'rotate(' + currentRotation + 'deg)';
      labels.style.transform = 'rotate(' + currentRotation + 'deg)';

      // pointer tick when a new segment passes the top
      var curIdx = indexAtTop(currentRotation);
      if (curIdx !== lastIdx) {
        lastIdx = curIdx;
        if (now - lastTickTime > 22) {                         // throttle at very high speed
          pointerBounce();
          tick(560 + (1 - t) * 260);                           // higher pitch when fast
          lastTickTime = now;
        }
      }

      if (t < 1) { requestAnimationFrame(frame); }
      else { settle(idx); }
    }
    requestAnimationFrame(frame);
  }

  function settle(idx) {
    currentRotation = ((currentRotation % 360) + 360) % 360;   // keep numbers small
    wheel.style.transform = 'rotate(' + currentRotation + 'deg)';
    labels.style.transform = 'rotate(' + currentRotation + 'deg)';
    spinning = false;
    hubText.textContent = 'SPIN';
    shell.classList.add('ready');
    pointerBounce();
    burstParticles();
    fanfare();
    lastWinIdx = idx;
    setTimeout(function () { showWin(PRIZES[idx]); }, 480);
    // re-enable for replays
    spinBtn.disabled = false;
  }

  // parse a cash value out of a prize name ("US$ 50 Cashback" -> 50 cashback)
  function parseCash(name) {
    var m = String(name).match(/US\$\s*([\d.]+)/);
    if (!m) return null;
    var amt = parseInt(m[1].replace(/\./g, ''), 10);
    if (isNaN(amt) || amt <= 0) return null;
    return { amount: amt, kind: /Cashback/i.test(name) ? 'cashback' : 'prize' };
  }

  // weighted random pick (system decides the prize)
  function pickSystemPrize() {
    var total = 0, i;
    for (i = 0; i < N; i++) total += PRIZES[i].weight;
    var r = Math.random() * total;
    for (i = 0; i < N; i++) { r -= PRIZES[i].weight; if (r <= 0) return i; }
    return 0;
  }

  /* ---------- 7. Win modal --------------------------------- */
  function showWin(prize) {
    modalPrize.textContent = prize.name;
    modalEmoji.textContent = prize.icon || '🎉';
    modal.hidden = false;
  }
  function hideWin() { modal.hidden = true; }
  closeModal.addEventListener('click', hideWin);
  claimBtn.addEventListener('click', function () {
    hideWin();
    var prize = PRIZES[lastWinIdx];
    if (prize && window.LCWallet) {
      var cash = parseCash(prize.name);
      if (cash) {
        window.LCWallet.addCredit(cash.amount, null, cash.kind, true);
        window.LCWallet.setPendingCredit(cash.amount);       // home header animates the count
        window.LCWallet.addNotification('💰', 'You won ' + prize.name + '!');
      } else {
        window.LCWallet.addNotification(prize.icon || '🎁', 'You won ' + prize.name + '!');
      }
      if (isWelcomeSpin) window.LCWallet.markFreeSpinUsed();
    }
    window.location.href = '../home/';
  });
  modal.addEventListener('click', function (e) { if (e.target === modal) hideWin(); });

  /* ---------- 8. Particle burst (canvas) ------------------- */
  var ctx = fx.getContext('2d'), particles = [], rafFx = null;
  function sizeCanvas() { fx.width = innerWidth; fx.height = innerHeight; }
  sizeCanvas(); window.addEventListener('resize', sizeCanvas);

  function burstParticles() {
    var rect = shell.getBoundingClientRect();
    var cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;
    var cols = ['#f4c025', '#ffe08a', '#ffffff', '#ffb300', '#fff6d0'];
    for (var i = 0; i < 150; i++) {
      var ang = Math.random() * Math.PI * 2;
      var sp = 4 + Math.random() * 11;
      particles.push({
        x: cx, y: cy,
        vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp - 3,
        g: 0.16 + Math.random() * 0.12,
        r: 2 + Math.random() * 4,
        life: 1, decay: 0.008 + Math.random() * 0.012,
        col: cols[(Math.random() * cols.length) | 0],
        rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.4
      });
    }
    if (!rafFx) loopFx();
  }
  function loopFx() {
    ctx.clearRect(0, 0, fx.width, fx.height);
    for (var i = particles.length - 1; i >= 0; i--) {
      var p = particles[i];
      p.vy += p.g; p.x += p.vx; p.y += p.vy; p.life -= p.decay; p.rot += p.vr;
      if (p.life <= 0) { particles.splice(i, 1); continue; }
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.translate(p.x, p.y); ctx.rotate(p.rot);
      ctx.fillStyle = p.col;
      ctx.shadowColor = p.col; ctx.shadowBlur = 8;
      ctx.fillRect(-p.r, -p.r * 0.5, p.r * 2, p.r); // little confetti rectangles
      ctx.restore();
    }
    if (particles.length) { rafFx = requestAnimationFrame(loopFx); }
    else { ctx.clearRect(0, 0, fx.width, fx.height); rafFx = null; }
  }

  /* ---------- 9. Wire the spin button ---------------------- */
  spinBtn.addEventListener('click', function () { spinWheel(); });

  // expose the public API
  window.spinWheel = spinWheel;
})();
