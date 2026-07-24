/* Renders state pages and game tool pages from the LOTTERY engine. */
(function () {
    var L = window.LOTTERY;

    function qs(name) {
        var m = new RegExp('[?&]' + name + '=([^&]*)').exec(location.search);
        return m ? decodeURIComponent(m[1]) : null;
    }

    function badgeOrLogo(game) {
        if (game.logo) {
            return '<img src="' + game.logo + '" alt="' + game.name + '" class="h-full object-contain max-w-[140px]">';
        }
        return '<div class="w-10 h-10 rounded-full bg-gradient-btn text-white flex items-center justify-center font-numbers font-black text-[13px] shrink-0 shadow-[0_4px_10px_rgba(224,34,26,0.25)] relative overflow-hidden"><span class="z-10 drop-shadow-md">' + game.badge + '</span></div>';
    }

    function ballsRow(nums, special, specialType) {
        var h = '';
        for (var i = 0; i < nums.length; i++) h += L.ball(nums[i], null);
        if (special !== null && special !== undefined) h += L.ball(special, specialType);
        return h;
    }

    // ---------- STATE PAGE ----------
    function gameCard(state, game, delay) {
        var actions = ['results', 'smart-pick', 'payout', 'matcher', 'frequency', 'analysis', 'odds'];
        function btn(a, label, primary) {
            var cls = primary ? 'action-btn-primary' : 'action-btn';
            return '<a href="lotteries/game.html?s=' + state.code + '&g=' + game.id + '&a=' + a + '" class="' + cls + '">' + label + '</a>';
        }

        var drawSection = '';
        if (game.doublePlay) {
            drawSection =
                '<div class="flex flex-col sm:items-end gap-1 w-full"><span class="text-xs font-semibold text-gray-400 sm:text-right w-full block mb-0.5 select-none uppercase tracking-wider">Main draw</span>' +
                '<div class="flex gap-1.5 items-center justify-start sm:justify-end flex-wrap min-h-[44px] w-full">' + ballsRow(game.main, game.special, game.specialType) + '</div>' +
                (game.powerPlay ? '<div class="font-bold text-sm px-1.5 flex items-center text-gray-700 select-none w-full sm:justify-end mt-1">- Power Play: ' + game.powerPlay + '</div>' : '') +
                '</div>' +
                '<div class="flex flex-col sm:items-end gap-1 w-full"><span class="text-xs font-semibold text-gray-400 sm:text-right w-full block mb-0.5 select-none uppercase tracking-wider">Double Play</span>' +
                '<div class="flex gap-1.5 items-center justify-start sm:justify-end flex-wrap min-h-[44px] w-full">' + ballsRow(game.doublePlay.main, game.doublePlay.special, game.specialType) + '</div></div>';
        } else {
            drawSection =
                '<div class="flex flex-col sm:items-end gap-1 w-full"><div class="flex gap-1.5 items-center justify-start sm:justify-end flex-wrap min-h-[44px] w-full">' + ballsRow(game.main, game.special, game.specialType) + '</div>' +
                (game.powerPlay ? '<div class="font-bold text-sm px-1.5 flex items-center text-gray-700 select-none w-full sm:justify-end mt-1">- Power Play: ' + game.powerPlay + '</div>' : '') +
                '</div>';
        }

        return '<div class="rounded-[24px] p-5 border border-[#e6e6e6] shadow-[0px_0px_5px_0px_rgba(0,0,0,0.05)] bg-white text-gray-900 flex flex-col sm:flex-row justify-between gap-6 hover:shadow-md transition-all animate-fade-in-up" style="animation-delay: ' + delay + 'ms;">' +
            '<div class="flex flex-col sm:w-1/3 justify-between"><div class="space-y-2">' +
            '<div class="flex items-center gap-3 h-10">' + badgeOrLogo(game) + '</div>' +
            '<p class="font-numbers font-bold text-[30px] leading-tight text-primary">' + game.jackpotLabel + ': ' + game.jackpot + '</p>' +
            '</div></div>' +
            '<div class="flex flex-col sm:w-2/3 sm:items-end justify-between gap-4">' +
            '<div class="flex flex-col sm:items-end gap-3 w-full">' +
            '<div class="w-full sm:text-right text-[14px] font-sans font-bold text-gray-500 mb-1">Last Draw: ' + game.lastDraw + '</div>' +
            drawSection +
            '</div>' +
            '<div class="w-full sm:max-w-md space-y-2">' +
            '<div class="grid grid-cols-3 gap-1.5 gap-y-2 mb-2">' + btn('results', 'Past Results') + btn('smart-pick', 'Smart Pick', true) + btn('payout', 'Payout') + '</div>' +
            '<div class="grid grid-cols-2 gap-1.5 gap-y-2 mb-2">' + btn('matcher', 'Number Matcher') + btn('frequency', 'Frequency Chart') + '</div>' +
            '<div class="grid grid-cols-2 gap-1.5 gap-y-2 mb-2">' + btn('analysis', 'Jackpot Analysis') + btn('odds', 'Prize Matrix') + '</div>' +
            '</div></div></div>';
    }

    function renderState() {
        var code = qs('s');
        var state = L.getState(code);
        var el = document.getElementById('state-content');
        if (!state) {
            el.innerHTML = notFound('Lottery not available', 'We could not find results for this state.');
            document.title = 'LottoCash - Lottery';
            return;
        }
        document.title = 'LottoCash - ' + state.name + ' Lottery';

        var header = '<div class="flex flex-col gap-2 mb-6 animate-fade-in-up" style="animation-delay: 100ms;">' +
            '<div class="flex items-center gap-2"><a href="lotteries/" class="text-sm font-display font-semibold text-primary flex items-center gap-1 hover:underline"><i data-lucide="arrow-left" class="w-4 h-4"></i> All Lotteries</a></div>';
        if (state.banner) {
            header += '<div class="mt-2 select-none w-full"><img src="' + state.banner + '" alt="' + state.name + ' Lottery" class="w-full h-auto object-contain rounded-[15px]"></div>';
        } else {
            header += '<div class="mt-2 select-none w-full rounded-[18px] px-6 py-8 flex items-center gap-4" style="background:linear-gradient(120deg,#0b1f4d 0%,#16265e 45%,#b0182b 100%);color:#fff;">' +
                '<div class="w-16 h-16 rounded-full flex items-center justify-center font-numbers font-black text-2xl shrink-0" style="background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.28);color:#fff;">' + state.code.toUpperCase() + '</div>' +
                '<div><h1 class="text-3xl font-bold" style="font-family:\'Archivo Narrow\',sans-serif;color:#fff;">' + state.name + ' Lottery</h1>' +
                '<p class="text-sm" style="color:rgba(255,255,255,0.85);">Latest results &amp; tools for every ' + state.name + ' game</p></div></div>';
        }
        header += '</div>';

        var cards = '';
        for (var i = 0; i < state.games.length; i++) cards += gameCard(state, state.games[i], 200 + i * 50);

        el.innerHTML = header + '<div class="space-y-4">' + cards + '</div>' + rewardCards();
        if (window.lucide) lucide.createIcons();
        if (window.LCProgress) window.LCProgress.markStep('statepage');
        if (window.LCRewards) window.LCRewards.refresh();
    }

    // ---------- GAME TOOL PAGE ----------
    function gameHeader(state, game, actionLabel) {
        return '<div class="bg-white rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between shadow-[0px_0px_5px_0px_rgba(0,0,0,0.05)] border border-[#e6e6e6] overflow-hidden relative mb-6 animate-fade-in-up" style="animation-delay: 100ms;">' +
            '<div class="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>' +
            '<div class="relative z-10 w-full">' +
            '<div class="flex items-center gap-2 mb-1.5"><a href="lotteries/state.html?s=' + state.code + '" class="text-sm font-display font-semibold text-primary flex items-center gap-1 hover:underline"><i data-lucide="arrow-left" class="w-4 h-4"></i> Back to ' + state.name + '</a></div>' +
            '<div class="flex items-center gap-3 flex-wrap">' +
            (game.logo ? '<img src="' + game.logo + '" alt="' + game.name + '" class="h-10 object-contain">' : '<span class="text-3xl font-bold text-gray-900" style="font-family:\'Archivo Narrow\',sans-serif;">' + game.name + '</span>') +
            '<span class="text-gray-300 text-2xl">/</span>' +
            '<h2 class="text-2xl md:text-3xl font-bold text-gray-900" style="font-family:\'Archivo Narrow\',sans-serif;">' + actionLabel + '</h2>' +
            '</div>' +
            '<p class="text-gray-500 text-sm mt-1">' + game.name + ' — ' + state.name + '</p>' +
            '</div></div>';
    }

    function card(inner, pad) {
        return '<div class="bg-white rounded-[24px] border border-[#e6e6e6] shadow-[0px_0px_5px_0px_rgba(0,0,0,0.05)] overflow-hidden animate-fade-in-up ' + (pad ? 'p-6' : '') + '" style="animation-delay:200ms;">' + inner + '</div>';
    }
    function cardTitle(t) {
        return '<div class="px-5 py-4 border-b border-[#e6e6e6] flex items-center gap-2"><h3 class="archivo-title tracking-tight text-gray-900">' + t + '</h3></div>';
    }

    // Action: Past Results
    function renderResults(state, game) {
        var draws = L.pastDraws(state.code, game, 12);
        var rows = '';
        for (var i = 0; i < draws.length; i++) {
            var d = draws[i];
            rows += '<div class="p-[14px] flex items-center justify-between gap-3 ' + (i % 2 ? 'bg-gray-50/50' : 'bg-white') + '">' +
                '<div class="flex gap-1.5 items-center flex-wrap">' + ballsRowSmall(d.main, d.special, game.specialType) + '</div>' +
                '<div class="text-right shrink-0"><div class="text-sm font-bold text-gray-900">' + d.date + '</div><div class="text-xs text-gray-400">' + d.weekday + '</div></div></div>';
        }
        return card(cardTitle('Past Results') + '<div class="divide-y divide-[#e6e6e6]">' + rows + '</div>');
    }
    function ballsRowSmall(nums, special, type) {
        var h = '';
        for (var i = 0; i < nums.length; i++) h += '<span class="ball" style="width:2rem;height:2rem;font-size:.9rem;">' + nums[i] + '</span>';
        if (special !== null && special !== undefined) h += '<span class="' + (type === 'yellow' ? 'ball-yellow' : 'ball-red') + '" style="width:2rem;height:2rem;font-size:.9rem;">' + special + '</span>';
        return h;
    }

    // Action: Payout / Prize Matrix (odds shares this)
    function renderPayout(state, game, oddsMode) {
        var tiers = payoutTiers(game);
        var head = oddsMode
            ? '<tr class="text-left text-xs font-bold uppercase tracking-wider text-gray-500 border-b border-[#e6e6e6] bg-gray-50/50"><th class="px-5 py-3">Match</th><th class="px-5 py-3">Odds</th><th class="px-5 py-3 text-right">Prize</th></tr>'
            : '<tr class="text-left text-xs font-bold uppercase tracking-wider text-gray-500 border-b border-[#e6e6e6] bg-gray-50/50"><th class="px-5 py-3">Match</th><th class="px-5 py-3 text-right">Prize</th></tr>';
        var body = '';
        for (var i = 0; i < tiers.length; i++) {
            var t = tiers[i];
            body += '<tr class="' + (i % 2 ? 'bg-gray-50/40' : 'bg-white') + ' border-b border-[#f0f0f0]"><td class="px-5 py-3 font-bold text-gray-900">' + t.match + '</td>' +
                (oddsMode ? '<td class="px-5 py-3 text-gray-600 font-numbers">' + t.odds + '</td>' : '') +
                '<td class="px-5 py-3 text-right font-numbers font-bold ' + (i === 0 ? 'text-primary' : 'text-gray-900') + '">' + t.prize + '</td></tr>';
        }
        var title = oddsMode ? 'Prize Matrix & Odds' : 'Payout Chart';
        return card(cardTitle(title) + '<div class="overflow-x-auto"><table class="w-full">' + head + body + '</table></div>' +
            '<p class="px-5 py-4 text-[11px] text-gray-400 italic">Prize amounts are estimated and may vary by draw and number of winners.</p>');
    }
    function payoutTiers(game) {
        if (game.digit) {
            return [
                { match: 'Exact order', odds: '1 in ' + Math.pow(10, game.mainCount), prize: game.jackpot },
                { match: 'Any order', odds: '1 in ' + Math.round(Math.pow(10, game.mainCount) / 6), prize: '$' + (game.mainCount === 3 ? '80' : '200') },
                { match: 'Front pair', odds: '1 in 100', prize: '$50' },
                { match: 'Back pair', odds: '1 in 100', prize: '$50' }
            ];
        }
        var c = game.mainCount, hasS = game.special !== null;
        var tiers = [];
        tiers.push({ match: c + (hasS ? ' + ' + game.specialName : ''), odds: '1 in 292,201,338', prize: game.jackpot });
        if (hasS) tiers.push({ match: c + ' numbers', odds: '1 in 11,688,053', prize: '$1,000,000' });
        tiers.push({ match: (c - 1) + (hasS ? ' + ' + game.specialName : ''), odds: '1 in 913,129', prize: '$50,000' });
        tiers.push({ match: (c - 1) + ' numbers', odds: '1 in 36,525', prize: '$100' });
        tiers.push({ match: (c - 2) + (hasS ? ' + ' + game.specialName : ''), odds: '1 in 14,494', prize: '$100' });
        tiers.push({ match: (c - 2) + ' numbers', odds: '1 in 580', prize: '$7' });
        if (hasS) tiers.push({ match: game.specialName + ' only', odds: '1 in 38', prize: '$4' });
        return tiers;
    }

    // Action: Frequency Chart
    function renderFrequency(state, game) {
        var f = L.frequency(state.code, game);
        var maxCount = f[0].count;
        var bars = '';
        f.forEach(function (x) {
            var pct = Math.round((x.count / maxCount) * 100);
            bars += '<div class="flex items-center gap-3 py-1.5">' +
                '<span class="ball" style="width:2rem;height:2rem;font-size:.85rem;flex:none;">' + x.n + '</span>' +
                '<div class="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden"><div class="h-full rounded-full" style="width:' + pct + '%;background:linear-gradient(90deg,#1a3ee0,#1ac8e0);"></div></div>' +
                '<span class="text-xs font-bold text-gray-500 w-10 text-right">' + x.count + 'x</span></div>';
        });
        return card(cardTitle('Frequency Chart') + '<div class="p-5"><p class="text-xs text-gray-500 uppercase tracking-wider font-bold mb-4">How often each number was drawn (historical sample)</p>' + bars + '</div>');
    }

    // Action: Jackpot Analysis
    function renderAnalysis(state, game) {
        var ho = L.hotOverdue(state.code, game);
        function balls(list, type) {
            var h = '';
            list.forEach(function (n) { h += '<span class="' + (type === 'red' ? 'ball-red' : type === 'yellow' ? 'ball-yellow' : 'ball') + '" style="width:2.2rem;height:2.2rem;font-size:.9rem;">' + n + '</span>'; });
            return '<div class="flex flex-wrap gap-1.5">' + h + '</div>';
        }
        var inner = '<div class="p-6 space-y-5">' +
            '<div class="grid grid-cols-1 md:grid-cols-3 gap-4">' +
            statTile('Current jackpot', game.jackpot, 'trophy') +
            statTile('Draw schedule', game.drawDays, 'calendar') +
            statTile('Last draw', game.lastDraw.split(',')[0], 'clock') +
            '</div>' +
            '<div><p class="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Hot numbers (most drawn)</p>' + balls(ho.hot) + '</div>' +
            '<div><p class="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Overdue numbers (longest without a hit)</p>' + balls(ho.overdue) + '</div>' +
            (ho.hotSpecial.length ? '<div><p class="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Hot ' + game.specialName + '</p>' + balls(ho.hotSpecial, game.specialType) + '</div>' : '') +
            '<p class="text-[11px] text-gray-400 italic pt-2 border-t border-gray-100">Analysis is based on a historical sample. Past results do not predict future outcomes.</p>' +
            '</div>';
        return card(cardTitle('Jackpot Analysis') + inner);
    }
    function statTile(label, value, icon) {
        return '<div class="bg-gray-50 rounded-2xl p-4 border border-[#eef0f3]"><div class="flex items-center gap-2 text-gray-400 mb-1"><i data-lucide="' + icon + '" class="w-4 h-4"></i><span class="text-[11px] font-bold uppercase tracking-wider">' + label + '</span></div><p class="font-numbers font-bold text-lg text-gray-900">' + value + '</p></div>';
    }

    // Action: Number Matcher (interactive)
    function renderMatcher(state, game) {
        var inputs = '';
        for (var i = 0; i < game.mainCount; i++) {
            inputs += '<input type="number" min="' + (game.digit ? 0 : 1) + '" max="' + (game.digit ? 9 : game.mainMax) + '" class="matcher-in w-14 h-14 text-center text-lg font-bold rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:border-primary focus:bg-white" />';
        }
        var specialInput = (game.special !== null && !game.digit) ? '<input type="number" min="1" max="' + game.specialMax + '" class="matcher-sp w-14 h-14 text-center text-lg font-bold rounded-xl border border-red-200 bg-red-50 focus:outline-none focus:border-primary" placeholder="+" />' : '';
        var inner = '<div class="p-6 space-y-5">' +
            '<p class="text-sm text-gray-600">Enter your numbers and check them against the latest ' + game.name + ' draw.</p>' +
            '<div class="flex flex-wrap gap-2 items-center">' + inputs + specialInput + '</div>' +
            '<button id="matcher-check" class="bg-gradient-btn text-white font-bold px-6 py-3 rounded-xl text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-[0_4px_14px_rgba(255,0,0,0.2)]">Check my numbers</button>' +
            '<div id="matcher-result"></div>' +
            '<div class="pt-4 border-t border-gray-100"><p class="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Latest winning numbers</p>' +
            '<div class="flex flex-wrap gap-1.5">' + ballsRow(game.main, game.special, game.specialType) + '</div></div>' +
            '</div>';
        return card(cardTitle('Number Matcher') + inner);
    }
    function bindMatcher(state, game) {
        var btn = document.getElementById('matcher-check');
        if (!btn) return;
        btn.addEventListener('click', function () {
            var picks = [].map.call(document.querySelectorAll('.matcher-in'), function (i) { return parseInt(i.value, 10); }).filter(function (v) { return !isNaN(v); });
            var spEl = document.querySelector('.matcher-sp');
            var sp = spEl && spEl.value !== '' ? parseInt(spEl.value, 10) : null;
            var matches = picks.filter(function (n) { return game.main.indexOf(n) > -1; });
            var spMatch = sp !== null && sp === game.special;
            var out = document.getElementById('matcher-result');
            var total = matches.length + (spMatch ? 1 : 0);
            var tone = total >= 3 ? 'green' : total >= 1 ? 'amber' : 'gray';
            var colors = { green: 'bg-green-50 border-green-200 text-green-800', amber: 'bg-amber-50 border-amber-200 text-amber-800', gray: 'bg-gray-50 border-gray-200 text-gray-700' };
            out.innerHTML = '<div class="mt-4 rounded-xl border p-4 ' + colors[tone] + '"><p class="font-bold">' +
                matches.length + ' number' + (matches.length === 1 ? '' : 's') + ' matched' + (spMatch ? ' + ' + game.specialName : '') + '</p>' +
                (matches.length ? '<p class="text-sm mt-1">Matched: ' + matches.join(', ') + '</p>' : '<p class="text-sm mt-1">No matches this time — try again!</p>') + '</div>';
        });
    }

    // Action: Smart Pick (combo generator)
    function renderSmartPick(state, game) {
        var ho = L.hotOverdue(state.code, game);
        var rowsHtml = '';
        for (var r = 1; r <= 5; r++) {
            rowsHtml += '<tr class="combo-row ' + (r % 2 ? 'bg-white' : 'bg-gray-50/50') + '"><td class="px-5 py-3.5 font-numbers font-black text-lg text-gray-400 text-center w-20">' + r + '</td>' +
                '<td class="px-5 py-3.5 font-sans text-[20px] font-bold text-gray-900 tracking-wide whitespace-nowrap"><div class="balls-container flex items-center gap-1"></div></td></tr>';
        }
        var statsBlock = '<div class="bg-white rounded-[24px] border border-[#e6e6e6] shadow-[0px_0px_5px_0px_rgba(0,0,0,0.05)] p-5 mb-4 animate-fade-in-up">' +
            '<p class="font-bold text-gray-900 mb-4 text-[16px]" style="font-family:\'Archivo Narrow\',sans-serif;">The Smart Pick Combos are generated with the following numbers:</p>' +
            '<div class="space-y-3.5 text-sm">' +
            '<p><span class="font-semibold text-gray-500 block mb-1">Top hot numbers:</span><span class="font-bold text-gray-900 text-[20px] block">' + ho.hot.join(', ') + '</span></p>' +
            '<p><span class="font-semibold text-gray-500 block mb-1">Top overdue numbers:</span><span class="font-bold text-gray-900 text-[20px] block">' + ho.overdue.join(', ') + '</span></p>' +
            (ho.hotSpecial.length ? '<p><span class="font-semibold text-gray-500 block mb-1">Top hot ' + game.specialName + ':</span><span class="font-bold text-[#E0221A] text-[20px] block">' + ho.hotSpecial.join(', ') + '</span></p>' : '') +
            '</div></div>';

        var table = '<div class="bg-white rounded-[24px] border border-[#e6e6e6] shadow-[0px_0px_5px_0px_rgba(0,0,0,0.05)] overflow-hidden animate-fade-in-up">' +
            '<div class="px-5 py-4 flex items-center justify-between border-b border-[#e6e6e6]"><h3 class="archivo-title tracking-tight text-gray-900" style="font-size:20px;">Smart Pick</h3>' +
            '<button id="btn-again" class="bg-gradient-btn text-white font-semibold tracking-wide px-5 py-2.5 rounded-[10px] text-xs flex items-center justify-center gap-1.5 hover:scale-[1.01] active:scale-95 transition-all shadow-[0_4px_14px_rgba(255,0,0,0.15)]"><i data-lucide="refresh-cw" class="w-3.5 h-3.5"></i> Smart Pick Again</button></div>' +
            '<div class="overflow-x-auto"><table class="w-full text-left border-collapse"><thead><tr class="bg-gray-50/50 border-b border-[#e6e6e6] text-xs font-bold uppercase tracking-wider text-gray-500"><th class="px-5 py-3.5 w-20 text-center">#</th><th class="px-5 py-3.5">Smart Pick</th></tr></thead>' +
            '<tbody id="combos">' + rowsHtml + '</tbody></table></div></div>';

        return statsBlock + table;
    }
    function bindSmartPick(state, game) {
        var ho = L.hotOverdue(state.code, game);
        var pool = [].concat(ho.hot, ho.overdue).filter(function (v, i, a) { return a.indexOf(v) === i; });
        var spPool = [].concat(ho.hotSpecial, ho.overdueSpecial);
        function pad(n) { return String(n).padStart(2, '0'); }
        function gen() {
            [].forEach.call(document.querySelectorAll('.combo-row'), function (row) {
                var nums = [], copy = pool.slice();
                for (var i = 0; i < game.mainCount; i++) {
                    if (copy.length && !game.digit) { nums.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0]); }
                    else { nums.push(game.digit ? Math.floor(Math.random() * 10) : Math.floor(Math.random() * game.mainMax) + 1); }
                }
                if (!game.digit) nums.sort(function (a, b) { return a - b; });
                var html = nums.map(pad).join('-');
                if (game.special !== null && !game.digit) {
                    var sp = spPool.length ? spPool[Math.floor(Math.random() * spPool.length)] : Math.floor(Math.random() * game.specialMax) + 1;
                    html += '-<span class="text-[#E0221A] font-extrabold">' + pad(sp) + '</span>';
                }
                row.querySelector('.balls-container').innerHTML = html;
            });
        }
        gen();
        if (window.LCProgress) window.LCProgress.markStep('smartpick');
        var b = document.getElementById('btn-again');
        if (b) b.addEventListener('click', function () {
            var ic = b.querySelector('i'); if (ic) { ic.classList.add('animate-spin'); setTimeout(function () { ic.classList.remove('animate-spin'); }, 600); }
            gen();
        });
    }

    function renderGame() {
        var code = qs('s'), gid = qs('g'), action = qs('a') || 'results';
        var found = L.getGame(code, gid);
        var el = document.getElementById('game-content');
        if (!found) {
            el.innerHTML = notFound('Game not found', 'This lottery game is not available.');
            return;
        }
        var state = found.state, game = found.game;
        var labels = { results: 'Past Results', 'smart-pick': 'Smart Pick', payout: 'Payout', matcher: 'Number Matcher', frequency: 'Frequency Chart', analysis: 'Jackpot Analysis', odds: 'Prize Matrix' };
        document.title = 'LottoCash - ' + game.name + ' ' + (labels[action] || '');

        var body;
        if (action === 'results') body = renderResults(state, game);
        else if (action === 'payout') body = renderPayout(state, game, false);
        else if (action === 'odds') body = renderPayout(state, game, true);
        else if (action === 'frequency') body = renderFrequency(state, game);
        else if (action === 'analysis') body = renderAnalysis(state, game);
        else if (action === 'matcher') body = renderMatcher(state, game);
        else if (action === 'smart-pick') body = renderSmartPick(state, game);
        else body = renderResults(state, game);

        el.innerHTML = gameHeader(state, game, labels[action] || 'Results') + body + rewardCards();
        if (window.lucide) lucide.createIcons();
        if (action === 'matcher') bindMatcher(state, game);
        if (action === 'smart-pick') bindSmartPick(state, game);
        if (window.LCRewards) window.LCRewards.refresh();
    }

    function notFound(title, msg) {
        return '<div class="bg-white rounded-[24px] border border-[#e6e6e6] p-10 text-center animate-fade-in-up">' +
            '<div class="w-16 h-16 rounded-2xl bg-gray-50 text-gray-400 flex items-center justify-center mx-auto mb-4"><i data-lucide="search-x" class="w-7 h-7"></i></div>' +
            '<h2 class="text-xl font-bold text-gray-900 mb-2">' + title + '</h2><p class="text-gray-500 mb-6">' + msg + '</p>' +
            '<a href="lotteries/" class="inline-flex items-center gap-2 bg-gradient-btn text-white font-bold px-5 py-2.5 rounded-xl text-sm">Browse all lotteries</a></div>';
    }

    function rewardCards() {
        return '<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 mb-4">' +
            rewardCard('cashback', 'green', 'Cashback on Unlock', '70', 'Reach 70% progress or wait 15 days to unlock the Cashback Wheel and win up to <span class="font-bold">100% cashback.</span>', 'coins') +
            rewardCard('draw', 'amber', '$5,000 Cash Draw', '90', 'Reach 90% progress or wait 30 days to <span class="font-bold">unlock the $5,000 Cash Draw Wheel.</span>', 'gift') +
            '</div>';
    }
    function rewardCard(key, color, title, pct, desc, icon) {
        return '<div class="bg-white rounded-[24px] p-5 shadow-[0px_0px_5px_0px_rgba(0,0,0,0.05)] border border-[#e6e6e6] flex items-center justify-between relative overflow-hidden group" data-reward="' + key + '">' +
            '<div class="absolute -right-8 -bottom-8 w-24 h-24 bg-' + color + '-500 opacity-5 rounded-full pointer-events-none group-hover:scale-125 transition-transform duration-500"></div>' +
            '<div class="flex-1 min-w-0"><div class="flex items-center gap-2 mb-1.5"><span class="text-[10px] font-black text-gray-400 bg-gray-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider" data-reward-badge>Locked (' + pct + '%)</span></div>' +
            '<h4 class="font-bold text-gray-900 text-[16px] uppercase tracking-tight font-display">' + title + '</h4>' +
            '<p class="text-xs text-gray-500 mt-1 max-w-[85%]">' + desc + '</p>' +
            '<div class="mt-4"><button class="bg-gray-150 hover:bg-gray-200 text-gray-700 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer" data-reward-btn><i data-lucide="lock" class="w-3.5 h-3.5"></i>ACCESS MODULE</button></div></div>' +
            '<div class="w-12 h-12 rounded-2xl bg-' + color + '-50/50 text-' + color + '-700/60 flex items-center justify-center shrink-0 border border-' + color + '-100/50 relative"><i data-lucide="' + icon + '" class="w-5 h-5"></i>' +
            '<div class="absolute -bottom-1 -right-1 w-4.5 h-4.5 rounded-full bg-white flex items-center justify-center border border-' + color + '-200" data-reward-lock-icon><i data-lucide="lock" class="w-2.5 h-2.5 text-' + color + '-700"></i></div></div></div>';
    }

    window.LCRender = { renderState: renderState, renderGame: renderGame };
})();
