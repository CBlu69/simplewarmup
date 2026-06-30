// ===== SUPABASE CONFIG =====
const SUPABASE_URL = 'https://kmgtrqwcuuqdgrgmkvkf.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImttZ3RycXdjdXVxZGdyZ21rdmtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI2NTY2MjIsImV4cCI6MjA5ODIzMjYyMn0.i22KZmspL89WZreO05p0PU4lP3UnYLfGPSZ-tOWo_b4';

var supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ===== توابع =====
function getAvatar(name) {
    var av = ['🚗', '🏎️', '🚙', '🔥', '💨', '⚡', '🔧', '🎵'];
    var h = 0;
    for (var i = 0; i < name.length; i++) {
        h = name.charCodeAt(i) + ((h << 5) - h);
    }
    return av[Math.abs(h) % av.length];
}

function showToast(message, type) {
    type = type || 'info';
    var toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.className = 'toast toast-' + type + ' show';
    setTimeout(function() {
        toast.classList.remove('show');
    }, 3000);
}

async function checkAuth() {
    var result = await supabaseClient.auth.getSession();
    var session = result.data.session;

    if (session && session.user) {
        var profileResult = await supabaseClient
            .from('profiles')
            .select('*')
            .eq('id', session.user.id);

        var profile = (profileResult.data && profileResult.data.length > 0) ? profileResult.data[0] : null;

        var userData = {
            id: session.user.id,
            email: session.user.email,
            username: (profile && profile.username) || (session.user.user_metadata && session.user.user_metadata.username) || 'کاربر',
            role: (profile && profile.role) || 'user',
            avatar: (profile && profile.avatar) || getAvatar((profile && profile.username) || 'کاربر')
        };

        // ذخیره توی localStorage
        localStorage.setItem('chat_userId', userData.id);
        localStorage.setItem('chat_username', userData.username);
        localStorage.setItem('chat_userRole', userData.role);
        localStorage.setItem('chat_avatar', userData.avatar);

        return userData;
    }

    return null;
}

async function signupUser(username, email, password) {
    if (!username || !email || !password) {
        showToast('❌ همه فیلدها رو پر کن', 'error');
        return null;
    }
    if (password.length < 6) {
        showToast('❌ رمز باید حداقل ۶ کاراکتر باشه', 'error');
        return null;
    }

    var authResult = await supabaseClient.auth.signUp({
        email: email,
        password: password,
        options: {
            data: { username: username }
        }
    });

    if (authResult.error) {
        showToast('❌ ' + authResult.error.message, 'error');
        return null;
    }

    if (authResult.data && authResult.data.user) {
        // ذخیره توی جدول profiles با ایمیل
        var insertResult = await supabaseClient.from('profiles').insert({
            id: authResult.data.user.id,
            username: username,
            email: email,
            role: 'user',
            avatar: getAvatar(username),
            created_at: new Date().toISOString()
        });

        if (insertResult.error) {
            console.log('خطا در ذخیره پروفایل:', insertResult.error.message);
            // اگه خطا خورد، آپدیت کن
            await supabaseClient.from('profiles').upsert({
                id: authResult.data.user.id,
                username: username,
                email: email,
                role: 'user',
                avatar: getAvatar(username),
                created_at: new Date().toISOString()
            });
        }
    }

    showToast('✅ ثبت‌نام موفق! حالا وارد شو', 'success');
    return authResult.data;
}

async function loginUser(email, password) {
    if (!email || !password) {
        showToast('❌ ایمیل و رمز رو وارد کن', 'error');
        return null;
    }

    var result = await supabaseClient.auth.signInWithPassword({
        email: email,
        password: password
    });

    if (result.error) {
        showToast('❌ ' + result.error.message, 'error');
        return null;
    }

    var userData = await checkAuth();
    if (userData) {
        showToast('✅ خوش آمدی ' + userData.username + '!', 'success');
    }
    return userData;
}

async function logoutUser() {
    await supabaseClient.auth.signOut();
    localStorage.removeItem('chat_userId');
    localStorage.removeItem('chat_username');
    localStorage.removeItem('chat_userRole');
    localStorage.removeItem('chat_avatar');
}

async function resetPassword(email) {
    if (!email) {
        showToast('❌ ایمیل رو وارد کن', 'error');
        return;
    }
    var result = await supabaseClient.auth.resetPasswordForEmail(email);
    if (result.error) {
        showToast('❌ ' + result.error.message, 'error');
    } else {
        showToast('📧 لینک بازنشانی به ایمیلت ارسال شد', 'success');
    }
}