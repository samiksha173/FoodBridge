/* =============================================
   FoodBridge AI — Backend Server (server.js)
   ============================================= */

'use strict';

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5500;

/* ─── Middleware ─── */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve the frontend folder as static files
app.use(express.static(path.join(__dirname, '../frontend')));

/* ─── In-memory "database" (replace with real DB in production) ─── */
const db = {
    donors: [],
    requests: [],
    volunteers: [],
    newsletter: [],
    deliveries: generateDeliveries(),
};

/* ─── Seed: Mock Deliveries ─── */
function generateDeliveries() {
    const statuses = ['In Transit', 'Pickup Complete', 'Arriving', 'Pickup Pending'];
    const donors = ['The Green Café', 'FreshMart Kothrud', 'Hotel Aashiyana', 'Metro Bakery', 'BigBasket Outlet'];
    const recips = ['Pune Food Bank', 'Camp Shelter', 'Mid-day NGO', 'Children\'s Home', 'Yerwada Food Bank'];
    const items = ['Cooked meals', 'Vegetables', 'Rice & Dal', 'Bread', 'Mixed groceries'];
    const result = [];

    for (let i = 1; i <= 20; i++) {
        result.push({
            id: `#BR-${4800 + i}`,
            donor: donors[i % donors.length],
            recipient: recips[i % recips.length],
            items: items[i % items.length],
            eta: `${5 + (i * 3) % 45} mins`,
            status: statuses[i % statuses.length],
            createdAt: new Date(Date.now() - i * 60000).toISOString(),
        });
    }
    return result;
}

/* ─── Helper: API Response ─── */
function respond(res, data, status = 200) {
    res.status(status).json({ success: status < 400, ...data });
}

/* ─── Helper: Validate required fields ─── */
function missingFields(body, required) {
    return required.filter(f => !body[f] || String(body[f]).trim() === '');
}

/* ═══════════════════════════════════════════
   API ROUTES
═══════════════════════════════════════════ */

/* ── POST /api/donate ── */
app.post('/api/donate', (req, res) => {
    const required = ['businessName', 'contactName', 'contactPhone', 'contactEmail', 'businessType', 'pickupAddress'];
    const missing = missingFields(req.body, required);

    if (missing.length) {
        return respond(res, { message: `Missing required fields: ${missing.join(', ')}` }, 400);
    }

    const donor = {
        id: `DONOR-${Date.now()}`,
        ...req.body,
        approved: false,
        createdAt: new Date().toISOString(),
    };

    db.donors.push(donor);
    console.log(`[FoodBridge] New donor registered: ${donor.businessName} (${donor.id})`);

    respond(res, {
        message: 'Donor registration received. You will be approved within 24 hours.',
        donorId: donor.id,
    });
});

/* ── GET /api/donors ── */
app.get('/api/donors', (req, res) => {
    respond(res, { count: db.donors.length, donors: db.donors });
});

/* ── POST /api/request ── */
app.post('/api/request', (req, res) => {
    const required = ['orgName', 'orgType', 'reqContact', 'reqPhone', 'reqEmail', 'reqAddress', 'foodNeeded'];
    const missing = missingFields(req.body, required);

    if (missing.length) {
        return respond(res, { message: `Missing required fields: ${missing.join(', ')}` }, 400);
    }

    const request = {
        id: `REQ-${Date.now()}`,
        ...req.body,
        status: 'Matching',
        createdAt: new Date().toISOString(),
    };

    db.requests.push(request);
    console.log(`[FoodBridge] New food request from: ${request.orgName} (${request.id})`);

    respond(res, {
        message: 'Request submitted. We are matching you with donors now.',
        requestId: request.id,
    });
});

/* ── GET /api/requests ── */
app.get('/api/requests', (req, res) => {
    respond(res, { count: db.requests.length, requests: db.requests });
});

/* ── POST /api/volunteer ── */
app.post('/api/volunteer', (req, res) => {
    const required = ['volFirst', 'volLast', 'volEmail', 'volPhone', 'volCity', 'vehicleType', 'volAvail'];
    const missing = missingFields(req.body, required);

    if (missing.length) {
        return respond(res, { message: `Missing required fields: ${missing.join(', ')}` }, 400);
    }

    const volunteer = {
        id: `VOL-${Date.now()}`,
        name: `${req.body.volFirst} ${req.body.volLast}`,
        ...req.body,
        approved: false,
        totalDeliveries: 0,
        createdAt: new Date().toISOString(),
    };

    db.volunteers.push(volunteer);
    console.log(`[FoodBridge] New volunteer applied: ${volunteer.name} (${volunteer.id})`);

    respond(res, {
        message: 'Application received! Approval within 48 hours.',
        volunteerId: volunteer.id,
    });
});

/* ── GET /api/volunteers ── */
app.get('/api/volunteers', (req, res) => {
    respond(res, { count: db.volunteers.length, volunteers: db.volunteers });
});

/* ── POST /api/newsletter ── */
app.post('/api/newsletter', (req, res) => {
    const { email } = req.body;
    if (!email || !email.includes('@')) {
        return respond(res, { message: 'Invalid email address.' }, 400);
    }

    if (db.newsletter.includes(email)) {
        return respond(res, { message: 'You are already subscribed!' });
    }

    db.newsletter.push(email);
    console.log(`[FoodBridge] Newsletter subscription: ${email}`);
    respond(res, { message: 'Subscribed successfully!' });
});

/* ── GET /api/metrics ── */
app.get('/api/metrics', (req, res) => {
    respond(res, {
        mealsShared: 1248590 + db.requests.length * 42,
        wasteDiverted: 450.2 + db.donors.length * 1.2,
        activeZones: 142,
        activeDonors: 3840 + db.donors.length,
        volunteers: 12700 + db.volunteers.length,
        cities: 28,
    });
});

/* ── GET /api/deliveries ── */
app.get('/api/deliveries', (req, res) => {
    const { status, limit = 20 } = req.query;
    let results = db.deliveries;
    if (status) results = results.filter(d => d.status === status);
    respond(res, { count: results.length, deliveries: results.slice(0, Number(limit)) });
});

/* ── GET /api/deliveries/:id ── */
app.get('/api/deliveries/:id', (req, res) => {
    const delivery = db.deliveries.find(d => d.id === req.params.id);
    if (!delivery) return respond(res, { message: 'Delivery not found.' }, 404);
    respond(res, { delivery });
});

/* ── GET /api/heatmap ── */
app.get('/api/heatmap', (req, res) => {
    const pins = [
        { lat: 18.5204, lng: 73.8567, type: 'donor', label: 'The Green Café' },
        { lat: 18.5000, lng: 73.8600, type: 'need', label: 'Pune Food Bank' },
        { lat: 18.5310, lng: 73.8474, type: 'transit', label: 'Route #BR-4821' },
        { lat: 18.4900, lng: 73.8700, type: 'donor', label: 'FreshMart Kothrud' },
        { lat: 18.5500, lng: 73.8400, type: 'need', label: 'Camp Shelter' },
    ];
    respond(res, { pins });
});

/* ── GET /api/ai-insights ── */
app.get('/api/ai-insights', (req, res) => {
    respond(res, {
        routesComputed: 247,
        avgDeliveryTime: '18 min',
        emissionsSaved: '142 kg CO₂',
        reroutesTriggered: 12,
        surplusPredictions: [
            { zone: 'Koregaon Park', likelihood: 0.87, peakTime: '7 PM' },
            { zone: 'Kothrud', likelihood: 0.74, peakTime: '2 PM' },
            { zone: 'Hadapsar', likelihood: 0.61, peakTime: '12 PM' },
        ],
    });
});

/* ─── Health Check ─── */
app.get('/api/health', (req, res) => {
    respond(res, { status: 'OK', uptime: process.uptime().toFixed(1) + 's', timestamp: new Date().toISOString() });
});

/* ─── Fallback: Serve index.html for any unknown routes ─── */
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

/* ─── Start Server ─── */
app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════╗
║       FoodBridge AI — Server Running      ║
╠═══════════════════════════════════════════╣
║  Port  : ${PORT}                              ║
║  Mode  : ${process.env.NODE_ENV || 'development'}                      ║
║  URL   : http://localhost:${PORT}             ║
╚═══════════════════════════════════════════╝
  `);
});

module.exports = app;