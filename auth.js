// ===== SUPABASE CONFIG =====
const SUPABASE_URL = 'https://kmgtrqwcuuqdgrgmkvkf.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImttZ3RycXdjdXVxZGdyZ21rdmtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI2NTY2MjIsImV4cCI6MjA5ODIzMjYyMn0.i22KZmspL89WZreO05p0PU4lP3UnYLfGPSZ-tOWo_b4';

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);


// ===== توابع =====
function getAvatar(name) {
    const av = ['🚗', '🏎️', '🚙', '🔥', '💨', '⚡', '🔧', '🎵'];
    let h = 0;
    for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
    return av[Math.abs(h) % av.length];
}

function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.className = `toast toast-${type} show`;
    setTimeout(() => toast.classList.remove('show'), 3000);
}

async function checkAuth() {
    const { data: { session } } = await supabaseClient.auth.getSession();

    if (session?.user) {
        const { data: profiles } = await supabaseClient
            .from('profiles')
            .select('*')
            .eq('id', session.user.id);

        const profile = profiles && profiles.length > 0 ? profiles[0] : null;

        const userData = {
            id: session.user.id,
            email: session.user.email,
            username: profile?.username || session.user.user_metadata?.username || 'کاربر',
            role: profile?.role || 'user',
            avatar: profile?.avatar || getAvatar(profile?.username || 'کاربر')
        };

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

    const { data: authData, error: authError } = await supabaseClient.auth.signUp({
        email, password,
        options: { data: { username } }
    });

    if (authError) {
        showToast('❌ ' + authError.message, 'error');
        return null;
    }

    if (authData?.user) {
        const { data, error } = await supabaseClient.from('profiles').insert({
            id: authData.user.id,
            username: username,
            role: 'user',
            avatar: getAvatar(username)
        });
    }

    showToast('✅ ثبت‌نام موفق! حالا وارد شو', 'success');
    return authData;
}

async function loginUser(email, password) {
    if (!email || !password) {
        showToast('❌ ایمیل و رمز رو وارد کن', 'error');
        return null;
    }

    const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });

    if (error) {
        showToast('❌ ' + error.message, 'error');
        return null;
    }

    const userData = await checkAuth();
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
    const { error } = await supabaseClient.auth.resetPasswordForEmail(email);
    if (error) {
        showToast('❌ ' + error.message, 'error');
    } else {
        showToast('📧 لینک بازنشانی به ایمیلت ارسال شد', 'success');
    }
}

