/* ============================================================
   PREMIUM HEADER — wallet, withdraw, notifications, avatar,
   welcome onboarding (free spin), animated balance.
   Pure vanilla JS. Exposes window.LCWallet for cross-page use.
   ============================================================ */
(function () {
  'use strict';

  /* ---------------- Wallet state (localStorage) --------------- */
  var K = {
    bal: 'lc_balance', ledger: 'lc_ledger', notif: 'lc_notifications',
    bank: 'lc_bank', welcome: 'lc_welcome_shown', freeSpin: 'lc_free_spin_used',
    pending: 'lc_pending_credit'
  };
  function get(k, def) { try { var v = localStorage.getItem(k); return v === null ? def : JSON.parse(v); } catch (e) { return def; } }
  function set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function del(k) { try { localStorage.removeItem(k); } catch (e) {} }

  function money(n) {
    return 'US$ ' + Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  var Wallet = {
    balance: function () { return get(K.bal, 0); },
    ledger: function () { return get(K.ledger, { cashback: 0, prizes: 0, withdrawn: 0 }); },
    notifications: function () { return get(K.notif, []); },
    bank: function () { return get(K.bank, null); },
    welcomeShown: function () { return !!get(K.welcome, false); },
    freeSpinUsed: function () { return !!get(K.freeSpin, false); },

    addNotification: function (icon, text) {
      var n = this.notifications();
      n.unshift({ icon: icon, text: text, time: Date.now() });
      if (n.length > 20) n = n.slice(0, 20);
      set(K.notif, n);
    },
    /* credit money to the balance. kind: 'cashback' | 'prize' */
    addCredit: function (amount, label, kind, silent) {
      amount = Number(amount) || 0;
      var b = this.balance() + amount; set(K.bal, b);
      var l = this.ledger();
      if (kind === 'prize') l.prizes += amount; else l.cashback += amount;
      set(K.ledger, l);
      if (!silent) this.addNotification('💰', label || (money(amount) + ' was added to your balance.'));
      return b;
    },
    /* set a pending credit so the next page with the header animates the count */
    setPendingCredit: function (amount) { set(K.pending, Number(amount) || 0); },
    consumePending: function () { var p = get(K.pending, null); del(K.pending); return p; },

    markWelcomeShown: function () { set(K.welcome, true); },
    markFreeSpinUsed: function () { set(K.freeSpin, true); }
  };
  window.LCWallet = Wallet;

  /* ---------------- UI (only if a header mount exists) -------- */
  document.addEventListener('DOMContentLoaded', function () {
    var mount = document.getElementById('site-header');
    if (!mount) return; // e.g. the wheel page: wallet-only, no header UI

    var baseEl = document.querySelector('base');
    var BASE = (baseEl && baseEl.getAttribute('href')) || '';

    // Load markup
    fetch(BASE + 'header/header.html')
      .then(function (r) { return r.text(); })
      .then(function (html) {
        var tmp = document.createElement('div'); tmp.innerHTML = html;
        var bar = tmp.querySelector('#lc-hdr-bar');
        var ov = tmp.querySelector('#lc-hdr-overlays');
        mount.innerHTML = '';
        mount.appendChild(bar.content.cloneNode(true));
        document.body.appendChild(ov.content.cloneNode(true));
        wire(BASE);
      })
      .catch(function (e) { console.warn('header load failed', e); });
  });

  /* ---------------- Wire everything -------------------------- */
  function wire(BASE) {
    var $ = function (id) { return document.getElementById(id); };

    var balBtn = $('lcBalance'), balVal = $('lcBalVal');
    var balancePop = $('lcBalancePop'), notifPop = $('lcNotifPop'), menuPop = $('lcMenuPop');
    var bell = $('lcBell'), bellBadge = $('lcBellBadge'), avatar = $('lcAvatar');
    var withdrawBtn = $('lcWithdraw'), wdModal = $('lcWithdrawModal');

    /* ---- render balance / breakdown / notifications ---- */
    function renderBalance(animate, from) {
      var to = Wallet.balance();
      if (animate) countTo(balVal, from == null ? 0 : from, to);
      else balVal.textContent = money(to);
    }
    function renderBreakdown() {
      var l = Wallet.ledger();
      $('lcSumCashback').textContent = money(l.cashback);
      $('lcSumPrizes').textContent = money(l.prizes);
      $('lcSumWithdrawn').textContent = money(l.withdrawn);
      $('lcSumAvailable').textContent = money(Wallet.balance());
    }
    function renderNotifs() {
      var list = $('lcNotifList'), items = Wallet.notifications();
      if (!items.length) { list.innerHTML = '<div class="empty">No notifications yet.</div>'; }
      else {
        list.innerHTML = items.map(function (n) {
          return '<div class="lc-nitem"><div class="nic">' + (n.icon || '🔔') + '</div>' +
            '<div><div class="ntxt">' + n.text + '</div><div class="ntime">' + timeAgo(n.time) + '</div></div></div>';
        }).join('');
      }
      var count = items.length;
      bellBadge.textContent = count > 9 ? '9+' : count;
      bellBadge.hidden = count === 0;
    }

    /* ---- animated counter ---- */
    function countTo(el, from, to) {
      var t0 = performance.now(), dur = 1200;
      balBtn.classList.add('credit');
      function step(now) {
        var t = Math.min(1, (now - t0) / dur);
        var e = 1 - Math.pow(1 - t, 3);
        el.textContent = money(from + (to - from) * e);
        if (t < 1) requestAnimationFrame(step);
        else { el.textContent = money(to); setTimeout(function () { balBtn.classList.remove('credit'); }, 400); }
      }
      requestAnimationFrame(step);
    }

    /* ---- popover open/close ---- */
    var openPop = null;
    function place(pop, trigger, align) {
      var r = trigger.getBoundingClientRect();
      pop.style.top = (r.bottom + 10) + 'px';
      if (align === 'right') pop.style.left = Math.max(12, r.right - pop.offsetWidth) + 'px';
      else pop.style.left = Math.max(12, Math.min(r.left, window.innerWidth - pop.offsetWidth - 12)) + 'px';
    }
    function toggle(pop, trigger, align, onOpen) {
      if (openPop === pop) { closePops(); return; }
      closePops();
      if (onOpen) onOpen();
      pop.classList.add('show'); place(pop, trigger, align); openPop = pop;
      if (trigger === balBtn) balBtn.classList.add('open');
    }
    function closePops() {
      [balancePop, notifPop, menuPop].forEach(function (p) { p && p.classList.remove('show'); });
      balBtn.classList.remove('open'); openPop = null;
    }
    document.addEventListener('click', function (e) {
      if (openPop && !openPop.contains(e.target) &&
        !balBtn.contains(e.target) && !bell.contains(e.target) && !avatar.contains(e.target)) closePops();
    });
    window.addEventListener('resize', closePops);

    balBtn.addEventListener('click', function () { toggle(balancePop, balBtn, 'left', renderBreakdown); });
    bell.addEventListener('click', function () { toggle(notifPop, bell, 'right', renderNotifs); });
    avatar.addEventListener('click', function () { toggle(menuPop, avatar, 'right'); });

    /* ---- logout (header menu) ---- */
    document.querySelectorAll('#lcMenuPop [data-logout]').forEach(function (el) {
      el.addEventListener('click', function (e) { e.preventDefault(); try { localStorage.removeItem('member_email'); } catch (x) {} window.location.href = BASE; });
    });

    /* ---- withdraw modal ---- */
    function showBackdrop(el) { el.hidden = false; requestAnimationFrame(function () { el.classList.add('show'); }); }
    function hideBackdrop(el) { el.classList.remove('show'); setTimeout(function () { el.hidden = true; }, 220); }

    var WITHDRAW_LOCK_DAYS = 15;
    function daysSinceSignup() {
      var raw; try { raw = JSON.parse(localStorage.getItem('lc_progress') || 'null'); } catch (e) {}
      if (!raw || !raw.signupDate) return 0;
      return Math.floor((Date.now() - raw.signupDate) / 86400000);
    }

    withdrawBtn.addEventListener('click', function () {
      var days = daysSinceSignup();
      var remaining = Math.max(0, WITHDRAW_LOCK_DAYS - days);

      // 15-day holding period: withdrawals are locked until it passes
      if (remaining > 0) {
        $('lcWdForm').hidden = true; $('lcWdSuccess').hidden = true; $('lcWdLocked').hidden = false;
        $('wdDays').textContent = remaining + (remaining === 1 ? ' day' : ' days');
        $('wdLockNote').textContent = 'Day ' + Math.min(days, WITHDRAW_LOCK_DAYS) + ' of ' + WITHDRAW_LOCK_DAYS;
        $('wdLockBar').style.width = Math.min(100, (days / WITHDRAW_LOCK_DAYS) * 100) + '%';
        showBackdrop(wdModal);
        return;
      }

      // unlocked: show the bank form (prefill if saved)
      var bk = Wallet.bank();
      if (bk) {
        $('wdName').value = bk.name || ''; $('wdBank').value = bk.bank || '';
        $('wdRouting').value = bk.routing || ''; $('wdAccount').value = bk.account || '';
        $('wdType').value = bk.type || 'Checking'; $('wdCountry').value = bk.country || 'United States';
      }
      $('lcWdForm').hidden = false; $('lcWdSuccess').hidden = true; $('lcWdLocked').hidden = true;
      showBackdrop(wdModal);
    });
    wdModal.addEventListener('click', function (e) { if (e.target === wdModal) hideBackdrop(wdModal); });
    $('wdSave').addEventListener('click', function () {
      var name = $('wdName').value.trim();
      if (!name) { $('wdName').focus(); $('wdName').style.borderColor = '#ef4444'; return; }
      set(K.bank, {
        name: name, bank: $('wdBank').value.trim(), routing: $('wdRouting').value.trim(),
        account: $('wdAccount').value.trim(), type: $('wdType').value, country: $('wdCountry').value
      });
      $('lcWdForm').hidden = true; $('lcWdSuccess').hidden = false;
      Wallet.addNotification('🏦', 'Bank account set up successfully.');
      renderNotifs();
    });
    $('wdDone').addEventListener('click', function () { hideBackdrop(wdModal); });
    $('wdLockedDone').addEventListener('click', function () { hideBackdrop(wdModal); });

    /* ---- welcome onboarding (home only) ---- */
    var isHome = (document.body.getAttribute('data-active') === 'home');
    if (isHome && !Wallet.welcomeShown() && !Wallet.freeSpinUsed()) {
      var wel = $('lcWelcome');
      setTimeout(function () { showBackdrop(wel); }, 500);
      $('lcWelcomeSpin').addEventListener('click', function () {
        Wallet.markWelcomeShown();
        window.location.href = BASE + 'cashback-wheel/?welcome=1';
      });
      $('lcWelcomeSkip').addEventListener('click', function () {
        Wallet.markWelcomeShown();
        hideBackdrop(wel);
      });
    }

    /* ---- pending credit animation (returning from wheel) ---- */
    var pending = Wallet.consumePending();
    if (pending != null && pending > 0) {
      var from = Math.max(0, Wallet.balance() - pending);
      renderBalance(true, from);
      setTimeout(function () { burstConfetti(); }, 300);
      toast('💰', money(pending) + ' in Cashback was added to your balance.');
    } else {
      renderBalance(false);
    }
    renderNotifs();
  }

  /* ---------------- Toast ------------------------------------ */
  function toast(icon, text) {
    var host = document.getElementById('lcToasts'); if (!host) return;
    var t = document.createElement('div'); t.className = 'lc-toast';
    t.innerHTML = '<div class="tic">' + icon + '</div><div class="ttxt">' + text + '</div>';
    host.appendChild(t);
    requestAnimationFrame(function () { t.classList.add('show'); });
    setTimeout(function () { t.classList.remove('show'); setTimeout(function () { t.remove(); }, 400); }, 4600);
  }

  /* ---------------- Confetti (credit celebration) ------------ */
  function burstConfetti() {
    var c = document.getElementById('lc-fx'); if (!c) return;
    var ctx = c.getContext('2d'); c.width = innerWidth; c.height = innerHeight;
    var cols = ['#10b981', '#34d399', '#f4c025', '#ffe08a', '#ffffff'];
    var ps = [];
    for (var i = 0; i < 140; i++) {
      ps.push({ x: innerWidth / 2 + (Math.random() - .5) * 200, y: -20 - Math.random() * 80,
        vx: (Math.random() - .5) * 6, vy: 2 + Math.random() * 5, g: .14,
        r: 3 + Math.random() * 5, col: cols[(Math.random() * cols.length) | 0],
        rot: Math.random() * 6, vr: (Math.random() - .5) * .4, life: 1 });
    }
    var fr;
    (function loop() {
      ctx.clearRect(0, 0, c.width, c.height); var alive = false;
      ps.forEach(function (p) {
        p.vy += p.g; p.x += p.vx; p.y += p.vy; p.rot += p.vr; if (p.y < c.height + 40) alive = true;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        ctx.fillStyle = p.col; ctx.shadowColor = p.col; ctx.shadowBlur = 6;
        ctx.fillRect(-p.r, -p.r * .5, p.r * 2, p.r); ctx.restore();
      });
      if (alive) fr = requestAnimationFrame(loop); else ctx.clearRect(0, 0, c.width, c.height);
    })();
    setTimeout(function () { cancelAnimationFrame(fr); ctx.clearRect(0, 0, c.width, c.height); }, 5000);
  }

  /* ---------------- helpers ---------------------------------- */
  function timeAgo(ts) {
    var s = Math.floor((Date.now() - ts) / 1000);
    if (s < 60) return 'now';
    if (s < 3600) return Math.floor(s / 60) + ' min ago';
    if (s < 86400) return Math.floor(s / 3600) + 'h ago';
    return Math.floor(s / 86400) + 'd ago';
  }
})();
