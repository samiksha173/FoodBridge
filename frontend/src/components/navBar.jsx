export default function NavBar() {
    return (
        <div style={{
            display: "flex",
            justifyContent: "space-around",
            background: "#ffffff",
            padding: "12px",
            borderRadius: "10px",
            marginTop: "-20px",        // pulls it up to overlap the header bottom
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
        }}>
            <div>🏠 Home</div>
            <div>🍱 Donate</div>
            <div>📄 Request</div>
            <div>🗺️ Map</div>
            <div>👤 Profile</div>
        </div>
    );
}