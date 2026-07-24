(function () {
    var NAV_ITEMS = [
        { key: 'home', href: 'home/', icon: 'home', label: 'Home' },
        { key: 'lotteries', href: 'lotteries/', icon: 'list', label: 'Lotteries' },
        { key: 'smart-pick', href: 'smart-pick-random/', icon: 'zap', label: 'Smart Pick' },
        { key: 'assistance', href: 'assistance/', icon: 'headset', label: 'Support' },
        { key: 'how-to-use', href: 'how-to-use/', icon: 'help-circle', label: 'How to Use' },
        { key: 'games', href: 'games/', icon: 'gamepad-2', label: 'Games' }
    ];

    function sidebarLink(item, active) {
        var isActive = item.key === active;
        var cls = isActive
            ? 'w-full flex items-center gap-3 px-4 py-3.5 font-normal transition-all sidebar-item-active text-white'
            : 'w-full flex items-center gap-3 px-4 py-3.5 font-normal transition-all rounded-2xl text-gray-600 hover:bg-red-50 hover:text-primary';
        return '<a href="' + item.href + '" class="' + cls + '">' +
            '<i data-lucide="' + item.icon + '" class="w-5 h-5 flex-shrink-0"></i>' +
            '<span class="text-sm font-normal">' + item.label + '</span></a>';
    }

    function bottomNavLink(item, active) {
        var isActive = item.key === active;
        var cls = isActive
            ? 'flex flex-col items-center justify-center shrink-0 min-w-[80px] w-auto px-3.5 h-[54px] gap-1 transition-all rounded-[16px] p-1.5 bottom-nav-active text-white shadow-sm'
            : 'flex flex-col items-center justify-center shrink-0 min-w-[80px] w-auto px-3.5 h-[54px] gap-1 transition-all rounded-[16px] p-1.5 text-[#5c5c5c]';
        var iconColor = isActive ? 'text-white' : 'text-[#5c5c5c]';
        var labelColor = isActive ? 'text-white' : 'text-[#222222]';
        return '<a href="' + item.href + '" class="' + cls + '">' +
            '<i data-lucide="' + item.icon + '" class="w-[20px] h-[20px] stroke-[2.2] ' + iconColor + '"></i>' +
            '<span class="text-[11px] font-normal tracking-tight whitespace-nowrap ' + labelColor + '">' + item.label + '</span></a>';
    }

    function renderSidebar(active) {
        var links = NAV_ITEMS.map(function (i) { return sidebarLink(i, active); }).join('');
        return '' +
        '<div class="p-6 pb-2">' +
            '<div class="flex items-center justify-center">' +
                '<a href="home/" class="flex items-center gap-2"><img src="images/logo.png" alt="Lotto" class="h-12 object-contain" /></a>' +
            '</div>' +
        '</div>' +
        '<div class="flex-1 overflow-y-auto pt-6 px-4 space-y-1 scrollbar-hide">' + links + '</div>' +
        '<div class="p-4 mt-auto">' +
            '<a href="." data-logout class="w-full flex items-center justify-center gap-2 py-3 text-gray-500 hover:text-gray-900 transition-colors font-medium text-sm">' +
                '<i data-lucide="log-out" class="w-4 h-4"></i> Logout</a>' +
        '</div>';
    }

    function renderHeader() {
        return '' +
        '<div class="lg:hidden flex items-center gap-2">' +
            '<a href="home/" class="flex items-center gap-2"><img src="images/logo.png" alt="Lotto" class="h-12 object-contain cursor-pointer" /></a>' +
        '</div>' +
        '<div class="flex items-center gap-4 ml-auto">' +
            '<a href="." data-logout class="w-11 h-11 bg-white rounded-full flex items-center justify-center border border-gray-100 text-gray-500 hover:text-[#ff3931] hover:border-red-100 hover:bg-red-50/30 transition-colors" title="Logout"><i data-lucide="log-out" class="w-5 h-5"></i></a>' +
            '<a href="profile/" class="w-11 h-11 flex items-center justify-center relative group cursor-pointer z-10" title="Basic Member">' +
                '<div class="w-full h-full rounded-full flex items-center justify-center border border-gray-250 p-[1px] bg-white overflow-hidden">' +
                    '<div class="w-full h-full rounded-full overflow-hidden border border-gray-200 flex items-center justify-center bg-gray-100 text-gray-700 hover:text-primary transition-colors"><i data-lucide="user" class="w-5 h-5 text-gray-700"></i></div>' +
                '</div>' +
            '</a>' +
        '</div>';
    }

    function renderUnlockModal() {
        return '' +
        '<div id="gamified-unlock-modal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 hidden">' +
          '<div class="bg-white rounded-[28px] border border-gray-200 shadow-[0_16px_48px_rgba(0,0,0,0.15)] max-w-md w-full overflow-hidden animate-scale-up">' +
            '<div class="p-8 pb-4 flex flex-col items-center text-center border-b border-gray-100">' +
              '<div class="w-16 h-16 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center mb-4 shadow-sm border border-green-100">' +
                '<i data-lucide="party-popper" class="w-7 h-7"></i>' +
              '</div>' +
              '<h1 class="text-2xl font-black text-gray-950 tracking-tight uppercase" style="font-family: \'Archivo Narrow\', sans-serif;">Module Unlocked!</h1>' +
              '<p class="text-xs font-semibold text-green-600 tracking-wider uppercase mt-1">Congratulations</p>' +
            '</div>' +
            '<div class="p-8 space-y-6">' +
              '<div class="space-y-3 text-center">' +
                '<h2 id="unlock-modal-title" class="text-lg font-bold text-gray-900">Module Name Here</h2>' +
                '<p class="text-sm text-gray-600 leading-relaxed font-medium">Congratulations! You have completed the learning activities and unlocked access to this premium tool.</p>' +
              '</div>' +
              '<div class="flex flex-col gap-3 pt-2">' +
                '<button id="gamified-unlock-modal-dismiss" class="w-full bg-gradient-btn text-white font-extrabold py-3.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all hover:scale-105 active:scale-95 text-center shadow-[0_4px_14px_rgba(255,0,0,0.2)] cursor-pointer">' +
                  'GOT IT<i data-lucide="arrow-right" class="w-4 h-4"></i>' +
                '</button>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>';
    }

    function renderMobileNav(active) {
        var links = NAV_ITEMS.map(function (i) { return bottomNavLink(i, active); }).join('') +
            bottomNavLink({ href: '.', icon: 'log-out', label: 'Logout' }, '__none__');
        return '' +
        '<nav id="mobile-nav-scroll" class="relative w-full h-full flex items-center justify-start overflow-x-auto whitespace-nowrap px-4 scrollbar-none py-2 gap-2 border-none">' + links + '</nav>' +
        '<div id="mobile-nav-fade-left" class="absolute left-0 top-0 bottom-0 w-14 bg-gradient-to-r from-white via-white/80 to-transparent pointer-events-none z-30 flex items-center justify-start pl-2.5 transition-opacity duration-300 opacity-0">' +
            '<button id="mobile-nav-prev-btn" class="pointer-events-auto cursor-pointer w-7 h-7 rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.15)] flex items-center justify-center border border-gray-100 focus:outline-none active:scale-95 transition-transform" aria-label="Previous items"><i data-lucide="chevron-left" class="w-4 h-4 text-gray-700"></i></button>' +
        '</div>' +
        '<div id="mobile-nav-fade-right" class="absolute right-0 top-0 bottom-0 w-14 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none z-30 flex items-center justify-end pr-2.5 transition-opacity duration-300">' +
            '<button id="mobile-nav-next-btn" class="pointer-events-auto cursor-pointer w-7 h-7 rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.15)] flex items-center justify-center border border-gray-100 focus:outline-none active:scale-95 transition-transform" aria-label="Next items"><i data-lucide="chevron-right" class="w-4 h-4 text-gray-700"></i></button>' +
        '</div>';
    }

    // Base path (matches <base href>) — used for JS navigation, which does NOT honor <base>.
    var baseEl = document.querySelector('base');
    var BASE = (baseEl && baseEl.getAttribute('href')) || '/';

    document.addEventListener('DOMContentLoaded', function () {
        // Login gate: internal pages require a session; otherwise back to login.
        if (!localStorage.getItem('member_email')) {
            window.location.replace(BASE);
            return;
        }

        var active = document.body.getAttribute('data-active') || '';

        var sidebarEl = document.getElementById('site-sidebar');
        if (sidebarEl) sidebarEl.innerHTML = renderSidebar(active);

        var headerEl = document.getElementById('site-header');
        if (headerEl) headerEl.innerHTML = renderHeader();

        var mobileNavEl = document.getElementById('site-mobile-nav');
        if (mobileNavEl) mobileNavEl.innerHTML = renderMobileNav(active);

        var modalsEl = document.getElementById('site-modals');
        if (modalsEl) modalsEl.innerHTML = renderUnlockModal();

        document.querySelectorAll('[data-logout]').forEach(function (el) {
            el.addEventListener('click', function (e) {
                e.preventDefault();
                localStorage.removeItem('member_email');
                window.location.href = BASE;
            });
        });

        if (window.lucide) lucide.createIcons();

        // Learning Journey accordion (Home only)
        var btnToggle = document.getElementById('btn-toggle-journey');
        var stepsDiv = document.getElementById('journey-steps');
        var chevron = document.getElementById('journey-chevron');
        if (btnToggle && stepsDiv && chevron) {
            stepsDiv.style.maxHeight = '0px';
            btnToggle.addEventListener('click', function () {
                var isCollapsed = stepsDiv.style.maxHeight === '0px';
                if (isCollapsed) {
                    stepsDiv.style.maxHeight = '600px';
                    stepsDiv.style.marginTop = '12px';
                    chevron.style.transform = 'rotate(180deg)';
                } else {
                    stepsDiv.style.maxHeight = '0px';
                    stepsDiv.style.marginTop = '0px';
                    chevron.style.transform = 'rotate(0deg)';
                }
            });
        }

        // US map (Home only)
        var mapContainer = document.getElementById('map-container');
        if (mapContainer) {
            var UNAVAILABLE = ['NV', 'UT', 'AL'];
            var scale = 1;

            fetch('vendor/us-map.svg')
                .then(function (res) { return res.text(); })
                .then(function (svg) {
                    mapContainer.innerHTML = svg;
                    var shapes = mapContainer.querySelectorAll('path[id], circle[id]');
                    shapes.forEach(function (el) {
                        var code = el.id.length === 2 ? el.id : null;
                        if (!code) return;
                        el.classList.add(UNAVAILABLE.indexOf(code) > -1 ? 'state-inactive' : 'state-active');
                        if (UNAVAILABLE.indexOf(code) === -1) {
                            el.addEventListener('click', function () {
                                if (window.LCProgress) window.LCProgress.markStep('map');
                                window.location.href = 'lotteries/state.html?s=' + code.toLowerCase();
                            });
                        }
                    });
                });

            function applyZoom() {
                mapContainer.style.transform = 'scale(' + scale + ')';
            }

            var btnZoomIn = document.getElementById('btn-zoom-in');
            var btnZoomOut = document.getElementById('btn-zoom-out');
            var btnZoomReset = document.getElementById('btn-zoom-reset');
            if (btnZoomIn) btnZoomIn.addEventListener('click', function () { if (window.LCProgress) window.LCProgress.markStep('map'); scale = Math.min(scale + 0.2, 2.4); applyZoom(); });
            if (btnZoomOut) btnZoomOut.addEventListener('click', function () { if (window.LCProgress) window.LCProgress.markStep('map'); scale = Math.max(scale - 0.2, 0.6); applyZoom(); });
            if (btnZoomReset) btnZoomReset.addEventListener('click', function () { if (window.LCProgress) window.LCProgress.markStep('map'); scale = 1; applyZoom(); });
        }

        // Mobile bottom nav scroll fades (only meaningful if injected)
        var nav = document.getElementById('mobile-nav-scroll');
        if (nav) {
            var btnPrev = document.getElementById('mobile-nav-prev-btn');
            var btnNext = document.getElementById('mobile-nav-next-btn');
            var fadeLeft = document.getElementById('mobile-nav-fade-left');
            var fadeRight = document.getElementById('mobile-nav-fade-right');

            if (btnNext) btnNext.addEventListener('click', function () { nav.scrollBy({ left: 130, behavior: 'smooth' }); });
            if (btnPrev) btnPrev.addEventListener('click', function () { nav.scrollBy({ left: -130, behavior: 'smooth' }); });

            function updateButtons() {
                if (!fadeLeft || !fadeRight || !btnPrev || !btnNext) return;
                var scrollLeft = nav.scrollLeft;
                var maxScroll = nav.scrollWidth - nav.clientWidth;
                if (scrollLeft <= 5) { fadeLeft.style.opacity = '0'; btnPrev.style.pointerEvents = 'none'; }
                else { fadeLeft.style.opacity = '1'; btnPrev.style.pointerEvents = 'auto'; }
                if (scrollLeft >= maxScroll - 5) { fadeRight.style.opacity = '0'; btnNext.style.pointerEvents = 'none'; }
                else { fadeRight.style.opacity = '1'; btnNext.style.pointerEvents = 'auto'; }
            }

            function centerActiveItem() {
                var activeItem = nav.querySelector('.bottom-nav-active');
                if (activeItem) {
                    var scrollTarget = activeItem.offsetLeft - (nav.clientWidth / 2) + (activeItem.clientWidth / 2);
                    nav.scrollTo({ left: scrollTarget, behavior: 'instant' });
                }
            }

            nav.addEventListener('scroll', updateButtons);
            setTimeout(function () { centerActiveItem(); updateButtons(); }, 200);
            window.addEventListener('resize', function () { centerActiveItem(); updateButtons(); });
        }
    });
})();
