export default function Header() {
    return (
        <div style={{
            background: "green",
            color: "white",
            padding: "20px",
            borderRadius: "12px",
            marginBottom: "10px"
        }}>
            <h2>Welcome to FoodBridge AI</h2>
            <p>Connect surplus food with those who need it most</p>

            <div style={{ marginTop: "10px" }}>
                <button>Donate Food</button>
                <button style={{ marginLeft: "10px" }}>Request Food</button>
            </div>
        </div>
    );
}