export async function getRequests() {
    const res = await fetch("http://localhost:5000/requests");
    return res.json();
}