/* =============================================
   FoodBridge AI — Frontend Script (script.js)
   ============================================= */

'use strict';

/* ─── Utility: Toast ─── */
function showToast(msg, duration = 3000) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMsg');
    if (!toast) return;
    if (toastMsg) toastMsg.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), duration);
}

/* ─── Utility: goToPage ─── */
function goToPage(page) {
    window.location.href = page;
}

/* ─── Navbar Mobile Toggle ─── */
function toggleNav() {
    const links = document.getElementById('navLinks');
    if (links) links.classList.toggle('open');
}

/* ─── Validate required fields ─── */
function validateFields(fields) {
    for (const { id, label } of fields) {
        const el = document.getElementById(id);
        if (!el) continue;
        const val = el.value.trim();
        if (!val) {
            el.style.borderColor = '#e85d20';
            el.focus();
            showToast(`⚠️ Please fill in: ${label}`);
            setTimeout(() => { el.style.borderColor = ''; }, 3000);
            return false;
        }
    }
    return true;
}

/* ─── Animated Counter ─── */
function animateCounter(el, target, suffix = '', duration = 1800) {
    if (!el) return;
    const startTime = performance.now();
    const isFloat = target % 1 !== 0;
    function update(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = target * eased;
        el.textContent = isFloat
            ? current.toFixed(1) + suffix
            : Math.floor(current).toLocaleString() + suffix;
        if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
}

/* ─── HOME PAGE ─── */
function initHomePage() {
    // Metric counters
    animateCounter(document.getElementById('mealsCount'), 1248590);
    animateCounter(document.getElementById('wasteCount'), 450.2, ' Tons');
    animateCounter(document.getElementById('zonesCount'), 142);

    // Map pins
    spawnMapPins('mapPins');

    // Bar chart for monthly (not on home but just in case)
    buildBarChart();
}

/* ─── IMPACT PAGE ─── */
function initImpactPage() {
    buildBarChart();
}

/* ─── Bar Chart ─── */
function buildBarChart() {
    const container = document.getElementById('chartBars');
    if (!container) return;

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const data = [72000, 85000, 91000, 88000, 104000, 118000, 130000, 124000, 138000, 145000, 139000, 153000];
    const max = Math.max(...data);

    container.innerHTML = '';
    months.forEach((m, i) => {
        const pct = (data[i] / max) * 100;
        const wrap = document.createElement('div');
        wrap.className = 'bar-wrap';
        wrap.title = `${m}: ${data[i].toLocaleString()} meals`;
        wrap.innerHTML = `
      <div class="bar" style="height:0%;transition:height .8s ease ${i * 0.05}s;" data-h="${pct}%"></div>
      <div class="bar-label">${m}</div>
    `;
        container.appendChild(wrap);
    });

    // Animate bars in
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            container.querySelectorAll('.bar').forEach(b => {
                b.style.height = b.dataset.h;
            });
        });
    });
}

/* ─── Map Pins ─── */
function spawnMapPins(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';
    const pins = [
        { top: '30%', left: '25%', cls: 'green' },
        { top: '55%', left: '60%', cls: 'orange' },
        { top: '20%', left: '70%', cls: 'blue' },
        { top: '70%', left: '35%', cls: 'green' },
        { top: '40%', left: '80%', cls: 'orange' },
        { top: '65%', left: '15%', cls: 'blue' },
    ];

    pins.forEach(p => {
        const pin = document.createElement('div');
        pin.className = `map-pin ${p.cls}`;
        pin.style.top = p.top;
        pin.style.left = p.left;
        container.appendChild(pin);
    });
}

/* ─── LOGISTICS PAGE ─── */
function initLogisticsPage() {
    spawnMapPins('logMapPins');
    buildDeliveryTable();
    buildAISummary();

    // Animate counters
    animateCounter(document.getElementById('logRoutes'), 247);
    animateCounter(document.getElementById('logActive'), 38);
}

const DELIVERY_DATA = [
    { id: '#BR-4821', donor: 'The Green Café', recipient: 'Pune Community Food Bank', items: 'Cooked meals (42)', eta: '12 mins', status: 'In Transit' },
    { id: '#BR-4819', donor: 'FreshMart Kothrud', recipient: 'Shelter Home – Camp', items: 'Vegetables (18 kg)', eta: '8 mins', status: 'Pickup Complete' },
    { id: '#BR-4817', donor: 'Hotel Aashiyana', recipient: 'Mid-day Meal NGO', items: 'Rice & Dal (65 kg)', eta: '27 mins', status: 'In Transit' },
    { id: '#BR-4815', donor: 'Metro Bakery', recipient: 'Children\'s Home', items: 'Bread (120 pcs)', eta: '5 mins', status: 'Arriving' },
    { id: '#BR-4813', donor: 'BigBasket Outlet', recipient: 'Yerwada Food Bank', items: 'Mixed groceries', eta: '41 mins', status: 'Pickup Pending' },
    { id: '#BR-4811', donor: 'Domino\'s Shivajinagar', recipient: 'Railway Station NGO', items: 'Pizzas (30)', eta: '19 mins', status: 'In Transit' },
];

const STATUS_COLORS = {
    'In Transit': { bg: '#dbeafe', color: '#1e40af' },
    'Pickup Complete': { bg: '#dcfce7', color: '#166534' },
    'Arriving': { bg: '#fef3c7', color: '#92400e' },
    'Pickup Pending': { bg: '#fee2e2', color: '#991b1b' },
};

function buildDeliveryTable() {
    const tbody = document.getElementById('deliveryTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';
    DELIVERY_DATA.forEach(d => {
        const sc = STATUS_COLORS[d.status] || { bg: '#f3f4f6', color: '#374151' };
        const tr = document.createElement('tr');
        tr.style.borderBottom = '1px solid #e4ebe6';
        tr.innerHTML = `
      <td style="padding:14px 20px;font-weight:600;font-family:var(--font-head);font-size:.82rem;">${d.id}</td>
      <td style="padding:14px 20px;">${d.donor}</td>
      <td style="padding:14px 20px;">${d.recipient}</td>
      <td style="padding:14px 20px;color:var(--gray);">${d.items}</td>
      <td style="padding:14px 20px;font-weight:600;">${d.eta}</td>
      <td style="padding:14px 20px;">
        <span style="background:${sc.bg};color:${sc.color};border-radius:100px;padding:4px 12px;font-size:.75rem;font-weight:600;">${d.status}</span>
      </td>
    `;
        tbody.appendChild(tr);
    });
}

function refreshDeliveries() {
    buildDeliveryTable();
    showToast('✅ Delivery data refreshed!');
}

function buildAISummary() {
    const container = document.getElementById('aiSummary');
    if (!container) return;
    const items = [
        { label: 'Routes computed today', value: '247', icon: '🔄' },
        { label: 'Avg. delivery time', value: '18 min', icon: '⏱️' },
        { label: 'Emissions saved', value: '142 kg CO₂', icon: '🌿' },
        { label: 'Re-routes triggered', value: '12', icon: '⚡' },
    ];
    container.innerHTML = items.map(it => `
    <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 0;border-bottom:1px solid rgba(255,255,255,.06);">
      <div style="display:flex;align-items:center;gap:10px;font-size:.85rem;color:rgba(255,255,255,.6);">
        <span>${it.icon}</span>${it.label}
      </div>
      <div style="font-family:var(--font-head);font-weight:700;color:var(--green-light);">${it.value}</div>
    </div>
  `).join('');
}

/* ─── DONATE FORM ─── */
function submitDonation() {
    const required = [
        { id: 'businessName', label: 'Business Name' },
        { id: 'contactName', label: 'Contact Person' },
        { id: 'contactPhone', label: 'Phone Number' },
        { id: 'contactEmail', label: 'Email Address' },
        { id: 'businessType', label: 'Business Type' },
        { id: 'pickupAddress', label: 'Pickup Address' },
    ];
    if (!validateFields(required)) return;

    // Simulate API submission
    const btn = event.target;
    btn.textContent = 'Submitting…';
    btn.disabled = true;

    setTimeout(() => {
        btn.textContent = '✅ Registration Received!';
        btn.style.background = '#22a962';
        showToast('🎉 Welcome to FoodBridge! We\'ll verify your business within 24 hours.');
        // Send to backend
        submitToServer('/api/donate', collectFormData(['businessName', 'contactName', 'contactPhone', 'contactEmail', 'businessType', 'pickupAddress', 'city', 'pincode', 'foodTypes', 'pickupWindow', 'notes']));
    }, 1400);
}

/* ─── REQUEST FORM ─── */
function submitRequest() {
    const required = [
        { id: 'orgName', label: 'Organisation Name' },
        { id: 'orgType', label: 'Organisation Type' },
        { id: 'reqContact', label: 'Contact Person' },
        { id: 'reqPhone', label: 'Phone' },
        { id: 'reqEmail', label: 'Email' },
        { id: 'reqAddress', label: 'Delivery Address' },
        { id: 'foodNeeded', label: 'Food Items Needed' },
    ];
    if (!validateFields(required)) return;

    const btn = event.target;
    btn.textContent = 'Submitting…';
    btn.disabled = true;

    setTimeout(() => {
        btn.textContent = '✅ Request Submitted!';
        btn.style.background = '#22a962';
        showToast('📦 Your request is live! We\'re matching you with donors now.');
        submitToServer('/api/request', collectFormData(['orgName', 'orgType', 'reqContact', 'reqPhone', 'reqEmail', 'reqAddress', 'peopleServed', 'urgency', 'foodNeeded', 'quantity', 'deliveryWindow', 'reqNotes']));
    }, 1400);
}

/* ─── VOLUNTEER FORM ─── */
function submitVolunteer() {
    const required = [
        { id: 'volFirst', label: 'First Name' },
        { id: 'volLast', label: 'Last Name' },
        { id: 'volEmail', label: 'Email Address' },
        { id: 'volPhone', label: 'Phone Number' },
        { id: 'volCity', label: 'City / Area' },
        { id: 'vehicleType', label: 'Vehicle Type' },
        { id: 'volAvail', label: 'Availability' },
    ];
    if (!validateFields(required)) return;

    const btn = event.target;
    btn.textContent = 'Submitting…';
    btn.disabled = true;

    setTimeout(() => {
        btn.textContent = '✅ Application Submitted!';
        btn.style.background = '#22a962';
        showToast('🚴 Application received! Expect approval within 48 hours.');
        submitToServer('/api/volunteer', collectFormData(['volFirst', 'volLast', 'volEmail', 'volPhone', 'volCity', 'vehicleType', 'vehicleReg', 'volAvail', 'volHours', 'emergContact', 'emergPhone', 'volMotivation']));
    }, 1400);
}

/* ─── Newsletter ─── */
function subscribeNewsletter() {
    const input = document.getElementById('footerEmail');
    if (!input) return;
    const email = input.value.trim();
    if (!email || !email.includes('@')) {
        showToast('⚠️ Please enter a valid email address.');
        return;
    }
    showToast('📬 You\'re subscribed! Thanks for joining us.');
    input.value = '';
    submitToServer('/api/newsletter', { email });
}

/* ─── Download Report (Impact) ─── */
function downloadReport() {
    showToast('📄 Report download starting…');
    // In a real app, this would call the server to generate/serve the PDF
    setTimeout(() => {
        showToast('✅ Report downloaded! Check your downloads folder.');
    }, 1500);
}

/* ─── Helper: Collect form data ─── */
function collectFormData(ids) {
    const data = {};
    ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) data[id] = el.value.trim();
    });
    return data;
}

/* ─── Helper: Submit to backend ─── */
async function submitToServer(endpoint, payload) {
    try {
        const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        const json = await res.json();
        console.log(`[FoodBridge] ${endpoint} response:`, json);
    } catch (err) {
        // Server not running in static mode – silently ignore
        console.warn(`[FoodBridge] Backend not reachable (${endpoint}). Data logged locally:`, payload);
    }
}

/* ─── Page Detection & Init ─── */
(function init() {
    const path = window.location.pathname;

    if (path.endsWith('index.html') || path === '/' || path.endsWith('/')) {
        initHomePage();
    }

    if (path.endsWith('impact.html')) {
        initImpactPage();
    }

    if (path.endsWith('logistics.html')) {
        initLogisticsPage();
    }

    // Always run these on every page
    buildBarChart();      // safe – only runs if container exists
    spawnMapPins('mapPins');    // safe – only runs if container exists
    spawnMapPins('logMapPins'); // safe – only runs if container exists

    // Intersection Observer – fade-in cards on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.style.opacity = '1';
                e.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.card, .impact-card, .log-stat, .feature-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity .5s ease, transform .5s ease';
        observer.observe(el);
    });
})();