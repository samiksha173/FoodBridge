const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// TEST ROUTE
app.get("/", (req, res) => {
    res.send("FoodBridge Backend Running");
});

// DONATE BUTTON
app.post("/donate", (req, res) => {
    console.log("Donate button clicked");
    res.json({ message: "Thank you for donating food! ❤️" });
});

// CARD ACTIONS
app.post("/action", (req, res) => {
    const { type } = req.body;

    let message = "";

    if (type === "donate") {
        message = "Redirecting to donation system...";
    } else if (type === "support") {
        message = "Finding support near you...";
    } else if (type === "volunteer") {
        message = "Volunteer request received!";
    }

    console.log("Action:", type);

    res.json({ message });
});

// START SERVER
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});