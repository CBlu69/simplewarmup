/* ==================== FLIP CARDS - CLICK ONLY ==================== */
(function initFlipCards() {
    document.querySelectorAll('.flip-card').forEach(card => {
        card.addEventListener('click', function() {
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
                    window.open('https://instagram.com/simple.warmup', '_blank');
                    break;
                case 'whatsapp':
                    window.open('https://wa.me/98912XXXXXXX', '_blank');
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



/* ==================== CHAT PREVIEW ==================== */
(function initChatPreview() {
    const input = document.getElementById('chatPreviewInput');
    const sendBtn = document.getElementById('sendPreviewChat');
    const messages = document.getElementById('chatMessages');
    const joinBtn = document.getElementById('joinChatBtn');

    if (!input || !sendBtn || !messages) return;

    sendBtn.addEventListener('click', () => {
        const text = input.value.trim();
        if (!text) return;

        const msgDiv = document.createElement('div');
        msgDiv.className = 'chat-msg';
        msgDiv.innerHTML = `
            <span class="msg-user">👤 شما:</span>
            <span class="msg-text">${text}</span>
            <span class="msg-time">همین الان</span>
        `;
        messages.appendChild(msgDiv);
        messages.scrollTop = messages.scrollHeight;
        input.value = '';
    });

    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendBtn.click();
    });

    if (joinBtn) {
        joinBtn.addEventListener('click', () => {
            alert('🏎️ به زودی: چت کامل با گروه‌های تخصصی!\n💬 قابلیت ارسال عکس، ویس و استیکر');
        });
    }

    setInterval(() => {
        const count = document.getElementById('onlineCount');
        if (count) {
            count.textContent = `${Math.floor(Math.random() * 10) + 8} نفر آنلاین`;
        }
    }, 10000);
})();

/* ==================== SHOP BUTTONS ==================== */
(function initShopButtons() {
    document.querySelectorAll('.shop-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const card = this.closest('.shop-card');
            const title = card.querySelector('.shop-title').textContent;
            alert(`🛒 "${title}" به سبد خرید اضافه شد!\n\n📞 برای تکمیل خرید: ۰۹۱۲-XXX-XXXX`);
        });
    });
})();

/* ==================== CHAT BUTTON ==================== */
(function initChatButton() {
    const chatBtn = document.getElementById('chat-btn');
    if (!chatBtn) return;

    chatBtn.addEventListener('click', () => {
        alert('🏎️ گروه چت ماشین‌بازا به زودی...\n💨 Stay Tuned!');
    });
})();

/* ==================== IMAGE PROTECTION ==================== */
(function protectImages() {
    const carWrap = document.querySelector('.car-wrap');
    if (!carWrap) return;

    carWrap.addEventListener('contextmenu', (e) => e.preventDefault());
    carWrap.addEventListener('dragstart', (e) => e.preventDefault());
})();

console.log('☁️ Simple Warmup - Ready! 🏎️');