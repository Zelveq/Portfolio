// Admin system — loaded only after secret key sequence "blx"
const USER = atob('YWRtaW4=');
const PASS = atob('YWRtaW4=');

function buildAdminHTML() {
    if (document.getElementById('loginModal')) return;

    document.body.insertAdjacentHTML('beforeend', `
        <div class="modal-overlay" id="loginModal">
            <div class="modal-box">
                <div class="modal-header">
                    <span class="modal-title">Admin Login</span>
                    <button class="modal-close" id="modalClose">&times;</button>
                </div>
                <div class="modal-field">
                    <label>Username</label>
                    <input type="text" id="loginUser" placeholder="username" autocomplete="off">
                </div>
                <div class="modal-field">
                    <label>Password</label>
                    <input type="password" id="loginPass" placeholder="••••••••">
                </div>
                <p class="modal-error" id="loginError"></p>
                <button class="modal-btn" id="loginSubmit">Sign In</button>
            </div>
        </div>
    `);

    const commissionsSection = document.querySelector('#commissions .section-inner');
    commissionsSection.insertAdjacentHTML('beforeend', `
        <div class="admin-panel" id="adminPanel">
            <p>Logged in as <strong>admin</strong> — tap the button to record a completed commission.</p>
            <button class="admin-add-btn" id="addCommBtn">＋ Add Commission</button>
            <button class="admin-logout" id="logoutBtn">Log out</button>
        </div>
    `);

    document.getElementById('modalClose').addEventListener('click', closeModal);
    document.getElementById('loginSubmit').addEventListener('click', attemptLogin);
    document.getElementById('addCommBtn').addEventListener('click', bumpCount);
    document.getElementById('logoutBtn').addEventListener('click', logoutAdmin);

    document.getElementById('loginModal').addEventListener('click', (e) => {
        if (e.target.id === 'loginModal') closeModal();
    });

    document.getElementById('loginPass').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') attemptLogin();
    });
    document.getElementById('loginUser').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') document.getElementById('loginPass').focus();
    });
}

function openModal() {
    buildAdminHTML();
    const modal = document.getElementById('loginModal');
    modal.classList.add('open');
    setTimeout(() => document.getElementById('loginUser').focus(), 100);
}

function closeModal() {
    const modal = document.getElementById('loginModal');
    if (modal) modal.classList.remove('open');
    const error = document.getElementById('loginError');
    if (error) error.textContent = '';
}

function attemptLogin() {
    const u = document.getElementById('loginUser').value.trim().toLowerCase();
    const p = document.getElementById('loginPass').value;
    const error = document.getElementById('loginError');

    if (u === USER && p === PASS) {
        closeModal();
        showAdminPanel();
        if (error) error.textContent = '';
    } else {
        if (error) error.textContent = 'Wrong credentials. Try again.';
        const passField = document.getElementById('loginPass');
        if (passField) {
            passField.value = '';
            passField.focus();
        }
    }
}

function showAdminPanel() {
    const panel = document.getElementById('adminPanel');
    if (panel) panel.classList.add('visible');
}

function bumpCount() {
    let count = parseInt(localStorage.getItem('blxurr_commissions') || '0');
    const prev = count;
    count++;
    localStorage.setItem('blxurr_commissions', count.toString());

    const display = document.getElementById('commCount');
    if (display) {
        display.textContent = count;
        display.classList.remove('bump');
        void display.offsetWidth;
        display.classList.add('bump');
        display.addEventListener('animationend', () => display.classList.remove('bump'), { once: true });
    }
}

function logoutAdmin() {
    const panel = document.getElementById('adminPanel');
    if (panel) panel.classList.remove('visible');
    const userField = document.getElementById('loginUser');
    const passField = document.getElementById('loginPass');
    if (userField) userField.value = '';
    if (passField) passField.value = '';
}

// Auto-open modal when loaded
openModal();
