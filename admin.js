// Admin system - loaded only after secret key sequence
// Credentials obfuscated (base64) - not real security, just not obvious
const USER = atob('YWRtaW4=');
const PASS = atob('YWRtaW4=');

// Build modal and panel dynamically so they don't exist in HTML source
function buildAdminHTML() {
    if (document.getElementById('loginModal')) return;
    
    document.body.insertAdjacentHTML('beforeend', `
        <div class="modal-overlay" id="loginModal">
            <div class="modal-box">
                <div class="modal-header">
                    <span class="modal-title">Admin Access</span>
                    <button class="modal-close" onclick="closeModal()">&times;</button>
                </div>
                <div class="modal-field">
                    <label>Username</label>
                    <input type="text" id="adminUser" placeholder="Enter username" autocomplete="off">
                </div>
                <div class="modal-field">
                    <label>Password</label>
                    <input type="password" id="adminPass" placeholder="Enter password">
                </div>
                <div class="modal-error" id="loginError"></div>
                <button class="modal-btn" onclick="attemptLogin()">Log In</button>
            </div>
        </div>
        
        <div class="admin-panel" id="adminPanel">
            <p>Commission count: <strong id="adminCount">0</strong></p>
            <button class="admin-add-btn" onclick="addCommission()">
                <span>+</span> Add Commission
            </button>
            <button class="admin-logout" onclick="logoutAdmin()">Log Out</button>
        </div>
    `);
    
    // Close on overlay click
    document.getElementById('loginModal').addEventListener('click', (e) => {
        if (e.target.id === 'loginModal') closeModal();
    });
    
    // Enter key to submit
    document.getElementById('adminPass').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') attemptLogin();
    });
}

function openModal() {
    buildAdminHTML();
    const modal = document.getElementById('loginModal');
    modal.classList.add('open');
    document.getElementById('adminUser').focus();
}

function closeModal() {
    const modal = document.getElementById('loginModal');
    if (modal) modal.classList.remove('open');
    const error = document.getElementById('loginError');
    if (error) error.textContent = '';
}

function attemptLogin() {
    const u = document.getElementById('adminUser').value;
    const p = document.getElementById('adminPass').value;
    const error = document.getElementById('loginError');
    
    if (u === USER && p === PASS) {
        closeModal();
        showAdminPanel();
        error.textContent = '';
    } else {
        error.textContent = 'Invalid credentials';
        document.getElementById('adminPass').value = '';
    }
}

function showAdminPanel() {
    const panel = document.getElementById('adminPanel');
    const count = localStorage.getItem('blxurr_commissions') || '0';
    document.getElementById('adminCount').textContent = count;
    panel.classList.add('visible');
}

function addCommission() {
    let count = parseInt(localStorage.getItem('blxurr_commissions') || '0');
    count++;
    localStorage.setItem('blxurr_commissions', count.toString());
    document.getElementById('adminCount').textContent = count;
    
    // Update the main page counter if it exists
    const display = document.getElementById('commissionCount');
    if (display) {
        display.textContent = count;
        display.classList.add('bump');
        setTimeout(() => display.classList.remove('bump'), 350);
    }
}

function logoutAdmin() {
    document.getElementById('adminPanel').classList.remove('visible');
    document.getElementById('adminUser').value = '';
    document.getElementById('adminPass').value = '';
}

// Auto-open modal if this script was just loaded (triggered by key sequence)
openModal();
