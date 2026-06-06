// Secret key sequence to trigger admin login
const secret = ['b', 'l', 'x'];
let entered = [];

document.addEventListener('keydown', (e) => {
    entered.push(e.key.toLowerCase());
    if (entered.length > secret.length) entered.shift();
    
    if (entered.join('') === secret.join('')) {
        entered = [];
        loadAdmin();
    }
});

function loadAdmin() {
    // Only load admin code when triggered
    const script = document.createElement('script');
    script.src = '/admin.js';
    document.body.appendChild(script);
}
