/*
 * Client-side gamification engine (no backend yet, so state lives in localStorage).
 *
 * Model:
 *   - 4 trackable activity steps, 15% each (max 60% from activity).
 *   - +1% per day since signup, capped at +40% (so time alone can eventually unlock everything).
 *   - Cashback Wheel unlocks at 70% OR 15 days since signup.
 *   - $5,000 Cash Draw unlocks at 90% OR 30 days since signup.
 */
(function () {
    var STORAGE_KEY = 'lc_progress';
    var STEP_WEIGHT = 15;
    var DAILY_BONUS_CAP = 40;
    var DAY_MS = 24 * 60 * 60 * 1000;

    var STEPS = [
        { key: 'login', label: 'Account Activation &amp; Login Setup' },
        { key: 'map', label: 'Explore U.S. Jackpots Map' },
        { key: 'smartpick', label: 'Generate first stateless Smart Pick' },
        { key: 'statepage', label: 'Try state-based Number Matcher' }
    ];

    function load() {
        try {
            var raw = localStorage.getItem(STORAGE_KEY);
            if (raw) return JSON.parse(raw);
        } catch (e) {}
        return { signupDate: null, steps: {} };
    }

    function save(state) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }

    function ensureSignup() {
        var state = load();
        if (!state.signupDate) {
            state.signupDate = Date.now();
            save(state);
        }
        return state;
    }

    function markStep(key) {
        var state = ensureSignup();
        if (!state.steps[key]) {
            state.steps[key] = true;
            save(state);
        }
    }

    function compute() {
        var state = ensureSignup();
        var daysSince = Math.floor((Date.now() - state.signupDate) / DAY_MS);
        var stepsCompleted = STEPS.filter(function (s) { return !!state.steps[s.key]; }).length;
        var activityPct = stepsCompleted * STEP_WEIGHT;
        var timeBonus = Math.min(daysSince, DAILY_BONUS_CAP);
        var percent = Math.min(100, activityPct + timeBonus);

        return {
            state: state,
            daysSince: daysSince,
            stepsCompleted: stepsCompleted,
            percent: percent,
            cashbackUnlocked: percent >= 70 || daysSince >= 15,
            drawUnlocked: percent >= 90 || daysSince >= 30
        };
    }

    function wasUnlocked(key) {
        try {
            return localStorage.getItem('lc_unlocked_' + key) === '1';
        } catch (e) { return false; }
    }
    function setUnlocked(key) {
        localStorage.setItem('lc_unlocked_' + key, '1');
    }

    function triggerConfetti() {
        var canvas = document.createElement('canvas');
        canvas.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:99999;';
        document.body.appendChild(canvas);
        var ctx = canvas.getContext('2d');
        var width = canvas.width = window.innerWidth;
        var height = canvas.height = window.innerHeight;
        var colors = ['#f44336', '#e91e63', '#9c27b0', '#3f51b5', '#2196f3', '#00bcd4', '#4caf50', '#ffeb3b', '#ff9800'];
        var confetti = [];
        for (var i = 0; i < 140; i++) {
            confetti.push({
                x: Math.random() * width,
                y: Math.random() * height - height,
                r: Math.random() * 6 + 4,
                d: Math.random() * 140,
                color: colors[Math.floor(Math.random() * colors.length)],
                tilt: Math.random() * 10 - 5,
                tiltInc: Math.random() * 0.07 + 0.02,
                tiltAngle: 0
            });
        }
        var frame;
        function draw() {
            ctx.clearRect(0, 0, width, height);
            var remaining = false;
            confetti.forEach(function (c) {
                c.tiltAngle += c.tiltInc;
                c.y += (Math.cos(c.d) + 3 + c.r / 2) / 2;
                c.x += Math.sin(c.tiltAngle);
                c.tilt = Math.sin(c.tiltAngle - c.d / 2) * 15;
                if (c.y <= height) remaining = true;
                ctx.beginPath();
                ctx.lineWidth = c.r / 2;
                ctx.strokeStyle = c.color;
                ctx.moveTo(c.x + c.tilt + c.r / 2, c.y);
                ctx.lineTo(c.x + c.tilt, c.y + c.tilt + c.r / 2);
                ctx.stroke();
            });
            if (remaining) frame = requestAnimationFrame(draw);
            else canvas.remove();
        }
        draw();
        setTimeout(function () { cancelAnimationFrame(frame); canvas.remove(); }, 6000);
    }

    function showUnlockModal(name) {
        var modal = document.getElementById('gamified-unlock-modal');
        if (!modal) return;
        document.getElementById('unlock-modal-title').textContent = name;
        modal.classList.remove('hidden');
        if (window.lucide) lucide.createIcons();
    }

    function renderJourney(root) {
        var result = compute();

        var pctEl = root.querySelector('[data-progress-pct]');
        if (pctEl) pctEl.textContent = result.percent + '% Completed';

        var barEl = root.querySelector('[data-progress-bar]');
        if (barEl) barEl.style.width = result.percent + '%';

        var stepsDoneEl = root.querySelector('[data-progress-steps-label]');
        if (stepsDoneEl) stepsDoneEl.textContent = 'View Learning Steps (' + result.stepsCompleted + ' of 6 Completed)';

        STEPS.forEach(function (s, i) {
            var row = root.querySelector('[data-step="' + s.key + '"]');
            if (!row) return;
            var done = !!result.state.steps[s.key];
            row.innerHTML = done
                ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-green-600 shrink-0"><circle cx="12" cy="12" r="10"></circle><path d="M9 12l2 2 4-4"></path></svg>' +
                  '<span class="text-gray-700 font-semibold">' + (i + 1) + '. ' + s.label + ' <span class="text-xs text-green-600 font-bold ml-1.5">(Completed)</span></span>'
                : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-gray-300 shrink-0"><circle cx="12" cy="12" r="10"></circle></svg>' +
                  '<span class="text-gray-400 font-semibold">' + (i + 1) + '. ' + s.label + '</span>';
        });

        renderReward(root, 'cashback', result.cashbackUnlocked, 70, result.percent, result.daysSince, 15);
        renderReward(root, 'draw', result.drawUnlocked, 90, result.percent, result.daysSince, 30);
    }

    function renderReward(root, key, unlocked, targetPct, currentPct, daysSince, targetDays) {
        var nodes = root.querySelectorAll('[data-reward="' + key + '"]');
        nodes.forEach(function (card) {
            var badge = card.querySelector('[data-reward-badge]');
            var btn = card.querySelector('[data-reward-btn]');
            var lockBadge = card.querySelector('[data-reward-lock-icon]');

            if (unlocked) {
                if (badge) {
                    badge.textContent = 'Unlocked';
                    badge.classList.remove('bg-gray-100', 'text-gray-400');
                    badge.classList.add('bg-green-100', 'text-green-700');
                }
                if (btn) {
                    btn.innerHTML = '<i data-lucide="sparkles" class="w-3.5 h-3.5"></i>OPEN';
                    btn.classList.remove('bg-gray-150', 'hover:bg-gray-200', 'text-gray-700');
                    btn.classList.add('bg-gradient-btn', 'text-white');
                    btn.setAttribute('data-reward-open', key);
                }
                if (lockBadge) lockBadge.style.display = 'none';
            } else {
                var remainingPct = Math.max(0, targetPct - currentPct);
                var remainingDays = Math.max(0, targetDays - daysSince);
                if (badge) badge.textContent = 'Locked (' + targetPct + '%)';
                if (btn) btn.title = remainingPct === 0
                    ? 'Unlocks automatically'
                    : remainingPct + '% to go (or ' + remainingDays + ' more day(s))';
            }
        });
    }

    function bindUnlockButtons(root) {
        root.querySelectorAll('[data-reward-open]').forEach(function (btn) {
            if (btn.dataset.bound) return;
            btn.dataset.bound = '1';
            btn.addEventListener('click', function () {
                var key = btn.getAttribute('data-reward-open');
                var name = key === 'cashback' ? 'Cashback on Unlock' : '$5,000 Cash Draw';
                showUnlockModal(name + ' — coming soon');
            });
        });
    }

    function checkNewlyUnlocked(result) {
        if (result.cashbackUnlocked && !wasUnlocked('cashback')) {
            setUnlocked('cashback');
            triggerConfetti();
            showUnlockModal('Cashback on Unlock');
        }
        if (result.drawUnlocked && !wasUnlocked('draw')) {
            setUnlocked('draw');
            triggerConfetti();
            showUnlockModal('$5,000 Cash Draw');
        }
    }

    window.LCProgress = {
        markStep: markStep,
        compute: compute,
        init: function () {
            document.addEventListener('DOMContentLoaded', function () {
                var result = compute();
                renderJourney(document);
                renderReward(document, 'cashback', result.cashbackUnlocked, 70, result.percent, result.daysSince, 15);
                renderReward(document, 'draw', result.drawUnlocked, 90, result.percent, result.daysSince, 30);
                bindUnlockButtons(document);
                checkNewlyUnlocked(result);

                var dismiss = document.getElementById('gamified-unlock-modal-dismiss');
                if (dismiss) {
                    dismiss.addEventListener('click', function () {
                        document.getElementById('gamified-unlock-modal').classList.add('hidden');
                    });
                }
            });
        }
    };
})();
