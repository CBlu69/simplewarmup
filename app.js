/* ==================== FLIP CARDS - CLICK ONLY ==================== */
(function initFlipCards() {
    document.querySelectorAll('.flip-card').forEach(card => {
        card.addEventListener('click', function () {
            const inner = this.querySelector('.flip-card-inner');
            inner.classList.toggle('flipped');
        });
    });
})();

/* ==================== SCROLL TO TOP BUTTON ==================== */
(function initScrollTop() {
    const btn = document.getElementById('scrollTop');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
})();

/* ==================== MOBILE NAV TOGGLE ==================== */
(function initMobileNav() {
    const toggle = document.getElementById('mobileToggle');
    const navLinks = document.querySelector('.nav-links');

    if (!toggle || !navLinks) return;

    toggle.addEventListener('click', () => {
        navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
        });
    });
})();

/* ==================== SCROLL REVEAL ANIMATION ==================== */
(function initScrollReveal() {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        },
        { threshold: 0.15 }
    );

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
})();

/* ==================== COUNTER ANIMATION ==================== */
(function initCounters() {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.getAttribute('data-count'));
                    if (!target) return;

                    const duration = 2000;
                    const step = target / (duration / 16);
                    let current = 0;

                    const updateCounter = () => {
                        current += step;
                        if (current < target) {
                            el.textContent = Math.floor(current) + '+';
                            requestAnimationFrame(updateCounter);
                        } else {
                            el.textContent = target + '+';
                        }
                    };

                    updateCounter();
                    observer.unobserve(el);
                }
            });
        },
        { threshold: 0.5 }
    );

    document.querySelectorAll('[data-count]').forEach((el) => observer.observe(el));
})();

/* ==================== SMOOTH SCROLL ==================== */
(function initSmoothScroll() {
    document.querySelectorAll('[data-scroll]').forEach((btn) => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-scroll');
            const target = document.getElementById(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
})();

/* ==================== CONTACT CARD ACTIONS ==================== */
(function initContactActions() {
    document.querySelectorAll('.contact-card[data-action]').forEach((card) => {
        card.addEventListener('click', () => {
            const action = card.getAttribute('data-action');

            switch (action) {
                case 'call':
                    alert('📞 شماره تماس: ۰۹۱۲-XXX-XXXX');
                    break;
                case 'instagram':
                    window.open('https://instagram.com/simplewarmup', '_blank');
                    break;
                default:
                    break;
            }
        });
    });
})();

/* ==================== NAVBAR SCROLL EFFECT ==================== */
(function initNavbarScroll() {
    const nav = document.getElementById('navbar');
    if (!nav) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.style.background = 'rgba(4, 26, 46, 0.9)';
            nav.style.backdropFilter = 'blur(30px)';
        } else {
            nav.style.background = 'linear-gradient(180deg, rgba(4, 26, 46, 0.8), transparent)';
            nav.style.backdropFilter = 'blur(20px)';
        }
    });
})();

/* ==================== SYNCED CHAT PREVIEW (SUPABASE) ==================== */
(function initChatPreview() {
    const previewMessages = document.getElementById('previewMessages');
    const onlineCount = document.getElementById('onlineCount');

    if (!previewMessages) return;

    const supabase = window.supabaseClient;
    if (!supabase) {
        console.log('❌ Supabase برای چت پریمویو در دسترس نیست');
        return;
    }

    async function renderMessages() {
        var result = await supabase
            .from('chat_messages')
            .select('*')
            .eq('group_name', 'general')
            .order('created_at', { ascending: false })
            .limit(5);

        var messages = result.data;

        if (!messages || messages.length === 0) {
            previewMessages.innerHTML = '<div style="text-align:center;color:rgba(179,236,255,0.3);padding:20px;"><p>هنوز پیامی نیست!</p><p style="font-size:11px;">اولین نفر باش که پیام میده 💬</p></div>';
            return;
        }

        messages.reverse();

        previewMessages.innerHTML = messages.map(function(msg) {
            var time = msg.created_at ? new Date(msg.created_at).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }) : '';
            return '<div class="chat-msg"><span class="msg-user">' + (msg.avatar || '👤') + ' ' + (msg.username || 'ناشناس') + ':</span><span class="msg-text">' + (msg.text || '') + '</span><span class="msg-time">' + time + '</span></div>';
        }).join('');

        previewMessages.scrollTop = previewMessages.scrollHeight;
    }

    async function updateOnlineDisplay() {
        var result = await supabase.from('online_users').select('*');
        var data = result.data;
        var total = data ? data.length : 0;
        if (onlineCount) {
            onlineCount.textContent = total + ' نفر آنلاین';
        }
    }

    renderMessages();
    updateOnlineDisplay();
    setInterval(renderMessages, 3000);
    setInterval(updateOnlineDisplay, 5000);

    console.log('💬 چت پریمویو به Supabase وصله!');
})();

/* ==================== SHOP BUTTONS ==================== */
(function initShopButtons() {
    document.querySelectorAll('.shop-btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            const card = this.closest('.shop-card');
            const title = card.querySelector('.shop-title').textContent;
            alert('🛒 "' + title + '" به سبد خرید اضافه شد!\n\n📞 برای تکمیل خرید: ۰۹۱۲-XXX-XXXX');
        });
    });
})();

/* ==================== IMAGE PROTECTION ==================== */
(function protectImages() {
    const carWrap = document.querySelector('.car-wrap');
    if (!carWrap) return;

    carWrap.addEventListener('contextmenu', (e) => e.preventDefault());
    carWrap.addEventListener('dragstart', (e) => e.preventDefault());
})();

/* ==================== SCROLL CAR (IMPALA) ==================== */
(function initScrollCar() {
    const car = document.getElementById('scrollCar');
    const img = car?.querySelector('img');
    if (!car || !img) return;

    let lastScroll = 0;

    function moveCar() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        
        if (docHeight <= 0) return;
        
        const scrollPercent = Math.min(scrollTop / docHeight, 1);
        const startTop = window.innerHeight * 0.12;
        const maxTop = window.innerHeight - 100;
        const newTop = startTop + (scrollPercent * (maxTop - startTop));
        
        car.style.top = newTop + 'px';

        if (scrollTop > lastScroll) {
            img.style.transform = 'scaleY(-1)';
        } else {
            img.style.transform = 'scaleY(1)';
        }
        
        lastScroll = scrollTop;
    }

    window.addEventListener('scroll', moveCar, { passive: true });
    moveCar();
})();

console.log('☁️ Simple Warmup - Ready! 🏎️');