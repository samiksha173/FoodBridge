// Simple animation for stats counting

const stats = document.querySelectorAll(".stat h2");

stats.forEach(stat => {
    let target = parseInt(stat.innerText.replace(/,/g, ""));
    let count = 0;
    let increment = target / 100;

    function update() {
        count += increment;
        if (count < target) {
            stat.innerText = Math.floor(count).toLocaleString();
            requestAnimationFrame(update);
        } else {
            stat.innerText = target.toLocaleString();
        }
    }

    update();
});

// NAVIGATION (Navbar clicks)
document.querySelectorAll("nav a").forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault();

        const page = link.textContent.trim().toLowerCase();

        if (page === "dashboard") window.location.href = "index.html";
        if (page === "donations") window.location.href = "donations.html";
        if (page === "impact") window.location.href = "impact.html";
        if (page === "logistics") window.location.href = "logistics.html";
    });
});


// BUTTON ACTIONS
document.querySelector(".primary")?.addEventListener("click", () => {
    fetch("http://localhost:3000/donate", {
        method: "POST"
    })
        .then(res => res.json())
        .then(data => alert(data.message));
});

document.querySelector(".secondary")?.addEventListener("click", () => {
    window.location.href = "map.html";
});


// CARD ACTIONS
document.querySelectorAll(".card").forEach((card, index) => {
    card.addEventListener("click", () => {

        let type = "";

        if (index === 0) type = "donate";
        if (index === 1) type = "support";
        if (index === 2) type = "volunteer";

        fetch("http://localhost:3000/action", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ type })
        })
            .then(res => res.json())
            .then(data => alert(data.message));
    });
});