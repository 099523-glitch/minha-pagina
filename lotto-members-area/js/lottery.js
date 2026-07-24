/*
 * LOTTERY engine — single source of truth for every state + game + tool page.
 * Data-driven: state.html and game.html render entirely from here, so all 47
 * states and every game action work without hand-built files.
 */
window.LOTTERY = (function () {

    var STATE_NAMES = {
        az: 'Arizona', ar: 'Arkansas', ca: 'California', co: 'Colorado', ct: 'Connecticut',
        de: 'Delaware', dc: 'District of Columbia', fl: 'Florida', ga: 'Georgia', id: 'Idaho',
        il: 'Illinois', in: 'Indiana', ia: 'Iowa', ks: 'Kansas', ky: 'Kentucky', la: 'Louisiana',
        me: 'Maine', md: 'Maryland', ma: 'Massachusetts', mi: 'Michigan', mn: 'Minnesota',
        mo: 'Missouri', ms: 'Mississippi', mt: 'Montana', ne: 'Nebraska', nh: 'New Hampshire',
        nj: 'New Jersey', nm: 'New Mexico', ny: 'New York', nc: 'North Carolina', nd: 'North Dakota',
        oh: 'Ohio', ok: 'Oklahoma', or: 'Oregon', pa: 'Pennsylvania', pr: 'Puerto Rico',
        ri: 'Rhode Island', sc: 'South Carolina', sd: 'South Dakota', tn: 'Tennessee', tx: 'Texas',
        vt: 'Vermont', va: 'Virginia', wa: 'Washington', wv: 'West Virginia', wi: 'Wisconsin', wy: 'Wyoming'
    };

    var UNAVAILABLE = ['nv', 'ut', 'al'];

    // --- Deterministic RNG so generated data is stable per game (no flicker on reload) ---
    function seededRng(seedStr) {
        var h = 1779033703 ^ seedStr.length;
        for (var i = 0; i < seedStr.length; i++) {
            h = Math.imul(h ^ seedStr.charCodeAt(i), 3432918353);
            h = (h << 13) | (h >>> 19);
        }
        return function () {
            h = Math.imul(h ^ (h >>> 16), 2246822507);
            h = Math.imul(h ^ (h >>> 13), 3266489909);
            var t = (h ^= h >>> 16) >>> 0;
            return t / 4294967296;
        };
    }

    function uniqueDraw(rng, count, max, digit) {
        if (digit) {
            var d = [];
            for (var i = 0; i < count; i++) d.push(Math.floor(rng() * 10));
            return d;
        }
        var set = [];
        while (set.length < count) {
            var n = Math.floor(rng() * max) + 1;
            if (set.indexOf(n) === -1) set.push(n);
        }
        return set.sort(function (a, b) { return a - b; });
    }

    // --- Powerball / Mega Millions national game definitions (shared by all states) ---
    function powerball() {
        return {
            id: 'mupb', name: 'Powerball', logo: 'images/scraped/powerball.svg', badge: null,
            jackpotLabel: 'Est. jackpot', jackpot: '$570 Million', lastDraw: 'Wednesday, Jul 22, 2026',
            main: [4, 5, 22, 50, 58], special: 1, specialType: 'red', powerPlay: '3', doublePlay: null,
            mainCount: 5, mainMax: 69, specialMax: 26, digit: false,
            drawDays: 'Mon, Wed & Sat', specialName: 'Powerball'
        };
    }
    function megamillions() {
        return {
            id: 'mumm', name: 'Mega Millions', logo: 'images/scraped/megamillions.svg', badge: null,
            jackpotLabel: 'Est. jackpot', jackpot: '$707 Million', lastDraw: 'Tuesday, Jul 21, 2026',
            main: [25, 37, 59, 68, 70], special: 10, specialType: 'yellow', powerPlay: null, doublePlay: null,
            mainCount: 5, mainMax: 70, specialMax: 25, digit: false,
            drawDays: 'Tue & Fri', specialName: 'Mega Ball'
        };
    }

    // --- Generic state-level games for the 45 non-featured states ---
    function genericGames(code) {
        var rng = seededRng(code + '-generic');
        var lotto = uniqueDraw(rng, 6, 49, false);
        var p3 = uniqueDraw(rng, 3, 0, true);
        var p4 = uniqueDraw(rng, 4, 0, true);
        return [
            {
                id: 'lotto', name: STATE_NAMES[code] + ' Lotto', logo: null, badge: code.toUpperCase(),
                jackpotLabel: 'Est. jackpot', jackpot: '$1.8 Million', lastDraw: 'Wednesday, Jul 22, 2026',
                main: lotto, special: null, specialType: null, powerPlay: null, doublePlay: null,
                mainCount: 6, mainMax: 49, specialMax: 0, digit: false, drawDays: 'Wed & Sat', specialName: ''
            },
            {
                id: 'pick-3', name: 'Pick 3', logo: null, badge: 'P3',
                jackpotLabel: 'Top prize', jackpot: '$500', lastDraw: 'Thursday, Jul 23, 2026',
                main: p3, special: null, specialType: null, powerPlay: null, doublePlay: null,
                mainCount: 3, mainMax: 0, specialMax: 0, digit: true, drawDays: 'Daily', specialName: ''
            },
            {
                id: 'pick-4', name: 'Pick 4', logo: null, badge: 'P4',
                jackpotLabel: 'Top prize', jackpot: '$5,000', lastDraw: 'Thursday, Jul 23, 2026',
                main: p4, special: null, specialType: null, powerPlay: null, doublePlay: null,
                mainCount: 4, mainMax: 0, specialMax: 0, digit: true, drawDays: 'Daily', specialName: ''
            }
        ];
    }

    // --- Featured states (exact games as originally built) ---
    var FEATURED = {
        az: {
            banner: 'images/arizona-lottery.png',
            games: [
                objectAssign(powerball(), { doublePlay: { main: [9, 51, 54, 60, 61], special: 15 } }),
                megamillions(),
                { id: 'pick-3-midday', name: 'Pick 3 Midday', logo: 'images/scraped/az-middaypick3.svg', badge: null, jackpotLabel: 'Top prize', jackpot: '$500', lastDraw: 'Thursday, Jul 23, 2026', main: [3, 1, 5], special: null, specialType: null, powerPlay: null, doublePlay: null, mainCount: 3, mainMax: 0, specialMax: 0, digit: true, drawDays: 'Daily', specialName: '' },
                { id: 'pick-3', name: 'Pick 3 Evening', logo: 'images/scraped/az-pick3.svg', badge: null, jackpotLabel: 'Top prize', jackpot: '$500', lastDraw: 'Wednesday, Jul 22, 2026', main: [6, 3, 6], special: null, specialType: null, powerPlay: null, doublePlay: null, mainCount: 3, mainMax: 0, specialMax: 0, digit: true, drawDays: 'Daily', specialName: '' },
                { id: 'pick-4-midday', name: 'Pick 4 Midday', logo: 'images/scraped/az-middaypick4.svg', badge: null, jackpotLabel: 'Top prize', jackpot: '$500', lastDraw: 'Thursday, Jul 23, 2026', main: [3, 9, 8, 9], special: null, specialType: null, powerPlay: null, doublePlay: null, mainCount: 4, mainMax: 0, specialMax: 0, digit: true, drawDays: 'Daily', specialName: '' },
                { id: 'pick-4', name: 'Pick 4 Evening', logo: 'images/scraped/az-pick4.svg', badge: null, jackpotLabel: 'Top prize', jackpot: '$500', lastDraw: 'Wednesday, Jul 22, 2026', main: [9, 7, 0, 8], special: null, specialType: null, powerPlay: null, doublePlay: null, mainCount: 4, mainMax: 0, specialMax: 0, digit: true, drawDays: 'Daily', specialName: '' },
                { id: 'fantasy-5', name: 'Fantasy 5', logo: 'images/scraped/az-fantasy5.svg', badge: null, jackpotLabel: 'Est. jackpot', jackpot: '$56,000', lastDraw: 'Wednesday, Jul 22, 2026', main: [5, 16, 21, 24, 35], special: null, specialType: null, powerPlay: null, doublePlay: null, mainCount: 5, mainMax: 41, specialMax: 0, digit: false, drawDays: 'Daily', specialName: '' },
                { id: 'triple-twist', name: 'Triple Twist', logo: 'images/scraped/az-tripletwist.svg', badge: null, jackpotLabel: 'Est. jackpot', jackpot: '$315,000', lastDraw: 'Wednesday, Jul 22, 2026', main: [6, 7, 10, 11, 17, 34], special: null, specialType: null, powerPlay: null, doublePlay: null, mainCount: 6, mainMax: 35, specialMax: 0, digit: false, drawDays: 'Wed & Sat', specialName: '' },
                { id: 'the-pick', name: 'The Pick', logo: 'images/scraped/az-thepick.svg', badge: null, jackpotLabel: 'Est. jackpot', jackpot: '$1.4 Million', lastDraw: 'Wednesday, Jul 22, 2026', main: [1, 9, 13, 27, 35, 40], special: null, specialType: null, powerPlay: null, doublePlay: null, mainCount: 6, mainMax: 44, specialMax: 0, digit: false, drawDays: 'Wed & Sat', specialName: '' }
            ]
        },
        tx: {
            banner: 'images/texas-lottery.png',
            games: [
                objectAssign(powerball(), { logo: 'images/scraped/tx-powerball.svg', doublePlay: null }),
                objectAssign(megamillions(), { logo: 'images/scraped/tx-megamillions.svg' }),
                { id: 'lotto-texas', name: 'Lotto Texas', logo: 'images/scraped/tx-lottotexas.svg', badge: null, jackpotLabel: 'Est. jackpot', jackpot: '$4.2 Million', lastDraw: 'Wednesday, Jul 22, 2026', main: [3, 17, 22, 29, 44, 48], special: null, specialType: null, powerPlay: null, doublePlay: null, mainCount: 6, mainMax: 54, specialMax: 0, digit: false, drawDays: 'Mon, Wed & Sat', specialName: '' },
                { id: 'texas-two-step', name: 'Texas Two Step', logo: 'images/scraped/tx-texastwostep.svg', badge: null, jackpotLabel: 'Est. jackpot', jackpot: '$200,000', lastDraw: 'Monday, Jul 20, 2026', main: [1, 8, 15, 24], special: 6, specialType: 'red', powerPlay: null, doublePlay: null, mainCount: 4, mainMax: 35, specialMax: 35, digit: false, drawDays: 'Mon & Thu', specialName: 'Bonus Ball' },
                { id: 'cash-five', name: 'Cash Five', logo: 'images/scraped/tx-cash5.svg', badge: null, jackpotLabel: 'Est. jackpot', jackpot: '$35,000', lastDraw: 'Thursday, Jul 23, 2026', main: [2, 11, 20, 27, 33], special: null, specialType: null, powerPlay: null, doublePlay: null, mainCount: 5, mainMax: 35, specialMax: 0, digit: false, drawDays: 'Daily', specialName: '' },
                { id: 'pick-3', name: 'Pick 3', logo: 'images/scraped/tx-pick3.svg', badge: null, jackpotLabel: 'Top prize', jackpot: '$500', lastDraw: 'Thursday, Jul 23, 2026', main: [5, 9, 2], special: null, specialType: null, powerPlay: null, doublePlay: null, mainCount: 3, mainMax: 0, specialMax: 0, digit: true, drawDays: 'Daily', specialName: '' },
                { id: 'daily-4', name: 'Daily 4', logo: 'images/scraped/tx-daily4.svg', badge: null, jackpotLabel: 'Top prize', jackpot: '$5,000', lastDraw: 'Wednesday, Jul 22, 2026', main: [7, 4, 0, 9], special: null, specialType: null, powerPlay: null, doublePlay: null, mainCount: 4, mainMax: 0, specialMax: 0, digit: true, drawDays: 'Daily', specialName: '' }
            ]
        }
    };

    function objectAssign(a, b) {
        for (var k in b) if (b.hasOwnProperty(k)) a[k] = b[k];
        return a;
    }

    function getState(code) {
        code = (code || '').toLowerCase();
        if (!STATE_NAMES[code]) return null;
        if (FEATURED[code]) {
            return { code: code, name: STATE_NAMES[code], banner: FEATURED[code].banner, games: FEATURED[code].games };
        }
        return {
            code: code, name: STATE_NAMES[code], banner: null,
            games: [powerball(), megamillions()].concat(genericGames(code))
        };
    }

    function getGame(code, gid) {
        var st = getState(code);
        if (!st) return null;
        for (var i = 0; i < st.games.length; i++) if (st.games[i].id === gid) return { state: st, game: st.games[i] };
        return null;
    }

    // --- Derived data (deterministic) ---
    var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    function pastDraws(code, game, count) {
        var rng = seededRng(code + '-' + game.id + '-past');
        var out = [];
        var d = new Date(2026, 6, 22); // Jul 22 2026 anchor
        for (var i = 0; i < count; i++) {
            var main = game.id + '' === '' ? [] : uniqueDrawFrom(rng, game);
            var special = game.special !== null && !game.digit ? Math.floor(rng() * game.specialMax) + 1 : null;
            var dd = new Date(d.getTime() - i * (game.digit ? 1 : 3) * 86400000);
            out.push({
                date: MONTHS[dd.getMonth()] + ' ' + dd.getDate() + ', ' + dd.getFullYear(),
                weekday: WEEKDAYS[dd.getDay()],
                main: main, special: special
            });
        }
        // newest draw uses the game's real current numbers
        out[0].main = game.main.slice();
        out[0].special = game.special;
        return out;
    }

    function uniqueDrawFrom(rng, game) {
        return uniqueDraw(rng, game.mainCount, game.mainMax, game.digit);
    }

    function frequency(code, game) {
        // build a hot/cold frequency table over the number pool
        var rng = seededRng(code + '-' + game.id + '-freq');
        var max = game.digit ? 9 : game.mainMax;
        var start = game.digit ? 0 : 1;
        var arr = [];
        for (var n = start; n <= max; n++) {
            arr.push({ n: n, count: 40 + Math.floor(rng() * 60) });
        }
        arr.sort(function (a, b) { return b.count - a.count; });
        return arr;
    }

    function hotOverdue(code, game) {
        var f = frequency(code, game);
        var hot = f.slice(0, 8).map(function (x) { return x.n; });
        var overdue = f.slice(-8).map(function (x) { return x.n; }).reverse();
        var hotS = [], overS = [];
        if (game.special !== null && !game.digit) {
            var rng = seededRng(code + '-' + game.id + '-sp');
            var pool = [];
            for (var i = 1; i <= game.specialMax; i++) pool.push(i);
            pool.sort(function () { return rng() - 0.5; });
            hotS = pool.slice(0, 3);
            overS = pool.slice(3, 6);
        }
        return { hot: hot, overdue: overdue, hotSpecial: hotS, overdueSpecial: overS };
    }

    // --- Ball HTML ---
    function ball(n, type) {
        var cls = type === 'red' ? 'ball-red' : type === 'yellow' ? 'ball-yellow' : 'ball';
        return '<div class="' + cls + '">' + n + '</div>';
    }

    return {
        STATE_NAMES: STATE_NAMES,
        UNAVAILABLE: UNAVAILABLE,
        getState: getState,
        getGame: getGame,
        pastDraws: pastDraws,
        frequency: frequency,
        hotOverdue: hotOverdue,
        ball: ball
    };
})();
