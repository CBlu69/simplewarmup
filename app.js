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



/* ==================== SYNCED CHAT PREVIEW WITH REAL ONLINE COUNT ==================== */
(function initChatPreview() {
    const previewMessages = document.getElementById('previewMessages');
    const previewInput = document.getElementById('previewInput');
    const sendPreviewBtn = document.getElementById('sendPreviewBtn');
    const onlineCount = document.getElementById('onlineCount');

    if (!previewMessages || !previewInput || !sendPreviewBtn) return;

    const STORAGE_KEY = 'chat_messages_general';
    const ONLINE_KEY = 'chat_online_users';
    const CHANNEL_NAME = 'chat_presence';

    // User ID
    let userId = localStorage.getItem('chat_userId');
    if (!userId) {
        userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('chat_userId', userId);
    }

    // Broadcast Channel
    const channel = new BroadcastChannel(CHANNEL_NAME);

    // ===== ONLINE USERS =====
    function getOnlineUsers() {
        const data = localStorage.getItem(ONLINE_KEY);
        return data ? JSON.parse(data) : {};
    }

    function broadcastPresence() {
        const name = localStorage.getItem('chat_username') || 'ناشناس';
        const presence = {
            userId: userId,
            username: name,
            group: 'general',
            avatar: getAvatar(name),
            timestamp: Date.now()
        };

        let users = getOnlineUsers();
        users[userId] = presence;
        localStorage.setItem(ONLINE_KEY, JSON.stringify(users));
        channel.postMessage({ type: 'presence', data: presence });
        updateOnlineDisplay();
    }

    function cleanupOnlineUsers() {
        let users = getOnlineUsers();
        const now = Date.now();
        let changed = false;

        Object.keys(users).forEach(id => {
            if (now - users[id].timestamp > 10000) {
                delete users[id];
                changed = true;
            }
        });

        if (changed) {
            localStorage.setItem(ONLINE_KEY, JSON.stringify(users));
            updateOnlineDisplay();
        }
    }

    function updateOnlineDisplay() {
        const users = getOnlineUsers();
        const totalOnline = Object.keys(users).length;
        if (onlineCount) {
            onlineCount.textContent = `${totalOnline} نفر آنلاین`;
        }
    }

    channel.onmessage = (event) => {
        if (event.data.type === 'presence') {
            let users = getOnlineUsers();
            users[event.data.data.userId] = event.data.data;
            localStorage.setItem(ONLINE_KEY, JSON.stringify(users));
            updateOnlineDisplay();
        }
        if (event.data.type === 'leave') {
            let users = getOnlineUsers();
            delete users[event.data.userId];
            localStorage.setItem(ONLINE_KEY, JSON.stringify(users));
            updateOnlineDisplay();
        }
    };

    // ===== MESSAGES =====
    function getUsername() {
        return localStorage.getItem('chat_username') || 'ناشناس';
    }

    function getMessages() {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    }

    function saveMessages(messages) {
        const trimmed = messages.slice(-200);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    }

    function renderMessages() {
        const messages = getMessages();
        const username = getUsername();

        if (messages.length === 0) {
            previewMessages.innerHTML = `
                <div style="text-align:center;color:rgba(179,236,255,0.3);padding:20px;">
                    <p>هنوز پیامی نیست!</p>
                    <p style="font-size:11px;">اولین نفر باش که پیام میده 💬</p>
                </div>
            `;
            return;
        }

        const lastMessages = messages.slice(-5);

        previewMessages.innerHTML = lastMessages.map(msg => {
            const isOwn = msg.username === username;
            return `
                <div class="chat-msg" style="${isOwn ? 'background:rgba(93,213,248,0.08);padding:6px 10px;border-radius:10px;' : ''}">
                    <span class="msg-user">${msg.avatar || '👤'} ${msg.username}${msg.edited ? ' <small>(ویرایش)</small>' : ''}:</span>
                    <span class="msg-text">${escapeHtml(msg.text)}</span>
                    <span class="msg-time">${msg.time}</span>
                </div>
            `;
        }).join('');

        previewMessages.scrollTop = previewMessages.scrollHeight;
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function getAvatar(name) {
        const avatars = ['🚗', '🏎️', '🚙', '🔥', '💨', '⚡', '🔧', '🎵'];
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        return avatars[Math.abs(hash) % avatars.length];
    }

    // ===== SEND MESSAGE =====
    function sendMessage() {
        const text = previewInput.value.trim();
        const username = getUsername();

        if (!text) return;

        const message = {
            id: Date.now(),
            username: username,
            avatar: getAvatar(username),
            text: text,
            time: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
            group: 'general',
            edited: false
        };

        const messages = getMessages();
        messages.push(message);
        saveMessages(messages);

        previewInput.value = '';
        renderMessages();
    }


    // ===== EVENT LISTENERS =====
    sendPreviewBtn.addEventListener('click', sendMessage);

    previewInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    // ===== INIT =====
    broadcastPresence();
    renderMessages();
    updateOnlineDisplay();

    // Refresh messages
    setInterval(renderMessages, 2000);

    // Broadcast presence
    setInterval(broadcastPresence, 5000);

    // Cleanup
    setInterval(cleanupOnlineUsers, 15000);

    // Leave on unload
    window.addEventListener('beforeunload', () => {
        channel.postMessage({ type: 'leave', userId: userId });
        let users = getOnlineUsers();
        delete users[userId];
        localStorage.setItem(ONLINE_KEY, JSON.stringify(users));
    });

    // Visibility change
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            channel.postMessage({ type: 'leave', userId: userId });
        } else {
            broadcastPresence();
            renderMessages();
        }
    });

})();

/* ==================== SHOP BUTTONS ==================== */
(function initShopButtons() {
    document.querySelectorAll('.shop-btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
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

        // جهت ایمپالا
        if (scrollTop > lastScroll) {
            // داره میره پایین → رو به پایین
            img.style.transform = 'scaleY(-1)';
        } else {
            // داره میره بالا → رو به بالا (عادی)
            img.style.transform = 'scaleY(1)';
        }
        
        lastScroll = scrollTop;
    }

    window.addEventListener('scroll', moveCar, { passive: true });
    moveCar();
    
})();