let data = [
    { title: "Flood Relief", location: "Bihar", people: 500, disaster: true },
    { title: "Orphanage", location: "Delhi", people: 120, disaster: false },
    { title: "Community Kitchen", location: "Mumbai", people: 80, disaster: false }
];

function calculatePriority(req) {
    let score = 0;

    if (req.disaster) score += 50;
    score += req.people * 0.1;

    if (score > 60) return "HIGH";
    if (score > 30) return "MEDIUM";
    return "LOW";
}

exports.getRequests = (req, res) => {
    const result = data.map(r => ({
        ...r,
        priority: calculatePriority(r)
    }));

    res.json(result);
};